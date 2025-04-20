import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GameContext from '../context/GameContext';
import { AIProfile, PolicyCategory } from '../context/GameContext';

// Define message type
interface Message {
  speaker: string;
  content: string;
  timestamp: Date;
}

const PhaseTwo: React.FC = () => {
  const { gameState, updateGameState } = useContext(GameContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [currentAI, setCurrentAI] = useState<AIProfile | null>(null);
  const [votingActive, setVotingActive] = useState(false);
  const [currentVotingCategory, setCurrentVotingCategory] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, Record<string, number>>>({});
  const [finishedCategories, setFinishedCategories] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if SpeechRecognition is available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore - TypeScript doesn't know about SpeechRecognition API yet
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setCurrentMessage(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
    } else {
      console.error('Speech recognition not supported in this browser');
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Initialize phase with a welcome message
  useEffect(() => {
    if (messages.length === 0) {
      // Add initial message
      setMessages([
        {
          speaker: 'Moderator',
          content: 'Welcome to the group discussion phase. You will now discuss your policy choices with four stakeholders from the Republic of Bean. Each stakeholder has their own background and perspective. Let\'s begin with introductions.',
          timestamp: new Date()
        }
      ]);
      
      // Trigger AI introductions after a delay
      setTimeout(triggerIntroductions, 2000);
    }
  }, []);
  
  // Function to get policy option by id
  const getPolicyOptionById = (categoryId: string, optionId: number | null) => {
    if (optionId === null) return null;
    
    const category = gameState.policyCategories.find(cat => cat.id === categoryId);
    if (!category) return null;
    
    return category.options.find(opt => opt.id === optionId) || null;
  };
  
  // Function to format policy preference
  const formatPolicyPreference = (categoryId: string, optionId: number) => {
    const category = gameState.policyCategories.find(cat => cat.id === categoryId);
    if (!category) return '';
    
    const option = category.options.find(opt => opt.id === optionId);
    if (!option) return '';
    
    return `${category.name}: ${option.title}`;
  };
  
  // Trigger AI introductions
  const triggerIntroductions = async () => {
    // Clone AI profiles
    const aiProfiles = [...gameState.aiProfiles];
    
    // Introduce each AI agent sequentially
    for (let i = 0; i < aiProfiles.length; i++) {
      const ai = aiProfiles[i];
      
      // Mark AI as speaking
      updateAISpeakingStatus(ai.id, true);
      
      // Generate introduction message
      const introMessage = await generateAIMessage({
        role: 'system',
        content: `You are an AI simulating a stakeholder in a refugee education policy discussion. Your name is ${ai.name}. You are ${ai.age} years old with ${ai.education} education. You work as a ${ai.occupation} and are ${ai.socioeconomicStatus} with ${ai.politicalIdeology} views. Give a brief introduction of yourself in the first person. Keep it under 3 sentences.`
      });
      
      // Add message to chat
      setMessages(prev => [...prev, {
        speaker: ai.name,
        content: introMessage,
        timestamp: new Date()
      }]);
      
      // Wait for a realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mark AI as not speaking
      updateAISpeakingStatus(ai.id, false);
      
      // Short delay between AIs
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Add message from moderator to begin discussion
    setMessages(prev => [...prev, {
      speaker: 'Moderator',
      content: 'Now that we\'ve met everyone, let\'s begin discussing the policy options. We\'ll go through each category, discuss our preferences, and then vote on the final policy.',
      timestamp: new Date()
    }]);
    
    // Start the category-by-category discussion
    setTimeout(() => startCategoryDiscussion(gameState.policyCategories[0].id), 2000);
  };
  
  // Start discussion for a specific category
  const startCategoryDiscussion = async (categoryId: string) => {
    const category = gameState.policyCategories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    // Add message from moderator introducing the category
    setMessages(prev => [...prev, {
      speaker: 'Moderator',
      content: `Let's discuss the "${category.name}" policy area. ${category.description}. Each person will share their perspective and preferred option.`,
      timestamp: new Date()
    }]);
    
    // Initialize voting for this category
    setVotes(prev => ({
      ...prev,
      [categoryId]: {}
    }));
    
    // Wait a moment before AI starts speaking
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Have each AI agent share their opinion
    for (const ai of gameState.aiProfiles) {
      // Mark AI as speaking
      updateAISpeakingStatus(ai.id, true);
      
      // Determine which option this AI prefers for this category
      const preferredOptionId = ai.preferences[categoryId];
      const preferredOption = getPolicyOptionById(categoryId, preferredOptionId);
      
      if (preferredOption) {
        // Generate opinion message
        const message = await generateAIMessage({
          role: 'system',
          content: `You are ${ai.name}, a ${ai.age} year old ${ai.occupation} with ${ai.politicalIdeology} views and ${ai.socioeconomicStatus} status. For the ${category.name} policy area, you prefer "${preferredOption.title}". Explain why you support this option based on your background and values. Keep your response under 4 sentences.`
        });
        
        // Add message to chat
        setMessages(prev => [...prev, {
          speaker: ai.name,
          content: message,
          timestamp: new Date()
        }]);
        
        // Record AI's vote
        setVotes(prev => ({
          ...prev,
          [categoryId]: {
            ...prev[categoryId],
            [ai.id]: preferredOptionId
          }
        }));
      }
      
      // Wait for a realistic delay
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Mark AI as not speaking
      updateAISpeakingStatus(ai.id, false);
      
      // Short delay between AIs
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Prompt the user to share their perspective
    setMessages(prev => [...prev, {
      speaker: 'Moderator',
      content: `What's your perspective on the ${category.name} policy area? Please share your thoughts and which option you prefer.`,
      timestamp: new Date()
    }]);
    
    // Activate voting for this category
    setCurrentVotingCategory(categoryId);
    setVotingActive(true);
  };
  
  // Handle user vote selection
  const handleVoteSelect = (optionId: number) => {
    if (!currentVotingCategory) return;
    
    // Record user's vote
    setVotes(prev => ({
      ...prev,
      [currentVotingCategory]: {
        ...prev[currentVotingCategory],
        user: optionId
      }
    }));
    
    // Add user's vote message
    const category = gameState.policyCategories.find(cat => cat.id === currentVotingCategory);
    const option = category?.options.find(opt => opt.id === optionId);
    
    if (category && option) {
      setMessages(prev => [...prev, {
        speaker: 'You',
        content: `I vote for "${option.title}" for the ${category.name} policy area.`,
        timestamp: new Date()
      }]);
    }
    
    // Close voting and proceed to results
    setVotingActive(false);
    
    // Process voting results after a short delay
    setTimeout(() => processVotingResults(currentVotingCategory), 1000);
  };
  
  // Process voting results for a category
  const processVotingResults = async (categoryId: string) => {
    const category = gameState.policyCategories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    const categoryVotes = votes[categoryId];
    
    // Count votes for each option
    const voteCounts: Record<number, number> = {};
    
    // Initialize vote counts
    category.options.forEach(opt => {
      voteCounts[opt.id] = 0;
    });
    
    // Count votes
    Object.values(categoryVotes).forEach((optionId: any) => {
      voteCounts[optionId] = (voteCounts[optionId] || 0) + 1;
    });
    
    // Find the option with the most votes
    let maxVotes = 0;
    let winningOptions: number[] = [];
    
    Object.entries(voteCounts).forEach(([optionId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        winningOptions = [parseInt(optionId)];
      } else if (count === maxVotes) {
        winningOptions.push(parseInt(optionId));
      }
    });
    
    // Handle tie
    let winningOptionId: number;
    
    if (winningOptions.length > 1) {
      // There's a tie, moderator decides
      setMessages(prev => [...prev, {
        speaker: 'Moderator',
        content: "There appears to be a tie. As the moderator, I'll make the final decision based on what's best for the refugee children.",
        timestamp: new Date()
      }]);
      
      // Pick the option with lowest cost for simplicity
      // In a real scenario, this could have more complex logic
      const tiedOptions = winningOptions.map(optId => {
        const opt = category.options.find(o => o.id === optId);
        return { id: optId, cost: opt ? opt.cost : 3 };
      });
      
      tiedOptions.sort((a, b) => a.cost - b.cost);
      winningOptionId = tiedOptions[0].id;
      
      // Announce moderator's decision
      const decidedOption = category.options.find(opt => opt.id === winningOptionId);
      
      if (decidedOption) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setMessages(prev => [...prev, {
          speaker: 'Moderator',
          content: `I've decided that "${decidedOption.title}" is the best option for the ${category.name} policy area.`,
          timestamp: new Date()
        }]);
      }
    } else {
      // Clear winner
      winningOptionId = winningOptions[0];
      const winningOption = category.options.find(opt => opt.id === winningOptionId);
      
      if (winningOption) {
        setMessages(prev => [...prev, {
          speaker: 'Moderator',
          content: `The group has decided on "${winningOption.title}" for the ${category.name} policy area.`,
          timestamp: new Date()
        }]);
      }
    }
    
    // Update the policy category with the winning option
    const newPolicyCategories = [...gameState.policyCategories];
    const categoryIndex = newPolicyCategories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex !== -1) {
      newPolicyCategories[categoryIndex] = {
        ...newPolicyCategories[categoryIndex],
        selectedOption: winningOptionId
      };
      
      // Update game state
      updateGameState({
        policyCategories: newPolicyCategories
      });
    }
    
    // Mark this category as finished
    setFinishedCategories(prev => [...prev, categoryId]);
    
    // Move to the next category or finish phase
    const currentIndex = gameState.policyCategories.findIndex(cat => cat.id === categoryId);
    if (currentIndex < gameState.policyCategories.length - 1) {
      const nextCategoryId = gameState.policyCategories[currentIndex + 1].id;
      
      // Add transition message
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessages(prev => [...prev, {
        speaker: 'Moderator',
        content: `Let's move on to the next policy area.`,
        timestamp: new Date()
      }]);
      
      // Start next category discussion after a short delay
      setTimeout(() => startCategoryDiscussion(nextCategoryId), 2000);
    } else {
      // All categories finished
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessages(prev => [...prev, {
        speaker: 'Moderator',
        content: `We've now discussed and voted on all policy areas. Let's move to the reflection phase where we'll review our decisions.`,
        timestamp: new Date()
      }]);
      
      // Save the discussion transcript
      const transcript = messages.map(msg => ({
        speaker: msg.speaker,
        message: msg.content,
        timestamp: msg.timestamp
      }));
      
      updateGameState({
        discussionTranscript: transcript,
        currentPhase: 3
      });
      
      // Navigate to Phase Three after a short delay
      setTimeout(() => navigate('/phase3'), 3000);
    }
  };
  
  // Update AI speaking status
  const updateAISpeakingStatus = (aiId: string, speaking: boolean) => {
    const aiProfiles = [...gameState.aiProfiles];
    const aiIndex = aiProfiles.findIndex(ai => ai.id === aiId);
    
    if (aiIndex !== -1) {
      aiProfiles[aiIndex] = {
        ...aiProfiles[aiIndex],
        speaking
      };
      
      updateGameState({ aiProfiles });
      
      if (speaking) {
        setCurrentAI(aiProfiles[aiIndex]);
        setIsBotSpeaking(true);
      } else {
        setIsBotSpeaking(false);
        setCurrentAI(null);
      }
    }
  };
  
  // Generate AI message using GPT API
  const generateAIMessage = async (prompt: { role: string, content: string }) => {
    try {
      // This is a simplified mock
      // In the actual implementation, this would call the OpenAI API
      // For now, we'll return mock responses
      
      // In the full implementation, you would make a real API call:
      /*
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [prompt],
          temperature: 0.7,
          max_tokens: 150
        })
      });
      
      const data = await response.json();
      return data.choices[0].message.content;
      */
      
      // Mock response for now
      return `This is a simulated AI response for: ${prompt.content.substring(0, 50)}...`;
    } catch (error) {
      console.error('Error generating AI message:', error);
      return 'I apologize, but I am unable to respond at the moment.';
    }
  };
  
  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      
      // Send the current message if not empty
      if (currentMessage.trim()) {
        sendMessage();
      }
    } else {
      recognitionRef.current?.start();
    }
    
    setIsRecording(!isRecording);
  };
  
  // Send user message
  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    // Add user message to chat
    setMessages(prev => [...prev, {
      speaker: 'You',
      content: currentMessage,
      timestamp: new Date()
    }]);
    
    // Clear input
    setCurrentMessage('');
    
    // If we're in voting mode, trigger AI responses after user shares opinion
    if (votingActive && currentVotingCategory) {
      // Add short delay before showing voting buttons
      setTimeout(() => {
        // Ask user to vote explicitly
        setMessages(prev => [...prev, {
          speaker: 'Moderator',
          content: `Thank you for sharing your perspective. Please vote for your preferred option by clicking one of the buttons below.`,
          timestamp: new Date()
        }]);
      }, 1000);
    }
  };
  
  // Handle text input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
  };
  
  // Handle key press in text input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Phase 2: Group Discussion</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stakeholder profiles */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Stakeholders</h3>
          
          {gameState.aiProfiles.map((ai) => (
            <div 
              key={ai.id} 
              className={`p-4 rounded-lg border ${ai.speaking ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
            >
              <div className="font-semibold">{ai.name}</div>
              <div className="text-sm text-gray-600">{ai.age} years old</div>
              <div className="text-sm text-gray-600">{ai.occupation}</div>
              <div className="text-sm text-gray-600">{ai.politicalIdeology}</div>
              {ai.speaking && (
                <div className="mt-2 text-xs text-green-600 flex items-center">
                  <span className="mr-1">●</span> Speaking...
                </div>
              )}
            </div>
          ))}

          <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
            <div className="font-semibold">You</div>
            <div className="text-sm text-gray-600">{gameState.userProfile.age}</div>
            <div className="text-sm text-gray-600">{gameState.userProfile.occupation}</div>
            {isRecording && (
              <div className="mt-2 text-xs text-red-600 flex items-center">
                <span className="mr-1">●</span> Recording...
              </div>
            )}
          </div>
        </div>
        
        {/* Discussion area */}
        <div className="md:col-span-3 flex flex-col h-[600px] border border-gray-200 rounded-lg">
          {/* Messages display */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.speaker === 'You' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.speaker === 'You' 
                      ? 'bg-blue-100 text-blue-900' 
                      : message.speaker === 'Moderator'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="font-medium mb-1">{message.speaker}</div>
                  <div>{message.content}</div>
                </div>
              </div>
            ))}
            
            {/* Voting UI */}
            {votingActive && currentVotingCategory && (
              <div className="bg-white p-3 border border-gray-300 rounded-lg">
                <div className="font-medium mb-2">Select your preferred option:</div>
                
                <div className="space-y-2">
                  {gameState.policyCategories
                    .find(cat => cat.id === currentVotingCategory)
                    ?.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleVoteSelect(option.id)}
                        className="w-full text-left p-2 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300"
                      >
                        <div className="font-medium">{option.title}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                        <div className="text-xs text-amber-700 mt-1">Cost: {option.cost} units</div>
                      </button>
                    ))
                  }
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex items-center">
              <button
                onClick={toggleSpeechRecognition}
                className={`p-2 rounded-full mr-2 ${isRecording ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                title={isRecording ? 'Stop recording' : 'Start recording'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              
              <input
                type="text"
                value={currentMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isBotSpeaking}
              />
              
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                disabled={isBotSpeaking || !currentMessage.trim()}
              >
                Send
              </button>
            </div>
            
            {isBotSpeaking && (
              <div className="mt-2 text-sm text-gray-500">
                {currentAI?.name} is speaking... Please wait.
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress tracking */}
      <div className="mt-6 bg-white p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Discussion Progress</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {gameState.policyCategories.map((category) => (
            <div 
              key={category.id}
              className={`p-2 border rounded ${
                finishedCategories.includes(category.id)
                  ? 'border-green-500 bg-green-50'
                  : currentVotingCategory === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
              }`}
            >
              <div className="text-sm font-medium">{category.name}</div>
              {finishedCategories.includes(category.id) && category.selectedOption && (
                <div className="text-xs text-green-700">
                  Selected: {category.options.find(opt => opt.id === category.selectedOption)?.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhaseTwo; 