import axios from 'axios';
import { io, Socket } from 'socket.io-client';

// API base URL
const API_URL = '/api';

// Initialize Socket.IO connection
let socket: Socket;

// Connect to socket server
export const connectSocket = () => {
  if (!socket) {
    socket = io();
    
    // Set up socket event handlers
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  
  return socket;
};

// Generate AI message
export const generateAIMessage = async (prompt: string, maxTokens = 150, temperature = 0.7) => {
  try {
    const response = await axios.post(`${API_URL}/generate-message`, {
      prompt,
      maxTokens,
      temperature
    });
    
    return response.data.message;
  } catch (error) {
    console.error('Error generating AI message:', error);
    throw error;
  }
};

// Generate AI message via socket
export const generateAIMessageViaSocket = (prompt: string, aiId: string) => {
  return new Promise<string>((resolve, reject) => {
    if (!socket) {
      socket = connectSocket();
    }
    
    // Listen for response
    socket.once('ai-message-response', (data) => {
      if (data.aiId === aiId) {
        resolve(data.message);
      }
    });
    
    // Listen for error
    socket.once('ai-message-error', (data) => {
      if (data.aiId === aiId) {
        reject(data.error);
      }
    });
    
    // Send request
    socket.emit('generate-ai-message', { prompt, aiId });
  });
};

// Generate feedback on reflections
export const generateFeedback = async (reflections: Record<string, string>, policies: any[]) => {
  try {
    const response = await axios.post(`${API_URL}/generate-feedback`, {
      reflections,
      policies
    });
    
    return response.data.feedback;
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw error;
  }
};

// Send PDF report via email
export const sendReport = async (pdfData: string, userName: string) => {
  try {
    const response = await axios.post(`${API_URL}/send-report`, {
      pdfData,
      userName
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending report:', error);
    throw error;
  }
}; 