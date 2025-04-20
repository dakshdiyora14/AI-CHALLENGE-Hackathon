import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Introduction from './components/Introduction';
import PhaseOne from './components/PhaseOne';
import PhaseTwo from './components/PhaseTwo';
import PhaseThree from './components/PhaseThree';
import GameContext, { initialGameState } from './context/GameContext';

function App() {
  const [gameState, setGameState] = useState(initialGameState);
  const navigate = useNavigate();

  // Update game state with new data
  const updateGameState = (newData: any) => {
    setGameState(prevState => ({
      ...prevState,
      ...newData
    }));
  };

  return (
    <GameContext.Provider value={{ gameState, updateGameState }}>
      <div className="app-container min-h-screen">
        <header className="bg-green-700 text-white py-4 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Republic of Bean: Refugee Education Policy Simulation</h1>
            {gameState.currentPhase > 0 && (
              <div className="flex items-center mt-2">
                <div className="mr-4">Phase: {gameState.currentPhase}/3</div>
                {gameState.budget !== null && (
                  <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    Budget: {gameState.budget.remaining}/{gameState.budget.total} units
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="container mx-auto py-6">
          <Routes>
            <Route path="/" element={<Introduction />} />
            <Route path="/phase1" element={<PhaseOne />} />
            <Route path="/phase2" element={<PhaseTwo />} />
            <Route path="/phase3" element={<PhaseThree />} />
          </Routes>
        </main>

        <footer className="bg-gray-100 py-4 border-t">
          <div className="container mx-auto text-center text-gray-600">
            AI CHALLENGE Game - Republic of Bean Education Policy Simulation
          </div>
        </footer>
      </div>
    </GameContext.Provider>
  );
}

export default App; 