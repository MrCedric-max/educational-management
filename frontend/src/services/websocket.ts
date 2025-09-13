// WebSocket service for real-time features
import { Notification, RealtimeUpdate } from '../types/database';

// WebSocket connection states
export enum ConnectionState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

// WebSocket event types
export enum WebSocketEventType {
  NOTIFICATION = 'notification',
  ACTIVITY_UPDATE = 'activity_update',
  USER_STATUS = 'user_status',
  SYSTEM_ALERT = 'system_alert',
  QUIZ_UPDATE = 'quiz_update',
  LESSON_UPDATE = 'lesson_update',
  MESSAGE = 'message',
  HEARTBEAT = 'heartbeat'
}

// WebSocket message interface
interface WebSocketMessage {
  type: WebSocketEventType;
  data: any;
  timestamp: number;
  id: string;
}

// WebSocket service class
class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 5000; // 5 seconds
  private heartbeatInterval: number = 30000; // 30 seconds
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private state: ConnectionState = ConnectionState.DISCONNECTED;
  private listeners: Map<WebSocketEventType, Set<(data: any) => void>> = new Map();
  private messageQueue: WebSocketMessage[] = [];

  constructor(url: string) {
    this.url = url;
    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    // Initialize listener maps for each event type
    Object.values(WebSocketEventType).forEach(eventType => {
      this.listeners.set(eventType, new Set());
    });
  }

  // Connect to WebSocket server
  connect(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.token = token;
        this.state = ConnectionState.CONNECTING;

        const wsUrl = `${this.url}?token=${encodeURIComponent(token)}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.state = ConnectionState.CONNECTED;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.processMessageQueue();
          this.emit(WebSocketEventType.HEARTBEAT, { status: 'connected' });
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.state = ConnectionState.DISCONNECTED;
          this.stopHeartbeat();
          
          if (event.code !== 1000) { // Not a normal closure
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.state = ConnectionState.ERROR;
          reject(error);
        };

      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        this.state = ConnectionState.ERROR;
        reject(error);
      }
    });
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.state = ConnectionState.DISCONNECTED;
    this.emit(WebSocketEventType.HEARTBEAT, { status: 'disconnected' });
  }

  // Send message to server
  send(type: WebSocketEventType, data: any): boolean {
    if (this.state !== ConnectionState.CONNECTED || !this.ws) {
      // Queue message for later sending
      this.messageQueue.push({
        type,
        data,
        timestamp: Date.now(),
        id: Math.random().toString(36).substr(2, 9)
      });
      return false;
    }

    try {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: Date.now(),
        id: Math.random().toString(36).substr(2, 9)
      };

      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  // Subscribe to specific event type
  subscribe(eventType: WebSocketEventType, callback: (data: any) => void): () => void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.add(callback);
      
      // Return unsubscribe function
      return () => {
        listeners.delete(callback);
      };
    }
    
    return () => {}; // No-op unsubscribe function
  }

  // Unsubscribe from specific event type
  unsubscribe(eventType: WebSocketEventType, callback: (data: any) => void): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  // Get current connection state
  getState(): ConnectionState {
    return this.state;
  }

  // Check if connected
  isConnected(): boolean {
    return this.state === ConnectionState.CONNECTED;
  }

  // Private methods
  private handleMessage(message: WebSocketMessage): void {
    // Handle heartbeat responses
    if (message.type === WebSocketEventType.HEARTBEAT) {
      return;
    }

    // Emit message to subscribers
    this.emit(message.type, message.data);
  }

  private emit(eventType: WebSocketEventType, data: any): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket listener:', error);
        }
      });
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      this.state = ConnectionState.ERROR;
      return;
    }

    this.state = ConnectionState.RECONNECTING;
    this.reconnectAttempts++;

    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${this.reconnectInterval}ms`);

    this.reconnectTimer = setTimeout(() => {
      if (this.token) {
        this.connect(this.token).catch(error => {
          console.error('Reconnection failed:', error);
        });
      }
    }, this.reconnectInterval);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat(); // Clear any existing heartbeat
    
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send(WebSocketEventType.HEARTBEAT, { timestamp: Date.now() });
      }
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private processMessageQueue(): void {
    if (this.messageQueue.length > 0) {
      console.log(`Processing ${this.messageQueue.length} queued messages`);
      
      const messages = [...this.messageQueue];
      this.messageQueue = [];
      
      messages.forEach(message => {
        this.send(message.type, message.data);
      });
    }
  }
}

// Create singleton instance
const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws';
export const websocketService = new WebSocketService(wsUrl);

// Export types and service
export { WebSocketService };
export default websocketService;




