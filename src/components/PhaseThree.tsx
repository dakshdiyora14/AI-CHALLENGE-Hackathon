import { useContext, useState, useEffect } from 'react';
import GameContext from '../context/GameContext';
import { jsPDF } from 'jspdf';

const PhaseThree = () => {
  const { gameState, updateGameState } = useContext(GameContext);
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState('');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  // Reflection questions
  const reflectionQuestions = [
    {
      id: 'equity',
      question: 'How did your final policy decisions address equity for the most vulnerable refugee children?'
    },
    {
      id: 'integration',
      question: 'What approach to integration (separation, partial, or full) did you prioritize, and why?'
    },
    {
      id: 'stakeholders',
      question: 'How did the perspectives of different stakeholders influence your thinking?'
    },
    {
      id: 'conflict',
      question: 'What tensions or conflicts emerged during the group discussion phase?'
    },
    {
      id: 'compromise',
      question: 'What compromises did you make to achieve consensus, and were they worth it?'
    },
    {
      id: 'learning',
      question: 'What did you learn about refugee education policy through this simulation?'
    }
  ];
  
  // Handle input change for reflection questions
  const handleReflectionChange = (questionId: string, value: string) => {
    setReflectionAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  // Generate feedback when all questions are answered
  const handleSubmitReflections = async () => {
    // Check if all questions are answered
    const allAnswered = reflectionQuestions.every(q => reflectionAnswers[q.id]?.trim());
    if (!allAnswered) {
      alert('Please answer all reflection questions before submitting.');
      return;
    }
    
    setIsGeneratingFeedback(true);
    
    try {
      // In a full implementation, this would call the OpenAI API
      // For now, we'll generate mock feedback
      
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock feedback
      const mockFeedback = generateMockFeedback();
      setFeedback(mockFeedback);
      
      // Save reflection answers and feedback to game state
      updateGameState({
        reflectionAnswers,
        finalFeedback: mockFeedback
      });
    } catch (error) {
      console.error('Error generating feedback:', error);
      setFeedback('An error occurred while generating feedback. Please try again.');
    } finally {
      setIsGeneratingFeedback(false);
    }
  };
  
  // Generate a PDF report
  const generateReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Republic of Bean: Refugee Education Policy Simulation', 20, 20);
      
      // Add user info
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text('Participant Information:', 20, 35);
      doc.text(`Name: ${gameState.userProfile.name}`, 25, 45);
      doc.text(`Age: ${gameState.userProfile.age}`, 25, 52);
      doc.text(`Nationality: ${gameState.userProfile.nationality}`, 25, 59);
      doc.text(`Education: ${gameState.userProfile.educationLevel}`, 25, 66);
      doc.text(`Occupation: ${gameState.userProfile.occupation}`, 25, 73);
      
      // Add policy decisions
      doc.setFont('helvetica', 'bold');
      doc.text('Final Policy Decisions:', 20, 85);
      doc.setFont('helvetica', 'normal');
      
      let yPosition = 95;
      gameState.policyCategories.forEach(category => {
        const selectedOption = category.options.find(opt => opt.id === category.selectedOption);
        if (selectedOption) {
          doc.text(`${category.name}: ${selectedOption.title} (${selectedOption.cost} units)`, 25, yPosition);
          yPosition += 7;
        }
      });
      
      // Add reflection answers
      doc.setFont('helvetica', 'bold');
      yPosition += 10;
      doc.text('Reflection Responses:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      
      reflectionQuestions.forEach(question => {
        yPosition += 10;
        
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text(question.question, 25, yPosition);
        doc.setFont('helvetica', 'normal');
        
        yPosition += 8;
        
        // Add answer with text wrapping
        const answer = reflectionAnswers[question.id] || 'No answer provided';
        const splitText = doc.splitTextToSize(answer, 160);
        doc.text(splitText, 25, yPosition);
        
        yPosition += splitText.length * 7;
      });
      
      // Add feedback
      doc.addPage();
      doc.setFont('helvetica', 'bold');
      doc.text('AI Feedback on Your Policy Decisions:', 20, 20);
      doc.setFont('helvetica', 'normal');
      
      const feedbackText = gameState.finalFeedback || feedback || 'No feedback generated';
      const splitFeedback = doc.splitTextToSize(feedbackText, 170);
      doc.text(splitFeedback, 20, 30);
      
      // Save PDF
      doc.save('refugee-education-policy-simulation.pdf');
      
      // Send PDF via email (this would be implemented server-side)
      sendReportByEmail();
      
      setReportGenerated(true);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('An error occurred while generating the report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };
  
  // Mock function to send report by email
  const sendReportByEmail = async () => {
    // In a real implementation, this would send the PDF to a server endpoint
    // that would then email it to the specified recipients
    console.log('Sending report to aturan@asu.edu and JANEL.WHITE@asu.edu');
    
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };
  
  // Generate mock feedback based on reflection answers
  const generateMockFeedback = () => {
    // In the real implementation, this would be generated by GPT
    return `Thank you for participating in the Republic of Bean refugee education policy simulation. Your policy decisions show a thoughtful approach to complex issues facing refugee education. 

Based on your reflections, you demonstrate strong ethical reasoning in considering the needs of the most vulnerable populations. Your considerations about resource allocation, integration approaches, and cultural sensitivity show a nuanced understanding of the challenges in refugee education.

Your policy package shows a balance between immediate needs and long-term sustainability. The choices you made in language instruction and curriculum adaptation particularly reflect a commitment to meaningful integration while preserving cultural identity.

Areas for further consideration might include how to measure the success of these policies over time, and how to adapt them as the refugee situation evolves. Additionally, considering more stakeholder perspectives, especially from the refugee communities themselves, would strengthen the policies further.

Overall, your approach demonstrates empathy, equity considerations, and practical thinking. This balanced perspective is essential for creating effective refugee education policies.`;
  };
  
  // Format policy selection for display
  const formatPolicySelection = (categoryId: string) => {
    const category = gameState.policyCategories.find(cat => cat.id === categoryId);
    if (!category || category.selectedOption === null) return 'No selection';
    
    const option = category.options.find(opt => opt.id === category.selectedOption);
    if (!option) return 'No selection';
    
    return `${option.title} (${option.cost} units)`;
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Phase 3: Reflection and Feedback</h2>
      
      <div className="bg-amber-50 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-amber-800 mb-3">Final Policy Package</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gameState.policyCategories.map((category) => (
            <div key={category.id} className="bg-white p-4 rounded-lg border border-amber-200">
              <div className="font-semibold text-gray-800">{category.name}</div>
              <div className="text-sm text-gray-600">{formatPolicySelection(category.id)}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-amber-800">
          <p>These are the final policy decisions reached after group discussion. Now, take some time to reflect on the process and outcomes.</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Reflection Questions</h3>
        <p className="text-gray-600 mb-6">Please answer the following questions about your experience in this simulation:</p>
        
        <div className="space-y-6">
          {reflectionQuestions.map((question) => (
            <div key={question.id}>
              <label htmlFor={question.id} className="block text-gray-700 font-medium mb-2">
                {question.question}
              </label>
              <textarea
                id={question.id}
                value={reflectionAnswers[question.id] || ''}
                onChange={(e) => handleReflectionChange(question.id, e.target.value)}
                className="w-full h-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your response..."
                required
              />
            </div>
          ))}
        </div>
        
        <button
          onClick={handleSubmitReflections}
          disabled={isGeneratingFeedback}
          className="mt-6 px-6 py-2 bg-green-700 text-white rounded-md shadow hover:bg-green-800 transition-colors disabled:bg-gray-400"
        >
          {isGeneratingFeedback ? 'Generating Feedback...' : 'Submit Reflections'}
        </button>
      </div>
      
      {feedback && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Feedback</h3>
          <div className="bg-gray-50 p-4 border-l-4 border-green-700 rounded">
            <p className="whitespace-pre-line">{feedback}</p>
          </div>
          
          <div className="mt-6">
            <button
              onClick={generateReport}
              disabled={isGeneratingReport || reportGenerated}
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isGeneratingReport 
                ? 'Generating Report...' 
                : reportGenerated 
                  ? 'Report Generated and Sent' 
                  : 'Generate and Download Report'}
            </button>
            
            {reportGenerated && (
              <p className="mt-3 text-sm text-gray-600">
                The report has been generated and a copy has been sent to the research team. Thank you for participating in this simulation!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseThree; 