import { wsManager } from './websocket.js';
import { API_ENDPOINTS } from './config';
import js from '@eslint/js';

let heartbeatIntervalId = null;

export const onlineWsService = {
  connect: () => {
    return wsManager.connect(API_ENDPOINTS.WEBSOCKET.ONLINE());
  },

  sendStatus: (data) => {
    return wsManager.send(API_ENDPOINTS.WEBSOCKET.ONLINE(), data);
  },

  sendMessage: (data) => {
    return wsManager.send(API_ENDPOINTS.WEBSOCKET.ONLINE(), data);
  },

  sendHeartbeat: () => {
    wsManager.send(API_ENDPOINTS.WEBSOCKET.ONLINE(), JSON.stringify({ type: 'HEARTBEAT' }));
  },

  startHeartbeat: () => {
    if (heartbeatIntervalId) return;
    heartbeatIntervalId = setInterval(() => {
      onlineWsService.sendHeartbeat();
    }, 60000);
  },

  stopHeartbeat: () => {
    if (heartbeatIntervalId) {
      clearInterval(heartbeatIntervalId);
      heartbeatIntervalId = null;
    }
  },

  close: () => {
    onlineWsService.stopHeartbeat();
    return wsManager.close(API_ENDPOINTS.WEBSOCKET.ONLINE());
  },

  getSocket: () => {
    return wsManager.getInstance(API_ENDPOINTS.WEBSOCKET.ONLINE());
  },
};
