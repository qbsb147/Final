import { wsManager } from './websocket.js';
import { API_ENDPOINTS } from './config';

export const chatWsService = {
  connect: () => {
    return wsManager.connect(API_ENDPOINTS.WEBSOCKET.ROOM);
  },

  sendMessage: (data) => {
    return wsManager.send(API_ENDPOINTS.WEBSOCKET.ROOM, data);
  },

  close: () => {
    return wsManager.close(API_ENDPOINTS.WEBSOCKET.ROOM);
  },

  getSocket: () => {
    return wsManager.getInstance(API_ENDPOINTS.WEBSOCKET.ROOM);
  },
};
