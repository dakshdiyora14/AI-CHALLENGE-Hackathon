import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameContext from '../context/GameContext';
import { PolicyCategory, PolicyOption } from '../context/GameContext';

const PhaseOne = () => {
  const { gameState, updateGameState } = useContext(GameContext);
  const navigate = useNavigate();
  const { policyCategories, budget } = gameState;

  const handleOptionSelect = (categoryId: string, optionId: number, cost: number) => {
    // Find the category
    const categoryIndex = policyCategories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) return;

    const category = policyCategories[categoryIndex];
    
    // If same option already selected, deselect it
    if (category.selectedOption === optionId) {
      // Create a new policyCategories array
      const newPolicyCategories = [...policyCategories];
      
      // Get current option cost to add back to budget
      const currentOption = category.options.find(opt => opt.id === optionId);
      const costToAdd = currentOption ? currentOption.cost : 0;
      
      // Update the category
      newPolicyCategories[categoryIndex] = {
        ...category,
        selectedOption: null
      };
      
      // Update game state
      updateGameState({
        policyCategories: newPolicyCategories,
        budget: {
          ...budget,
          remaining: budget.remaining + costToAdd
        }
      });
      return;
    }
    
    // Check if there's already a selected option in this category
    let additionalBudget = 0;
    if (category.selectedOption !== null) {
      // Find the currently selected option
      const currentOption = category.options.find(opt => opt.id === category.selectedOption);
      if (currentOption) {
        additionalBudget = currentOption.cost;
      }
    }
    
    // Check if we have enough budget
    const newRemainingBudget = budget.remaining + additionalBudget - cost;
    if (newRemainingBudget < 0) {
      alert('Not enough budget to select this option!');
      return;
    }
    
    // Create a new policyCategories array
    const newPolicyCategories = [...policyCategories];
    
    // Update the category
    newPolicyCategories[categoryIndex] = {
      ...category,
      selectedOption: optionId
    };
    
    // Update game state
    updateGameState({
      policyCategories: newPolicyCategories,
      budget: {
        ...budget,
        remaining: newRemainingBudget
      }
    });
  };

  const handleNext = () => {
    // Check if all categories have a selection
    const allSelected = policyCategories.every(cat => cat.selectedOption !== null);
    if (!allSelected) {
      alert('Please make a selection for all policy categories before proceeding.');
      return;
    }

    // Generate AI profiles for Phase Two
    const aiProfiles = generateAIProfiles();
    
    // Update game state
    updateGameState({
      currentPhase: 2,
      aiProfiles
    });
    
    // Navigate to Phase Two
    navigate('/phase2');
  };

  // Helper function to generate AI profiles
  const generateAIProfiles = () => {
    // Political ideologies array
    const ideologies = ['Conservative', 'Moderate Conservative', 'Centrist', 'Moderate Liberal', 'Liberal'];
    
    // Education levels
    const educationLevels = ['High School Diploma', 'Associate\'s Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctoral Degree'];
    
    // Occupations
    const occupations = [
      'Teacher', 'School Administrator', 'Social Worker', 'Community Organizer', 
      'Local Business Owner', 'Government Official', 'Academic Researcher'
    ];
    
    // SES levels
    const sesLevels = ['Low Income', 'Lower Middle Class', 'Middle Class', 'Upper Middle Class', 'High Income'];
    
    // Names
    const names = ['Amir', 'Lila', 'Tarek', 'Maya', 'Rami', 'Salma', 'Zain', 'Leila'];
    
    // Generate random AI profiles
    return [
      {
        id: 'ai1',
        name: names[Math.floor(Math.random() * names.length)],
        age: 25 + Math.floor(Math.random() * 40), // Age between 25-65
        education: educationLevels[Math.floor(Math.random() * educationLevels.length)],
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        socioeconomicStatus: sesLevels[Math.floor(Math.random() * sesLevels.length)],
        politicalIdeology: ideologies[Math.floor(Math.random() * ideologies.length)],
        preferences: generateRandomPreferences(),
        speaking: false
      },
      {
        id: 'ai2',
        name: names[Math.floor(Math.random() * names.length)],
        age: 25 + Math.floor(Math.random() * 40),
        education: educationLevels[Math.floor(Math.random() * educationLevels.length)],
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        socioeconomicStatus: sesLevels[Math.floor(Math.random() * sesLevels.length)],
        politicalIdeology: ideologies[Math.floor(Math.random() * ideologies.length)],
        preferences: generateRandomPreferences(),
        speaking: false
      },
      {
        id: 'ai3',
        name: names[Math.floor(Math.random() * names.length)],
        age: 25 + Math.floor(Math.random() * 40),
        education: educationLevels[Math.floor(Math.random() * educationLevels.length)],
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        socioeconomicStatus: sesLevels[Math.floor(Math.random() * sesLevels.length)],
        politicalIdeology: ideologies[Math.floor(Math.random() * ideologies.length)],
        preferences: generateRandomPreferences(),
        speaking: false
      },
      {
        id: 'ai4',
        name: names[Math.floor(Math.random() * names.length)],
        age: 25 + Math.floor(Math.random() * 40),
        education: educationLevels[Math.floor(Math.random() * educationLevels.length)],
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        socioeconomicStatus: sesLevels[Math.floor(Math.random() * sesLevels.length)],
        politicalIdeology: ideologies[Math.floor(Math.random() * ideologies.length)],
        preferences: generateRandomPreferences(),
        speaking: false
      }
    ];
  };

  // Generate random policy preferences for AI agents
  const generateRandomPreferences = () => {
    const preferences: Record<string, number> = {};
    
    policyCategories.forEach(category => {
      preferences[category.id] = Math.floor(Math.random() * 3) + 1; // Random preference 1, 2 or 3
    });
    
    return preferences;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Phase 1: Individual Policy Selection</h2>
      
      <div className="bg-amber-50 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-amber-800 mb-3">Instructions</h3>
        <p className="mb-2">
          As an education policy advisor, you need to create a comprehensive refugee education policy package.
        </p>
        <p className="mb-2">
          You have a total budget of <span className="font-bold">{budget.total} units</span>, and you must allocate resources
          across seven policy categories. Each category has three options of varying cost and impact.
        </p>
        <p>
          Select one option for each category while ensuring your total spending doesn't exceed your budget.
        </p>
      </div>
      
      <div className="sticky top-0 bg-white p-4 border border-gray-200 rounded-md shadow-sm mb-6 z-10">
        <div className="flex justify-between items-center">
          <div className="font-medium">
            Budget Remaining: <span className={`font-bold ${budget.remaining < 3 ? 'text-red-600' : 'text-green-600'}`}>
              {budget.remaining}/{budget.total} units
            </span>
          </div>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Proceed to Group Discussion
          </button>
        </div>
      </div>
      
      <div className="space-y-10">
        {policyCategories.map((category) => (
          <div key={category.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{category.name}</h3>
            <p className="text-gray-600 mb-6">{category.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {category.options.map((option) => (
                <div 
                  key={option.id}
                  onClick={() => handleOptionSelect(category.id, option.id, option.cost)}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    category.selectedOption === option.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{option.title}</h4>
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                      {option.cost} {option.cost === 1 ? 'unit' : 'units'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhaseOne; 