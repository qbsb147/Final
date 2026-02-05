import React, { useState, useMemo, useEffect } from 'react';
import { Box, InputBase, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import { Search as SearchIcon } from 'lucide-react';

const ChatList = ({ chats, activeChat, onChatSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 검색어에 따라 채팅 목록 필터링
  const filteredChats = useMemo(() => {
    return chats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (chat.last_message && chat.last_message.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [chats, searchTerm]);

  const filteredChatsWithOnline = useMemo(() => {
    return filteredChats.map((chat) => ({
      ...chat,
      online: (chat.online_nick_names?.length ?? 0) > 0,
    }));
  }, [filteredChats]);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #e0e0e0',
      }}
    >
      {/* 검색 바 */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            px: 2,
            py: 1,
          }}
        >
          <SearchIcon size={20} color="#666" />
          <InputBase
            placeholder="채팅방 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              ml: 1,
              flex: 1,
              '& input': {
                p: '8px',
              },
            }}
          />
        </Box>
      </Box>

      {/* 채팅 목록 */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List sx={{ p: 0 }}>
          {filteredChatsWithOnline.length > 0 ? (
            filteredChatsWithOnline.map((chat) => (
              <ListItem
                key={chat.room_no}
                button
                selected={activeChat === chat.room_no}
                onClick={() => onChatSelect(chat.room_no)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={chat.avatar}
                    alt={chat.name}
                    sx={{
                      width: 48,
                      height: 48,
                      border: chat.online ? '2px solid #4caf50' : 'none',
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        color={activeChat === chat.room_no ? '#FFD700' : 'text.primary'}
                      >
                        {chat.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {chat.time}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '200px',
                        }}
                      >
                        {chat.last_message}
                      </Typography>
                      {chat.unread_count > 0 && (
                        <Box
                          sx={{
                            backgroundColor: '#FFD700',
                            color: '#000',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {chat.unread_count}
                        </Box>
                      )}
                    </Box>
                  }
                  secondaryTypographyProps={{ component: 'div' }}
                />
              </ListItem>
            ))
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                검색 결과가 없습니다.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                다른 검색어를 시도해보세요.
              </Typography>
            </Box>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default ChatList;
