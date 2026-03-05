import React, { useState, useMemo, useEffect } from 'react';
import { Box, InputBase, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import { Search as SearchIcon } from 'lucide-react';
import styled from '@emotion/styled';

const ChatList = ({ chats, activeChat, onChatSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 검색어에 따라 채팅 목록 필터링
  const filteredChats = useMemo(() => {
    return chats.filter(
      (chat) =>
        chat.room_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (chat.last_message && chat.last_message.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [chats, searchTerm]);

  const filteredChatsWithOnline = useMemo(() => {
    return filteredChats.map((chat) => ({
      ...chat,
      online: chat.other_participants?.some((p) => p.status === 'Online') || false,
    }));
  }, [filteredChats]);

  return (
    <ChatListContainer>
      {/* 검색 바 */}
      <SearchBarWrapper>
        <SearchInputWrapper>
          <SearchIcon size={20} color="#666" />
          <StyledInputBase
            placeholder="채팅방 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInputWrapper>
      </SearchBarWrapper>

      {/* 채팅 목록 */}
      <ChatListBox>
        <StyledList>
          {filteredChatsWithOnline.length > 0 ? (
            filteredChatsWithOnline.map((chat) => (
              <StyledListItem
                key={chat.room_no}
                button
                selected={activeChat === chat.room_no}
                onClick={() => onChatSelect(chat.room_no)}
              >
                <ListItemAvatar>
                  <StyledAvatar src={chat.avatar} alt={chat.room_name} online={chat.online ? 1 : 0} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <ChatTitleBox>
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        color={activeChat === chat.room_no ? '#FFD700' : 'text.primary'}
                      >
                        {chat.room_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {chat.time}
                      </Typography>
                    </ChatTitleBox>
                  }
                  secondary={
                    <ChatSecondaryBox>
                      <LastMessageText variant="body2" color="text.secondary">
                        {chat.last_message}
                      </LastMessageText>
                      {chat.unread_count > 0 && <UnreadBadge>{chat.unread_count}</UnreadBadge>}
                    </ChatSecondaryBox>
                  }
                  secondaryTypographyProps={{ component: 'div' }}
                />
              </StyledListItem>
            ))
          ) : (
            <EmptyResultBox>
              <Typography variant="body1" color="text.secondary">
                검색 결과가 없습니다.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                다른 검색어를 시도해보세요.
              </Typography>
            </EmptyResultBox>
          )}
        </StyledList>
      </ChatListBox>
    </ChatListContainer>
  );
};

export default ChatList;

// styled-components
const ChatListContainer = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
`;

const SearchBarWrapper = styled(Box)`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const SearchInputWrapper = styled(Box)`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 8px 16px;
`;

const StyledInputBase = styled(InputBase)`
  margin-left: 8px;
  flex: 1;
  & input {
    padding: 8px;
  }
`;

const ChatListBox = styled(Box)`
  flex: 1;
  overflow-y: auto;
`;

const StyledList = styled(List)`
  padding: 0;
`;

const StyledListItem = styled(ListItem)`
  &.Mui-selected {
    background-color: rgba(255, 215, 0, 0.1);
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  border-bottom: 1px solid #f0f0f0;
`;

const StyledAvatar = styled(Avatar)(({ online }) => ({
  width: 48,
  height: 48,
  border: online ? '3.3px solid #4caf50' : 'none',
}));

const ChatTitleBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatSecondaryBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`;

const LastMessageText = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
`;

const UnreadBadge = styled(Box)`
  background-color: #ffd700;
  color: #000;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
`;

const EmptyResultBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
  text-align: center;
`;
