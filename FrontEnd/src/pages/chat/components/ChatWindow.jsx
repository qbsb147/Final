import React, { useRef, useEffect, useState } from 'react';
import { IconButton, styled, Avatar, Box, Typography, Badge } from '@mui/material';
import { Paperclip, Send, Image as ImageIcon, X } from 'lucide-react';
import useAuthStore from '../../../store/authStore';

const ChatWindow = ({
  activeChat,
  chats,
  messages,
  isTyping,
  onSendMessage,
  onBack,
  onSendImage,
  onLoadMore,
  loadingOlder,
  hasMore,
}) => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { loginUser } = useAuthStore();
  const messageListRef = useRef(null);

  const formatRelativeTime = (input) => {
    if (!input) return '';
    let ts;
    if (typeof input === 'number') {
      ts = input;
    } else {
      const s = String(input).trim();
      // handle custom comma-separated timestamp like: 2025,12,28,22,3,45,56355000
      if (/^\d+(,\d+)+$/.test(s)) {
        const parts = s.split(',').map((p) => Number(p));
        const [y, m, d, hh, mm, ss, frac] = parts;
        const year = y || 1970;
        const month = m ? m - 1 : 0;
        const day = d || 1;
        const hour = hh || 0;
        const minute = mm || 0;
        const second = ss || 0;
        let ms = 0;
        if (typeof frac !== 'undefined' && !Number.isNaN(frac)) {
          // frac may be nanoseconds or microseconds; convert to milliseconds
          // if length >=7 assume nanoseconds -> /1e6, else if >=4 assume microseconds -> /1e3
          const fracStr = String(parts[6]);
          if (fracStr.length >= 7) ms = Math.floor(frac / 1e6);
          else if (fracStr.length >= 4) ms = Math.floor(frac / 1e3);
          else ms = frac;
        }
        ts = new Date(year, month, day, hour, minute, second, ms).getTime();
      } else {
        ts = Date.parse(s);
      }
    }
    if (Number.isNaN(ts)) return String(input);

    const diff = Date.now() - ts;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 5) return `방금`;
    if (seconds < 60) return `${seconds}초 전`;
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 30) return `${days}일 전`;
    if (months < 12) return `${months}개월 전`;
    return `${years}년 전`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 이미지 선택 핸들러
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 업로드 버튼 클릭 핸들러
  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  const prevLastIdRef = useRef(null);

  useEffect(() => {
    const currentLastId = messages?.[messages.length - 1]?.message_no ?? null;
    const prevLastId = prevLastIdRef.current;
    // If the last message changed (new message appended), scroll to bottom.
    if (currentLastId !== prevLastId) {
      scrollToBottom();
    }
    prevLastIdRef.current = currentLastId;
  }, [messages]);

  // Scroll-up to load older messages
  const handleScroll = async (e) => {
    const el = e.currentTarget;
    if (!el) return;
    if (el.scrollTop <= 80 && onLoadMore && hasMore && !loadingOlder) {
      const prevScrollHeight = el.scrollHeight;
      const prevScrollTop = el.scrollTop;
      try {
        const added = await onLoadMore();
        // allow DOM to update, then adjust scroll to keep viewport stable
        requestAnimationFrame(() => {
          const newScrollHeight = el.scrollHeight;
          el.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
        });
      } catch (err) {
        // ignore
      }
    }
  };

  // 이미지 전송 핸들러
  const handleSendImageMessage = () => {
    if (selectedImage) {
      onSendImage(selectedImage, message);
      setSelectedImage(null);
      setImagePreview(null);
      setMessage('');
      if (inputRef.current) {
        inputRef.current.textContent = '';
      }
    }
  };

  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    if (message.trim() || selectedImage) {
      if (selectedImage) {
        handleSendImageMessage();
      } else {
        onSendMessage(message);
        setMessage('');
        if (inputRef.current) {
          inputRef.current.textContent = '';
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!activeChat) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">채팅방을 선택해주세요</Typography>
        <Typography>왼쪽에서 대화할 채팅방을 선택하거나 새 대화를 시작하세요.</Typography>
      </Box>
    );
  }

  const currentChat = chats.find((chat) => chat.room_no === activeChat);

  return (
    <ChatContainer>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          ←
        </IconButton>
        <Avatar src={currentChat?.avatar} sx={{ mr: 2 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {currentChat?.name || '채팅방'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentChat?.online ? '온라인' : '오프라인'}
          </Typography>
        </Box>
      </Box>

      <MessageList ref={messageListRef} onScroll={handleScroll}>
        {messages?.map((msg) => {
          const isMe = msg.nick_name === loginUser?.nick_name;
          const timeText = formatRelativeTime(msg.date_time ?? Date.now());
          return (
            <Box
              key={msg.message_no ?? Math.random()}
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                gap: 1,
                mb: 1,
              }}
            >
              {isMe ? (
                <>
                  <Typography variant="caption" sx={{ color: '#888', fontSize: '0.75rem', alignSelf: 'flex-end' }}>
                    {timeText}
                  </Typography>
                  <MessageBubble isMe={isMe}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      {msg.image ? (
                        <Box>
                          {msg.content && <div>{msg.content}</div>}
                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="전송된 이미지"
                              style={{
                                maxWidth: '200px',
                                maxHeight: '200px',
                                borderRadius: '8px',
                                marginTop: '8px',
                              }}
                            />
                          )}
                        </Box>
                      ) : (
                        <div>{msg.content}</div>
                      )}
                    </Box>
                  </MessageBubble>
                </>
              ) : (
                <>
                  <MessageBubble isMe={isMe}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      {msg.image ? (
                        <Box>
                          {msg.content && <div>{msg.content}</div>}
                          {msg.image && (
                            <img
                              src={msg.image}
                              alt="전송된 이미지"
                              style={{
                                maxWidth: '200px',
                                maxHeight: '200px',
                                borderRadius: '8px',
                                marginTop: '8px',
                              }}
                            />
                          )}
                        </Box>
                      ) : (
                        <div>{msg.content}</div>
                      )}
                    </Box>
                  </MessageBubble>
                  <Typography variant="caption" sx={{ color: '#888', fontSize: '0.75rem', alignSelf: 'flex-end' }}>
                    {timeText}
                  </Typography>
                </>
              )}
            </Box>
          );
        })}
        {isTyping && (
          <MessageBubble isMe={false}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#666',
                  margin: '0 2px',
                  animation: 'bounce 1.4s infinite ease-in-out',
                  '&:nth-of-type(1)': { animationDelay: '0s' },
                  '&:nth-of-type(2)': { animationDelay: '0.2s' },
                  '&:nth-of-type(3)': { animationDelay: '0.4s' },
                }}
              />
              <Box
                sx={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#666',
                  margin: '0 2px',
                  animation: 'bounce 1.4s infinite ease-in-out',
                  animationDelay: '0.2s',
                }}
              />
              <Box
                sx={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#666',
                  margin: '0 2px',
                  animation: 'bounce 1.4s infinite ease-in-out',
                  animationDelay: '0.4s',
                }}
              />
            </Box>
          </MessageBubble>
        )}
        <div ref={messagesEndRef} />
      </MessageList>

      {/* 이미지 미리보기 영역 */}
      {imagePreview && (
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid #e0e0e0',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '200px',
              height: '200px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #e0e0e0',
            }}
          >
            <img
              src={imagePreview}
              alt="미리보기"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <IconButton
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
              size="small"
              sx={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                },
              }}
            >
              <X size={16} />
            </IconButton>
          </Box>
        </Box>
      )}

      <InputContainer>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <IconButton onClick={handleImageButtonClick}>
          <Badge color="primary" variant="dot" invisible={!selectedImage}>
            <ImageIcon size={20} />
          </Badge>
        </IconButton>
        <IconButton>
          <Paperclip size={20} />
        </IconButton>
        <Input
          ref={inputRef}
          contentEditable
          onInput={(e) => setMessage(e.currentTarget.textContent || '')}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={!message.trim() && !selectedImage}
          sx={{
            color: '#fff',
            backgroundColor: '#FFD700',
            '&:hover': { backgroundColor: '#FFC000' },
            '&:disabled': {
              backgroundColor: '#e0e0e0',
              color: '#a0a0a0',
            },
            ml: 1,
          }}
        >
          <Send size={20} />
        </IconButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatWindow;

const ChatContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  backgroundColor: '#f5f5f5',
});

const MessageList = styled('div')({
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
});

const MessageBubble = styled('div')(({ isMe }) => ({
  width: 'fit-content',
  padding: '10px 16px',
  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  backgroundColor: isMe ? '#FFD700' : '#fff',
  color: isMe ? '#000' : '#333',
  marginBottom: '12px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  wordBreak: 'break-word',
}));

const InputContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  backgroundColor: '#fff',
  borderTop: '1px solid #e0e0e0',
});

const Input = styled('div')({
  flex: 1,
  minHeight: '48px',
  maxHeight: '120px',
  padding: '12px 16px',
  borderRadius: '24px',
  border: '1px solid #e0e0e0',
  margin: '0 8px',
  outline: 'none',
  overflowY: 'auto',
  '&:focus': {
    borderColor: '#FFD700',
    boxShadow: '0 0 0 2px rgba(255, 215, 0, 0.2)',
  },
});
