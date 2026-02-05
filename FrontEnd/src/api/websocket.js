import { API_CONFIG } from './config';

const sockets = {};

export const wsManager = {
  connect(endpoint) {
    const url = `${API_CONFIG.WEBSOCKET_URL}${endpoint}`;
    if (sockets[url] && sockets[url].readyState === WebSocket.OPEN) {
      return sockets[url];
    }

    const socket = new WebSocket(url);

    socket.onopen = () => console.log('✅ WebSocket 연결 성공 :', url);
    socket.onmessage = (event) => console.log('📩 수신 :', url, event.data);
    socket.onerror = (err) => console.error('❌ WS 에러 :', url, err);
    socket.onclose = () => {
      console.log('⛔ WebSocket 종료 :', url);
      delete sockets[url];
    };

    sockets[url] = socket;
    return socket;
  },

  send(endpoint, data) {
    const url = `${API_CONFIG.WEBSOCKET_URL}${endpoint}`;
    const socket = sockets[url];
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(typeof data === 'string' ? data : JSON.stringify(data));
  },

  close(endpoint) {
    const url = `${API_CONFIG.WEBSOCKET_URL}${endpoint}`;
    const socket = sockets[url];
    if (!socket) return;
    socket.close();
    delete sockets[url];
  },

  getInstance(endpoint) {
    const url = `${API_CONFIG.WEBSOCKET_URL}${endpoint}`;
    return sockets[url] || null;
  },
};
