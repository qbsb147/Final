import { wsManager } from './websocket.js';
import { API_ENDPOINTS } from './config';

export const chatWsService = {
  connect: (room_no) => {
    return wsManager.connect(API_ENDPOINTS.WEBSOCKET.ROOM({ room_no }));
  },

  sendMessage: (room_no, data) => {
    return wsManager.send(API_ENDPOINTS.WEBSOCKET.ROOM({ room_no }), data);
  },

  close: (room_no) => {
    return wsManager.close(API_ENDPOINTS.WEBSOCKET.ROOM({ room_no }));
  },

  getSocket: (room_no) => {
    return wsManager.getInstance(API_ENDPOINTS.WEBSOCKET.ROOM({ room_no }));
  },
};
