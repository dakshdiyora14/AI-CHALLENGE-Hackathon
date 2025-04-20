# Republic of Bean: Refugee Education Policy Simulation

A full-stack web application for simulating refugee education policymaking in the fictional Republic of Bean. This interactive simulation involves three phases: individual policy selection, group discussion with AI stakeholders, and reflection.

## Features

- **Phase 1:** Individual policy decision-making across 7 categories with budget constraints
- **Phase 2:** Interactive group discussion with 4 AI bots representing diverse stakeholders
- **Phase 3:** Reflection, AI feedback, and report generation

## Technology Stack

- **Frontend:** React with TypeScript, TailwindCSS
- **Backend:** Express.js with Node.js
- **Communication:** WebSockets via Socket.IO
- **AI Integration:** OpenAI GPT API
- **PDF Generation:** jsPDF

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API Key

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd refugee-education-game
   ```

2. Install dependencies for the main project, client, and server:
   ```
   npm run install-all
   ```

   Alternatively, you can install each part separately:
   ```
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. Set up environment variables:
   - Navigate to the server folder and create a `.env` file based on the provided example
   - Add your OpenAI API key
   - Configure email settings if you want to enable report emailing

## Running the Application

1. Development mode (with hot reloading):
   ```
   npm run dev
   ```

   This will start both the client (on port 5173) and server (on port 3001).

2. Production mode:
   ```
   npm run build
   npm start
   ```

## Game Flow

### Phase 1: Individual Decision-Making
- Read the scenario about the Republic of Bean
- Allocate your 14-unit budget across 7 policy categories
- Each category has 3 options (costing 1, 2, or 3 units)

### Phase 2: Group Discussion
- Interact with 4 AI stakeholders with different profiles and perspectives
- Discuss each policy category and vote on final decisions
- Use voice recognition to speak with the AI stakeholders

### Phase 3: Reflection and Feedback
- Review the final policy package
- Answer reflection questions about your experience
- Receive AI-generated feedback on your decisions
- Generate a PDF report of your simulation results

## Implementation Details

### AI Stakeholder Profiles
The simulation randomly generates 4 AI stakeholders with diverse:
- Ages
- Education levels
- Occupations
- Socioeconomic statuses
- Political ideologies

### Voice Interaction
Users can interact with AI stakeholders using:
- Text input
- Voice input (via the Web Speech API)

### Report Generation
The final PDF report includes:
- User's profile information
- All policy decisions
- Group discussion results
- Reflection answers
- AI feedback

## License

ISC

## Acknowledgments

- This project was created for the AI CHALLENGE game hackathon
- OpenAI for providing the API for AI stakeholder simulation
- Arizona State University researchers 