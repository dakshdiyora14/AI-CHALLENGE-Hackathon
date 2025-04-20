import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameContext from '../context/GameContext';

const Introduction = () => {
  const { gameState, updateGameState } = useContext(GameContext);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    nationality: '',
    educationLevel: '',
    occupation: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGameState({ 
      userProfile,
      currentPhase: 1 
    });
    navigate('/phase1');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Welcome to the Republic of Bean</h2>
      
      <div className="bg-amber-50 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-amber-800 mb-3">Scenario Background</h3>
        <p className="mb-4">
          You are a policy advisor in the fictional Republic of Bean, a middle-income nation that has recently
          experienced an influx of refugees from neighboring countries due to regional conflicts. The government
          has tasked you with developing an education policy for refugee children.
        </p>
        <p className="mb-4">
          As an advisor, you will need to make difficult choices regarding how to allocate limited resources
          to provide education for refugee children while balancing various stakeholder concerns and long-term integration goals.
        </p>
        <p>
          This simulation will guide you through the process of individual policy selection, group discussion with AI stakeholders,
          and reflection on the decisions made. Your goal is to create the most effective, equitable, and sustainable
          education policy possible within the constraints provided.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tell us about yourself</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userProfile.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="age" className="block text-gray-700 font-medium mb-2">Age</label>
              <input
                type="text"
                id="age"
                name="age"
                value={userProfile.age}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="nationality" className="block text-gray-700 font-medium mb-2">Nationality</label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={userProfile.nationality}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="educationLevel" className="block text-gray-700 font-medium mb-2">Education Level</label>
              <select
                id="educationLevel"
                name="educationLevel"
                value={userProfile.educationLevel}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select an option</option>
                <option value="High School">High School</option>
                <option value="Some College">Some College</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctoral Degree">Doctoral Degree</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="mb-4 md:col-span-2">
              <label htmlFor="occupation" className="block text-gray-700 font-medium mb-2">Occupation</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={userProfile.occupation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="mt-6 px-6 py-2 bg-green-700 text-white rounded-md shadow hover:bg-green-800 transition-colors"
          >
            Begin Simulation
          </button>
        </form>
      </div>
    </div>
  );
};

export default Introduction; 