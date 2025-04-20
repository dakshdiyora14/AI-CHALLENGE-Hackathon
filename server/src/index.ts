import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import nodemailer from 'nodemailer';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE as string,
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string
  }
});

// Routes
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Republic of Bean API is running');
});

// Generate AI message
app.post('/api/generate-message', async (req: express.Request, res: express.Response) => {
  try {
    const { prompt, maxTokens = 150, temperature = 0.7 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
      max_tokens: maxTokens,
      temperature: temperature,
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error generating AI message:', error);
    res.status(500).json({ error: 'Failed to generate AI message' });
  }
});

// Generate AI feedback
app.post('/api/generate-feedback', async (req: express.Request, res: express.Response) => {
  try {
    const { reflections, policies } = req.body;

    if (!reflections || !policies) {
      return res.status(400).json({ error: 'Reflections and policies are required' });
    }

    // Format reflections and policies for the prompt
    let reflectionsText = '';
    Object.entries(reflections).forEach(([questionId, answer]) => {
      reflectionsText += `Question: ${questionId}\nAnswer: ${answer}\n\n`;
    });

    let policiesText = '';
    policies.forEach((policy: any) => {
      policiesText += `${policy.name}: ${policy.selectedOption?.title}\n`;
    });

    const prompt = `
      You are an AI evaluating a refugee education policy simulation. 
      The participant has created the following policy package:
      
      ${policiesText}
      
      And provided these reflections on their experience:
      
      ${reflectionsText}
      
      Provide thoughtful feedback on their policy choices and reflections, addressing:
      1. Ethical reasoning and equity considerations
      2. Empathy and understanding of refugee challenges
      3. Practical policy coherence and sustainability
      4. Areas for further development or improvement
      
      Keep your response to about 4-5 paragraphs.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 600,
      temperature: 0.7,
    });

    res.json({ feedback: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

// Send report by email
app.post('/api/send-report', async (req: express.Request, res: express.Response) => {
  try {
    const { pdfData, userName } = req.body;

    if (!pdfData) {
      return res.status(400).json({ error: 'PDF data is required' });
    }

    // Convert base64 string to Buffer
    const pdfBuffer = Buffer.from(pdfData.split(',')[1], 'base64');

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER as string,
      to: `${process.env.RECIPIENT_EMAIL_1 as string}, ${process.env.RECIPIENT_EMAIL_2 as string}`,
      subject: `Republic of Bean Simulation Report - ${userName || 'User'}`,
      text: `Please find attached the refugee education policy simulation report for ${userName || 'a participant'}.`,
      attachments: [
        {
          filename: `refugee-policy-report-${Date.now()}.pdf`,
          content: pdfBuffer
        }
      ]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Report sent successfully' });
  } catch (error) {
    console.error('Error sending report:', error);
    res.status(500).json({ error: 'Failed to send report' });
  }
});

// Socket.IO connection handler
io.on('connection', (socket: any) => {
  console.log('User connected:', socket.id);

  // Handle AI message requests
  socket.on('generate-ai-message', async (data: any) => {
    try {
      const { prompt, aiId } = data;

      // Generate response using OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      });

      // Send response back to client
      socket.emit('ai-message-response', {
        aiId: aiId,
        message: completion.choices[0].message.content
      });
    } catch (error) {
      console.error('Error generating AI message via socket:', error);
      socket.emit('ai-message-error', {
        aiId: data.aiId,
        error: 'Failed to generate AI message'
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 