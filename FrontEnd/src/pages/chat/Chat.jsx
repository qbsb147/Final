import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, styled } from '@mui/material';
import ChatList from './components/ChatList.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import axios from 'axios';
import { chatService } from '@/api/chat.js';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import useAuthStore from '@/store/authStore.js';
import { onlineWsService } from '@/api/onlineWsService.js';
import { roomWsService } from '@/api/roomWsService.js';
import { chatFacade } from '@/services/chatFacade';
const { processMessages, parsePayload, updateChatState, updateLastMessage, formatTime } = chatFacade;

const ChatPage = () => {
  const { loginUser } = useAuthStore();
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [page, setPage] = useState(0);
  const [statusTick, setStatusTick] = useState(0);
  const next_message_no = React.useRef(0);
  const activeChatRef = useRef(activeChat);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    console.log('렌더된 chats:', chats);
  }, [chats]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatList = await chatService.chatList();
        chatList.forEach((chat) => {
          if (loginUser?.role === 'WORCATION') {
            chat.room_name = chat.owner_nick_name;
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
    if (!activeChat) return;

    let roomWs;
    let isMounted = true;

    // useEffect 범위에서 선언
    const handleRead = (event) => {
      const payload = parsePayload(event.data);
      if (payload.type === 'READ' && Number(payload.room_no) === Number(activeChatRef.current)) {
        const message_no = payload.message_no;
        setMessages((prev) => {
          const startIndex = prev.findIndex((msg) => msg.message_no >= message_no);
          if (startIndex === -1) return prev;
          const newMessages = [...prev];
          for (let i = startIndex; i < newMessages.length; i++) {
            newMessages[i] = { ...newMessages[i], unread_count: newMessages[i].unread_count - 1 };
          }
          return newMessages;
        });
      }
    };

    const setup = async () => {
      setLoading(true);
      try {
        const response = await chatService.getMessageList(activeChat, { page: 0 });
        const processed = processMessages(response);
        if (!isMounted) return;

        setMessages(processed);
        setHasMore((response?.content?.length ?? response.length) > 0);
        next_message_no.current = processed.length > 0 ? Math.max(...processed.map((m) => m.message_no ?? 0)) + 1 : 1;

        roomWs = await roomWsService.connect(activeChat);
        if (!isMounted) return;

        roomWs.addEventListener('message', handleRead);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setup();

    return () => {
      isMounted = false;
      if (roomWs) roomWs.removeEventListener('message', handleRead);
      roomWsService.close(activeChat);
    };
  }, [activeChat]);
  // 단일 온라인 WebSocket(ONLINE endpoint)에서 온라인/채팅 모두 처리
  useEffect(() => {
    const onlineWs = onlineWsService.getSocket();
    if (!onlineWs) return;

    const handleOnlineMessage = (event) => {
      try {
        const payload = parsePayload(event.data);

        // 온라인 상태 변경
        if (payload.type === 'STATUS') {
          setChats((prev) =>
            prev.map((chat) => {
              if (chat.other_participants) {
                const updateParticipants = chat.other_participants.map((p) =>
                  p.public_uuid === payload.public_uuid ? { ...p, status: payload.status } : p
                );
                return { ...chat, other_participants: updateParticipants };
              }
              return chat;
            })
          );
          setStatusTick((prev) => prev + 1);
        }

        // 채팅 메시지 수신: 목록(last_message/unread_count)은 항상 갱신
        if (payload.type === 'MESSAGE') {
          setChats((prev) => updateChatState(prev, payload, activeChat));

          // 현재 보고 있는 방이면 메시지 리스트에도 추가
          if (activeChat && Number(payload.room_no) === Number(activeChat)) {
            setMessages((prev) => {
              const all = [...prev, payload];
              const maxNo = Math.max(...all.map((m) => m.message_no ?? 0));
              next_message_no.current = Math.max(next_message_no.current, maxNo + 1);
              return all;
            });
          }
        }
      } catch (error) {
        console.error('온라인/채팅 메시지 처리 중 오류:', error);
      }
    };

    onlineWs.addEventListener('message', handleOnlineMessage);

    return () => {
      onlineWs.removeEventListener('message', handleOnlineMessage);
    };
  }, [activeChat]);

  const loadOlderMessages = async () => {
    if (!activeChat || loadingOlder || !hasMore || messages.length === 0) return 0;
    setLoadingOlder(true);
    try {
      const nextPage = (page ?? 0) + 1;
      const response = await chatService.getMessageList(activeChat, { page: nextPage });
      const olderMessages = processMessages(response);
      if (olderMessages.length > 0) {
        setMessages((prev) => [...olderMessages, ...prev]);
        setPage(nextPage);
      } else {
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

    const currentChat = chats.find((chat) => Number(chat.room_no) === Number(activeChat));
    const participantsCount = await chatService.getParticipantsCount(activeChat);

    const newMessage = {
      room_no: activeChat,
      content,
      public_uuid: loginUser?.public_uuid,
      message_no: next_message_no.current,
      other_people_count: currentChat?.other_participants?.length || 0,
      unread_count: currentChat?.other_participants?.length + 1 - participantsCount || 0,
      type: 'MESSAGE',
    };

    console.log('전송할 메시지:', newMessage);

    try {
      await onlineWsService.sendMessage(newMessage);
      next_message_no.current++;
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
    setMessages((prev) => [...prev, newMessage]);
    setChats((prev) => updateLastMessage(prev, activeChat, content, { unreadCount: 0 }));
  };

  const handleSendImage = async (imageFile, message) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('message', message || '');
      formData.append('chatId', activeChat);

      const response = await axios.post('/api/chat/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newMessage = {
        room_no: response.data.room_no,
        content: message || '',
        image: response.data.imageUrl || URL.createObjectURL(imageFile),
        sentTime: formatTime(),
        create_time: formatTime(),
        create_time_ts: Date.now(),
        public_uuid: loginUser?.public_uuid,
        message_no: next_message_no.current,
      };

      setMessages((prev) => [...prev, newMessage]);
      setChats((prev) =>
        updateLastMessage(prev, activeChat, message || '사진을 보냈습니다.', { createTime: '방금', unreadCount: 0 })
      );
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 전송에 실패했습니다.');
    }
  };

  const handleChatSelect = (room_no) => {
    setActiveChat(room_no);
    setChats((prev) => prev.map((chat) => (chat.room_no === room_no ? { ...chat, unread_count: 0 } : chat)));
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
      <ChatList chats={chats} activeChat={activeChat} onChatSelect={handleChatSelect} statusTick={statusTick} />
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
        <EmptyChatBox>
          <Typography variant="h6" color="text.secondary">
            왼쪽에서 채팅방을 선택해주세요.
          </Typography>
        </EmptyChatBox>
      )}
    </ChatContainer>
  );
};

export default ChatPage;

const EmptyChatBox = styled('div')`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
`;

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
