export const chatFacade = {
  handleSendMessage: ({
    message,
    selectedImage,
    inputRef,
    onSendMessage,
    onSendImage,
    setMessage,
    setSelectedImage,
    setImagePreview,
    messagesEndRef,
  }) => {
    if (!message.trim() && !selectedImage) return;

    if (selectedImage) {
      onSendImage(selectedImage, message);
      setSelectedImage(null);
      setImagePreview(null);
      setMessage('');
      if (inputRef?.current) inputRef.current.textContent = '';
    } else {
      onSendMessage(message);
      setMessage('');
      if (inputRef?.current) inputRef.current.textContent = '';
    }

    // 메시지 전송 후 스크롤
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  },

  processMessages(response) {
    const messageList = Array.isArray(response) ? response : response?.content || [];
    return Array.isArray(messageList)
      ? messageList
          .slice()
          .reverse()
          .map((m) => {
            const ts = m?.date_time
              ? Date.parse(m.date_time)
              : (m?.create_time_ts ?? (m?.create_time ? Date.parse(m.create_time) : Date.now()));
            return { ...m, create_time_ts: ts };
          })
      : [];
  },

  parsePayload(data) {
    const payload = typeof data === 'string' ? JSON.parse(data) : data;
    const ts = payload?.date_time ? Date.parse(payload.date_time) : Date.now();
    const now = new Date(ts).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    return { ...payload, create_time_ts: ts, create_time: now, sentTime: now };
  },

  updateChatState(prevChats, payload, activeChat) {
    return prevChats.map((chat) => {
      if (chat.room_no === payload.room_no) {
        const prevUnread = chat.unread_count ?? 0;
        return {
          ...chat,
          last_message: payload.content || (payload.image ? '사진을 보냈습니다.' : ''),
          create_time: payload.create_time,
          last_time_ts: payload.create_time_ts,
          unread_count: activeChat === payload.room_no ? 0 : prevUnread + 1,
        };
      }
      return chat;
    });
  },

  processOlderMessages(response) {
    const messages = Array.isArray(response) ? response : response?.content || [];
    return messages
      .slice()
      .reverse()
      .map((m) => ({
        ...m,
        create_time_ts: m?.date_time ? Date.parse(m.date_time) : (m?.create_time_ts ?? Date.now()),
      }));
  },

  updateLastMessage(prevChats, room_no, message, options = {}) {
    const formatNow = () => new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    const { sentTime, createTime, unreadCount } = options;
    return prevChats.map((chat) =>
      chat.room_no === room_no
        ? {
            ...chat,
            last_message: message,
            create_time: createTime ?? formatNow(),
            unread_count: unreadCount ?? 0,
            sentTime: sentTime ?? null,
          }
        : chat
    );
  },

  formatTime(ts = Date.now()) {
    return new Date(ts).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  },

  formatRelativeTime(input) {
    if (!input) return '';
    let ts;
    if (typeof input === 'number') {
      ts = input;
    } else {
      const s = String(input).trim();
      if (/^\d+(,\d+)+$/.test(s)) {
        const parts = s.split(',').map(Number);
        const [y, m, d, hh, mm, ss, frac] = parts;
        const year = y || 1970;
        const month = m ? m - 1 : 0;
        const day = d || 1;
        const hour = hh || 0;
        const minute = mm || 0;
        const second = ss || 0;
        let ms = 0;
        if (typeof frac !== 'undefined' && !Number.isNaN(frac)) {
          const fracStr = String(frac);
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
  },

  scrollToBottom(messagesEndRef) {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  },

  handleImageSelect(file, setSelectedImage, setImagePreview) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB를 초과할 수 없습니다.');
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  },

  handleKeyDown(e, handler) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handler();
    }
  },
};
