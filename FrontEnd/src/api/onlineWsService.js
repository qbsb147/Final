import { wsManager } from './websocket.js';
import { API_ENDPOINTS } from './config';

export const onlineWsService = {
  connect: () => {
    return wsManager.connect(API_ENDPOINTS.WEBSOCKET.ONLINE());
  },

  sendStatus: (data) => {
    return wsManager.send(API_ENDPOINTS.WEBSOCKET.ONLINE(), data);
  },

  close: () => {
    return wsManager.close(API_ENDPOINTS.WEBSOCKET.ONLINE());
  },

  getSocket: () => {
    return wsManager.getInstance(API_ENDPOINTS.WEBSOCKET.ONLINE());
  },
};
