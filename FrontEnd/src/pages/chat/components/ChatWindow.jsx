import React, { useRef, useEffect, useMemo, useState } from 'react';
import { IconButton, styled, Avatar, Badge, Typography } from '@mui/material';
import { Paperclip, Send, Image as ImageIcon, X } from 'lucide-react';
import useAuthStore from '../../../store/authStore';
import { chatFacade } from '@/services/chatFacade';
const { handleSendMessage, handleKeyDown, scrollToBottom, handleImageSelect, formatRelativeTime } = chatFacade;

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
  const messageListRef = useRef(null);

  const { loginUser } = useAuthStore();
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const prevLastIdRef = useRef(null);

  // 이미지 버튼 클릭
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 메시지 변화 시 스크롤
  useEffect(() => {
    const currentLastId = messages?.[messages.length - 1]?.message_no ?? null;
    const prevLastId = prevLastIdRef.current;
    if (currentLastId !== prevLastId || message === '') {
      scrollToBottom(messagesEndRef);
    }
    prevLastIdRef.current = currentLastId;
  }, [messages, message]);

  // 스크롤 업 → 이전 메시지 불러오기
  const handleScroll = async (e) => {
    const el = e.currentTarget;
    if (!el) return;
    if (el.scrollTop <= 80 && onLoadMore && hasMore && !loadingOlder) {
      const prevScrollHeight = el.scrollHeight;
      const prevScrollTop = el.scrollTop;
      try {
        await onLoadMore();
        requestAnimationFrame(() => {
          const newScrollHeight = el.scrollHeight;
          el.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
        });
      } catch {
        // ignore
      }
    }
  };

  if (!activeChat) {
    return (
      <EmptyChatBox>
        <EmptyTitle variant="h6">채팅방을 선택해주세요</EmptyTitle>
        <EmptyDesc>왼쪽에서 대화할 채팅방을 선택하거나 새 대화를 시작하세요.</EmptyDesc>
      </EmptyChatBox>
    );
  }

  const currentChat = useMemo(() => {
    return chats.find((chat) => Number(chat.room_no) === Number(activeChat));
  }, [chats, activeChat]);

  const otherParticipantCount = useMemo(() => {
    const list = currentChat?.other_participants;
    if (!Array.isArray(list)) return 0;
    return list.filter((p) => p?.public_uuid !== loginUser?.public_uuid).length;
  }, [currentChat?.other_participants, loginUser?.public_uuid]);

  const isOtherOnline = useMemo(() => {
    return currentChat?.other_participants?.some((p) => p.status === 'Online') || false;
  }, [currentChat?.other_participants]);

  const avatarSrc = useMemo(() => {
    return currentChat?.avatar ?? null;
  }, [currentChat?.avatar]);

  return (
    <ChatContainer>
      {/* 헤더 */}
      <HeaderBox>
        <IconButton onClick={onBack}>←</IconButton>
        <HeaderAvatar src={avatarSrc ?? undefined} alt={currentChat?.room_name} online={isOtherOnline ? 1 : 0} />
        <HeaderInfoBox>
          <HeaderTitle variant="subtitle1">{currentChat?.room_name || '채팅방'}</HeaderTitle>
          <HeaderStatus variant="body2">{isOtherOnline ? '온라인' : '오프라인'}</HeaderStatus>
        </HeaderInfoBox>
      </HeaderBox>
      {/* 메시지 리스트 */}
      <MessageList ref={messageListRef} onScroll={handleScroll}>
        {messages?.map((msg) => {
          const isMe = msg.public_uuid === loginUser?.public_uuid;
          const timeText = formatRelativeTime(msg.date_time ?? Date.now());

          return (
            <MessageRow isMe={isMe} key={msg.message_no}>
              <MessageCol isMe={isMe}>
                <MessageInfo>
                  {msg.unread_count > 0 && <UnreadText isMe={isMe}>{`${msg.unread_count}`}</UnreadText>}
                  <TimeText>{timeText}</TimeText>
                </MessageInfo>
                <MessageBubble isMe={isMe}>
                  <BubbleContentBox>
                    {msg.image ? (
                      <BubbleImageBox>
                        {msg.content && <div>{msg.content}</div>}
                        <BubbleImg src={msg.image} alt="전송된 이미지" />
                      </BubbleImageBox>
                    ) : (
                      <div>{msg.content}</div>
                    )}
                  </BubbleContentBox>
                </MessageBubble>
              </MessageCol>
            </MessageRow>
          );
        })}

        {isTyping && (
          <MessageBubble isMe={false}>
            <TypingDots>
              <TypingDot delay={0} />
              <TypingDot delay={0.2} />
              <TypingDot delay={0.4} />
            </TypingDots>
          </MessageBubble>
        )}

        <div ref={messagesEndRef} />
      </MessageList>
      {/* 이미지 미리보기 */}
      {imagePreview && (
        <ImagePreviewWrapper>
          <ImagePreviewBox>
            <img src={imagePreview} alt="미리보기" />
            <CloseButton
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
            >
              <X size={16} />
            </CloseButton>
          </ImagePreviewBox>
        </ImagePreviewWrapper>
      )}
      {/* 입력창 */}
      <InputContainer>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleImageSelect(e)}
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
          onKeyDown={(e) =>
            handleKeyDown(e, () =>
              handleSendMessage({
                message,
                selectedImage,
                inputRef,
                setMessage,
                setSelectedImage,
                setImagePreview,
                onSendMessage,
                onSendImage,
                messagesEndRef,
              })
            )
          }
          placeholder="메시지를 입력하세요"
        />
        <IconButton
          onClick={() =>
            handleSendMessage({
              message,
              selectedImage,
              inputRef,
              setMessage,
              setSelectedImage,
              setImagePreview,
              onSendMessage,
              onSendImage,
              messagesEndRef,
            })
          }
          disabled={!message.trim() && !selectedImage}
          className={!message.trim() && !selectedImage ? 'disabled' : ''}
        >
          <Send size={20} />
        </IconButton>
      </InputContainer>{' '}
    </ChatContainer>
  );
};

export default ChatWindow;
const ImagePreviewWrapper = styled('div')({
  padding: 16,
  borderTop: '1px solid #e0e0e0',
  position: 'relative',
});

const ImagePreviewBox = styled('div')({
  position: 'relative',
  width: 200,
  height: 200,
  borderRadius: 8,
  overflow: 'hidden',
  border: '1px solid #e0e0e0',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: 'rgba(0,0,0,0.5)',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});
const ChatContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  backgroundColor: '#f5f5f5',
});

const HeaderBox = styled('div')({
  padding: 16,
  borderBottom: '1px solid #e0e0e0',
  display: 'flex',
  alignItems: 'center',
});

const HeaderInfoBox = styled('div')({});
const HeaderTitle = styled(Typography)({ fontWeight: 'bold' });
const HeaderStatus = styled(Typography)({ color: '#888' });

const HeaderAvatar = styled(Avatar)(({ online }) => ({
  width: 40,
  height: 40,
  marginRight: 12,
  border: online ? '3.3px solid #4caf50' : '2px solid transparent',
}));

const MessageList = styled('div')({
  flex: 1,
  overflowY: 'auto',
  padding: 16,
});

const MessageRow = styled('div')(({ isMe }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: isMe ? 'flex-end' : 'flex-start',
  gap: 4,
  marginBottom: 8,
}));

const MessageCol = styled('div')(({ isMe }) => ({
  display: 'flex',
  flexDirection: isMe ? 'row' : 'row-reverse',
  alignItems: 'flex-end',
  marginBottom: '12px',
  gap: 4,
}));

const MessageInfo = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'flex-end',
});

const BubbleContentBox = styled('div')({
  display: 'flex',
});

const BubbleImageBox = styled('div')({});
const BubbleImg = styled('img')({
  maxWidth: 200,
  maxHeight: 200,
  borderRadius: 8,
  marginTop: 8,
});

const TimeText = styled(Typography)({
  color: '#888',
  fontSize: '0.75rem',
  alignSelf: 'flex-end',
});

const UnreadText = styled(Typography)(({ isMe }) => ({
  display: 'flex',
  color: '#f8be00',
  fontSize: '0.85rem',
  marginTop: 2,
  marginLeft: 4,
  justifyContent: isMe ? 'flex-end' : 'flex-start',
}));

const MessageBubble = styled('div')(({ isMe }) => ({
  justifyContent: 'flex-end',
  width: 'fit-content',
  padding: '10px 16px',
  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  backgroundColor: isMe ? '#FFD700' : '#fff',
  color: isMe ? '#000' : '#333',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  wordBreak: 'break-word',
}));

const TypingDots = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const TypingDot = styled('div')(({ delay }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: '#666',
  margin: '0 2px',
  animation: 'bounce 1.4s infinite ease-in-out',
  animationDelay: `${delay}s`,
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

const EmptyChatBox = styled('div')({
  padding: 24,
  textAlign: 'center',
});
const EmptyTitle = styled(Typography)({});
const EmptyDesc = styled(Typography)({});
