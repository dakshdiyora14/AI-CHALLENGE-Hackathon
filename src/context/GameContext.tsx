import { createContext } from 'react';

// Policy option type
export interface PolicyOption {
  id: number;
  title: string;
  description: string;
  cost: number;
  selected: boolean;
}

// Policy category type
export interface PolicyCategory {
  id: string;
  name: string;
  description: string;
  options: PolicyOption[];
  selectedOption: number | null;
}

// AI Profile type
export interface AIProfile {
  id: string;
  name: string;
  age: number;
  education: string;
  occupation: string;
  socioeconomicStatus: string;
  politicalIdeology: string;
  preferences: Record<string, number>; // Category ID -> preferred option ID
  speaking: boolean;
}

// Game state interface
export interface GameState {
  currentPhase: number;
  userProfile: {
    name: string;
    age: string;
    nationality: string;
    educationLevel: string;
    occupation: string;
  };
  budget: {
    total: number;
    remaining: number;
  };
  policyCategories: PolicyCategory[];
  aiProfiles: AIProfile[];
  discussionTranscript: {
    speaker: string;
    message: string;
    timestamp: Date;
  }[];
  reflectionAnswers: Record<string, string>;
  finalFeedback: string | null;
}

// Initial game state
export const initialGameState: GameState = {
  currentPhase: 0,
  userProfile: {
    name: '',
    age: '',
    nationality: '',
    educationLevel: '',
    occupation: '',
  },
  budget: {
    total: 14,
    remaining: 14,
  },
  policyCategories: [
    {
      id: 'access',
      name: 'Access to Education',
      description: 'Policies regarding how refugees can access educational facilities and services',
      options: [
        {
          id: 1,
          title: 'Separate School Facilities',
          description: 'Create separate educational facilities exclusively for refugee children',
          cost: 3,
          selected: false
        },
        {
          id: 2,
          title: 'Integration with Quotas',
          description: 'Integrate refugee children into local schools with quotas per classroom',
          cost: 2,
          selected: false
        },
        {
          id: 3,
          title: 'Full Integration',
          description: 'Full integration of refugee children into local schools without restrictions',
          cost: 1,
          selected: false
        }
      ],
      selectedOption: null
    },
    {
      id: 'language',
      name: 'Language Instruction',
      description: 'Approaches to language learning and instruction for refugee students',
      options: [
        {
          id: 1,
          title: 'Immersion Approach',
          description: 'Refugee students learn in the local language with no special support',
          cost: 1,
          selected: false
        },
        {
          id: 2,
          title: 'Transitional Bilingual Education',
          description: 'Temporary bilingual support while transitioning to local language',
          cost: 2,
          selected: false
        },
        {
          id: 3,
          title: 'Comprehensive Multilingual Program',
          description: 'Extensive multilingual education supporting both local and refugee languages',
          cost: 3,
          selected: false
        }
      ],
      selectedOption: null
    },
    {
      id: 'teachers',
      name: 'Teacher Training',
      description: 'Training and preparation for teachers working with refugee students',
      options: [
        {
          id: 1,
          title: 'Basic Online Training',
          description: 'Minimal online training modules for teachers',
          cost: 1,
          selected: false
        },
        {
          id: 2,
          title: 'Specialized Workshops',
          description: 'Regular in-person workshops and specialized training sessions',
          cost: 2,
          selected: false
        },
        {
          id: 3,
          title: 'Comprehensive Development Program',
          description: 'Long-term professional development and certification in refugee education',
          cost: 3,
          selected: false
        }
      ],
      selectedOption: null
    },
    {
      id: 'curriculum',
      name: 'Curriculum Adaptation',
      description: 'How educational curriculum is modified for refugee needs',
      options: [
        {
          id: 1,
          title: 'Standard Curriculum',
          description: 'Use the existing curriculum without modifications',
          cost: 1,
          selected: false
        },
        {
          id: 2,
          title: 'Supplementary Materials',
          description: 'Standard curriculum with supplementary materials for refugees',
          cost: 2,
          selected: false
        },
        {
          id: 3,
          title: 'Fully Adapted Curriculum',
          description: 'Completely redesigned curriculum addressing refugee experiences and needs',
          cost: 3,
          selected: false
        }
      ],
      selectedOption: null
    },
    {
      id: 'psychosocial',
      name: 'Psychosocial Support',
      description: 'Mental health and social-emotional support systems for refugee students',
      options: [
        {
          id: 1,
          title: 'Basic Counseling Services',
          description: 'Limited school counselors with basic training',
          cost: 1,
          selected: false
        },
        {
          id: 2,
          title: 'Trauma-Informed Approach',
          description: 'School-wide trauma-informed practices and regular counseling',
          cost: 2,
          selected: false
        },
        {
          id: 3,
          title: 'Comprehensive Mental Health Network',
          description: 'Extensive network of psychologists, social workers, and specialized programs',
          cost: 3,
          selected: false
        }
      ],
      selectedOption: null
    },
    {
      id: 'financial',
      name: 'Financial Support',
      description: 'Financial assistance for refugee families to support education',
      options: [
        {
          id: 1,
          title: 'Basic School Supplies',
          description: 'Provide only essential school supplies',
          cost: 1,
          selected: false
        },
        {
          id: 2,
          title: 'Education Stipend',
          description: 'Monthly stipend to families to cover educational expenses',
          cost: 2,
          selected: false
        },
        {
          id: 3,
          title: 'Comprehensive Support Package',
          description: 'Full coverage of education costs including transportation, supplies, and additional tutoring',
          cost: 3,
          selected: false
        }
      ],
      selectedOption: null
    },
    {
      id: 'certification',
      name: 'Certification & Accreditation',
      description: 'Recognition of previous education and certification of new learning',
      options: [
        {
          id: 1,
          title: 'Limited Recognition',
          description: 'Minimal recognition of prior learning with difficult equivalency process',
          cost: 1,
          selected: false
        },
        {
          id: 2,
          title: 'Standardized Equivalency Process',
          description: 'Clear equivalency process with some flexibility in documentation',
          cost: 2,
          selected: false
        },
        {
          id: 3,
          title: 'Comprehensive Recognition Framework',
          description: 'Robust framework for recognizing prior learning and alternative assessment methods',
          cost: 3,
          selected: false
        }
      ],
      selectedOption: null
    }
  ],
  aiProfiles: [],
  discussionTranscript: [],
  reflectionAnswers: {},
  finalFeedback: null
};

// Context type definition
interface GameContextType {
  gameState: GameState;
  updateGameState: (newData: Partial<GameState>) => void;
}

// Create the context with default values
const GameContext = createContext<GameContextType>({
  gameState: initialGameState,
  updateGameState: () => {}
});

export default GameContext; 