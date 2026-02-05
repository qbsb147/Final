import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import ChatList from './components/ChatList.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import axios from 'axios';
import { chatService } from '../../api/chat.js';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import useAuthStore from '../../store/authStore.js';
import { chatWsService } from '../../api/chatWsService.js';

const ChatPage = () => {
  const { loginUser } = useAuthStore();
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [page, setPage] = useState(0);

  const formatNow = () => new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatList = await chatService.chatList();
        chatList.forEach((chat) => {
          if (loginUser?.role === 'WORCATION') {
            chat.name = chat.name.slice(chat.name.length - loginUser.nick_name.length, chat.name.length);
          } else {
            chat.name = chat.name.slice(0, chat.name.length - loginUser.nick_name.length);
          }
        });
        setChats(chatList);
      } catch (error) {
        console.error('채팅방 목록 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [loginUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;

      setLoading(true);
      setHasMore(true);
      setMessages([]);
      setPage(0);

      try {
        // load latest messages (page 0)
        const response = await chatService.getMessageList(activeChat, { page: 0 });
        // backend returns PageResponse with content array (sorted DESC by messageNo)
        const messageList = Array.isArray(response) ? response : response?.content || [];
        // reverse so UI shows oldest -> newest
        let ordered = Array.isArray(messageList) ? messageList.slice().reverse() : messageList;
        // normalize timestamps: prefer date_time from server, parse into numeric ts
        ordered = ordered.map((m) => {
          const ts = m?.date_time
            ? Date.parse(m.date_time)
            : (m?.create_time_ts ?? (m?.create_time ? Date.parse(m.create_time) : undefined));
          return { ...m, create_time_ts: ts };
        });

        setMessages(ordered);

        // set current page to 0; if received less than page size, no more older messages
        setPage(0);
        setHasMore((messageList.length ?? 0) > 0);

        const ws = chatWsService.connect?.(activeChat);
        if (ws) {
          ws.onmessage = (event) => {
            try {
              const payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
              console.log('서버에서 메시지 수신:', payload);

              // prefer server-provided date_time if available
              const ts = payload?.date_time ? Date.parse(payload.date_time) : Date.now();
              const now = new Date(ts).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
              const msg =
                typeof payload === 'object'
                  ? { ...payload, create_time: now, sentTime: now, create_time_ts: ts }
                  : payload;
              setMessages((prev) => [...prev, msg]);

              // update chat list last_message and unread_count, store last_time_ts
              setChats((prevChats) =>
                prevChats.map((chat) => {
                  if (chat.room_no === payload.room_no) {
                    const prevUnread = chat.unread_count ?? 0;
                    return {
                      ...chat,
                      last_message: payload.content || (payload.image ? '사진을 보냈습니다.' : ''),
                      create_time: now,
                      last_time_ts: ts,
                      unread_count: activeChat === payload.room_no ? 0 : prevUnread + 1,
                    };
                  }
                  return chat;
                })
              );
            } catch (e) {
              console.error('WS onmessage 처리 중 오류', e);
            }
          };
        }
      } catch (error) {
        console.error('메시지 목록 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    return () => {
      chatWsService.close?.(activeChat);
    };
  }, [activeChat]);

  const loadOlderMessages = async () => {
    if (!activeChat || loadingOlder || !hasMore) return 0;
    // if no messages loaded yet, nothing to page from
    if (!messages || messages.length === 0) return 0;

    setLoadingOlder(true);
    try {
      const nextPage = (page ?? 0) + 1;
      const response = await chatService.getMessageList(activeChat, { page: nextPage });
      const olderMessages = Array.isArray(response) ? response : response?.content || [];
      if (olderMessages.length > 0) {
        // reverse server page (DESC) so oldest messages in that page come first
        let orderedOlder = Array.isArray(olderMessages) ? olderMessages.slice().reverse() : olderMessages;
        orderedOlder = orderedOlder.map((m) => {
          const ts = m?.date_time
            ? Date.parse(m.date_time)
            : (m?.create_time_ts ?? (m?.create_time ? Date.parse(m.create_time) : undefined));
          return { ...m, create_time_ts: ts };
        });
        setMessages((prev) => [...orderedOlder, ...prev]);
        setPage(nextPage);
      }
      if ((olderMessages.length ?? 0) === 0) {
        setHasMore(false);
      }
      return olderMessages.length;
    } catch (error) {
      console.error('이전 메시지 불러오기 실패:', error);
      return 0;
    } finally {
      setLoadingOlder(false);
    }
  };

  const handleSend = async (content) => {
    if (!content.trim()) return;

    const newMessage = {
      // activeChat holds the room id
      room_no: activeChat,
      content,
      user_no: loginUser?.user_no,
      nick_name: loginUser?.nick_name,
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      await chatWsService.sendMessage(newMessage.room_no, newMessage);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }

    // 채팅방 목록의 마지막 메시지 업데이트
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.room_no === activeChat
          ? {
              ...chat,
              last_message: content,
              create_time: formatNow(),
              unread_count: 0,
            }
          : chat
      )
    );
  };

  const handleSendImage = async (imageFile, message) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('message', message || '');
      formData.append('chatId', activeChat);

      // 이미지 업로드 API 호출 (실제 API 엔드포인트로 변경 필요)
      const response = await axios.post('/api/chat/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 성공 시 채팅 메시지에 추가
      const newMessage = {
        room_no: response.data.room_no,
        content: message || '',
        image: response.data.imageUrl || URL.createObjectURL(imageFile),
        sentTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        create_time: formatNow(),
        create_time_ts: Date.now(),
        user_no: loginUser?.user_no,
        nick_name: loginUser?.nick_name,
      };

      setMessages((prev) => [...prev, newMessage]);

      // 채팅방 목록의 마지막 메시지 업데이트
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.room_no === activeChat
            ? {
                ...chat,
                last_message: message || '사진을 보냈습니다.',
                create_time: '방금',
                unread_count: 0,
              }
            : chat
        )
      );
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 전송에 실패했습니다.');
    }
  };

  const handleChatSelect = (room_no) => {
    setActiveChat(room_no);
    // 읽음 처리
    setChats((prevChats) => prevChats.map((chat) => (chat.room_no === room_no ? { ...chat, unread_count: 0 } : chat)));
  };

  const handleBack = () => {
    setActiveChat(null);
  };
  if (loading) {
    return (
      <LoadingOverlay>
        <AiOutlineLoading3Quarters className="spinner" size={80} color="#FFD600" />
      </LoadingOverlay>
    );
  }
  return (
    <ChatContainer>
      <ChatList chats={chats} activeChat={activeChat} onChatSelect={handleChatSelect} />
      {activeChat ? (
        <ChatWindow
          activeChat={activeChat}
          chats={chats}
          messages={messages}
          onSendMessage={handleSend}
          onSendImage={handleSendImage}
          onBack={handleBack}
          isTyping={false}
          onLoadMore={loadOlderMessages}
          loadingOlder={loadingOlder}
          hasMore={hasMore}
        />
      ) : (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            왼쪽에서 채팅방을 선택해주세요.
          </Typography>
        </Box>
      )}
    </ChatContainer>
  );
};

export default ChatPage;

const LoadingOverlay = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  .spinner {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ChatContainer = styled(Box)({
  display: 'flex',
  height: 'calc(100vh - 180px)',
  backgroundColor: '#fff',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
});
