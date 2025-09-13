import React, { createContext, useContext, ReactNode } from "react";
import { PrimaryLevel, SchoolSystem } from "./CameroonianEducationContext";

// Curriculum Topic Interface
export interface CurriculumTopic {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  activities: string[];
  resources: string[];
  assessment: string[];
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// Competence-Based Activity Interface
export interface CompetenceActivity {
  id: string;
  title: string;
  description: string;
  competences: string[];
  activities: string[];
  materials: string[];
  evaluation: string[];
  duration: string;
}

// Context Interface
interface CameroonianCurriculumContextType {
  getTopicsForSubject: (subject: string, level: PrimaryLevel, system: SchoolSystem) => CurriculumTopic[];
  getCompetenceActivities: (subject: string, level: PrimaryLevel, system: SchoolSystem) => CompetenceActivity[];
  getSubjectDescription: (subject: string, level: PrimaryLevel, system: SchoolSystem) => string;
  getTopicById: (topicId: string) => CurriculumTopic | null;
  getActivityById: (activityId: string) => CompetenceActivity | null;
  getCompetenceBasedActivities: (subject: string, level: PrimaryLevel, system: SchoolSystem) => string[];
  getProjectPedagogySuggestions: (subject: string, level: PrimaryLevel, system: SchoolSystem) => string[];
  getAfricanContextExamples: (subject: string, level: PrimaryLevel, system: SchoolSystem) => string[];
}

// Context Creation
const CameroonianCurriculumContext = createContext<CameroonianCurriculumContextType | undefined>(undefined);

// Sample Curriculum Data
const CURRICULUM_TOPICS: Record<SchoolSystem, Record<PrimaryLevel, Record<string, CurriculumTopic[]>>> = {
  anglophone: {
    "1": {
      "English Language": [
        {
          id: "eng_1_phonics",
          title: "Basic Phonics",
          description: "Introduction to letter sounds and basic reading skills",
          objectives: ["Recognize letter sounds", "Blend simple words", "Read basic sentences"],
          activities: ["Letter sound games", "Word building", "Reading practice"],
          resources: ["Phonics cards", "Picture books", "Audio recordings"],
          assessment: ["Oral reading", "Sound recognition", "Word building"],
          duration: "4 weeks",
          difficulty: "beginner"
        }
      ],
      "Mathematics": [
        {
          id: "math_1_numbers",
          title: "Numbers 1-20",
          description: "Counting, recognizing, and writing numbers from 1 to 20",
          objectives: ["Count from 1-20", "Recognize number symbols", "Write numbers correctly"],
          activities: ["Counting games", "Number tracing", "Number recognition"],
          resources: ["Number cards", "Counting objects", "Workbooks"],
          assessment: ["Counting test", "Number writing", "Recognition quiz"],
          duration: "3 weeks",
          difficulty: "beginner"
        }
      ]
    },
    "2": {
      "English Language": [
        {
          id: "eng_2_reading",
          title: "Reading Fluency",
          description: "Developing reading skills and comprehension",
          objectives: ["Read with fluency", "Understand simple texts", "Answer comprehension questions"],
          activities: ["Guided reading", "Reading aloud", "Comprehension exercises"],
          resources: ["Leveled readers", "Comprehension worksheets", "Audio books"],
          assessment: ["Reading fluency test", "Comprehension quiz", "Oral presentation"],
          duration: "6 weeks",
          difficulty: "intermediate"
        }
      ]
    },
    "3": {},
    "4": {},
    "5": {},
    "6": {},
    "SIL": {
      "English Language": [
        {
          id: "eng_sil_advanced",
          title: "Advanced English Skills",
          description: "Preparing for secondary school English requirements",
          objectives: ["Master complex grammar", "Write essays", "Analyze literature"],
          activities: ["Essay writing", "Literature analysis", "Debate practice"],
          resources: ["Literature texts", "Grammar guides", "Writing templates"],
          assessment: ["Essay writing", "Literature exam", "Oral presentation"],
          duration: "8 weeks",
          difficulty: "advanced"
        }
      ]
    }
  },
  francophone: {
    "1": {
      "Français": [
        {
          id: "fr_1_lecture",
          title: "Initiation à la Lecture",
          description: "Introduction aux sons et à la lecture de base",
          objectives: ["Reconnaître les sons", "Lire des mots simples", "Comprendre des phrases"],
          activities: ["Jeux de sons", "Construction de mots", "Pratique de lecture"],
          resources: ["Cartes de sons", "Livres d'images", "Enregistrements audio"],
          assessment: ["Lecture orale", "Reconnaissance des sons", "Construction de mots"],
          duration: "4 semaines",
          difficulty: "beginner"
        }
      ]
    },
    "2": {},
    "3": {},
    "4": {},
    "5": {},
    "6": {},
    "SIL": {}
  }
};

const COMPETENCE_ACTIVITIES: Record<SchoolSystem, Record<PrimaryLevel, Record<string, CompetenceActivity[]>>> = {
  anglophone: {
    "1": {
      "English Language": [
        {
          id: "comp_eng_1_communication",
          title: "Communication Skills",
          description: "Developing basic communication competences",
          competences: ["Listening", "Speaking", "Reading", "Writing"],
          activities: ["Show and tell", "Story telling", "Role playing"],
          materials: ["Picture cards", "Story books", "Props"],
          evaluation: ["Oral presentation", "Participation", "Creativity"],
          duration: "2 weeks"
        }
      ]
    },
    "2": {},
    "3": {},
    "4": {},
    "5": {},
    "6": {},
    "SIL": {}
  },
  francophone: {
    "1": {
      "Français": [
        {
          id: "comp_fr_1_communication",
          title: "Compétences de Communication",
          description: "Développement des compétences de communication de base",
          competences: ["Écoute", "Expression orale", "Lecture", "Écriture"],
          activities: ["Montrer et raconter", "Raconter des histoires", "Jeu de rôle"],
          materials: ["Cartes d'images", "Livres d'histoires", "Accessoires"],
          evaluation: ["Présentation orale", "Participation", "Créativité"],
          duration: "2 semaines"
        }
      ]
    },
    "2": {},
    "3": {},
    "4": {},
    "5": {},
    "6": {},
    "SIL": {}
  }
};

// Helper Functions
const getTopicsForSubject = (subject: string, level: PrimaryLevel, system: SchoolSystem): CurriculumTopic[] => {
  try {
    const topics = CURRICULUM_TOPICS[system][level][subject];
    return topics || [];
  } catch (error) {
    console.error("Error getting topics for subject:", error);
    return [];
  }
};

const getCompetenceActivities = (subject: string, level: PrimaryLevel, system: SchoolSystem): CompetenceActivity[] => {
  try {
    const activities = COMPETENCE_ACTIVITIES[system][level][subject];
    return activities || [];
  } catch (error) {
    console.error("Error getting competence activities:", error);
    return [];
  }
};

const getSubjectDescription = (subject: string, level: PrimaryLevel, system: SchoolSystem): string => {
  const descriptions: Record<SchoolSystem, Record<string, string>> = {
    anglophone: {
      "English Language": "Comprehensive English language development including reading, writing, speaking, and listening skills",
      "Mathematics": "Mathematical concepts and problem-solving skills appropriate for the level",
      "Science": "Scientific inquiry and understanding of natural phenomena",
      "Social Studies": "Understanding of society, culture, and citizenship"
    },
    francophone: {
      "Français": "Développement complet de la langue française incluant lecture, écriture, expression orale et écoute",
      "Mathématiques": "Concepts mathématiques et compétences de résolution de problèmes adaptés au niveau",
      "Sciences": "Enquête scientifique et compréhension des phénomènes naturels",
      "Études Sociales": "Compréhension de la société, de la culture et de la citoyenneté"
    }
  };
  
  return descriptions[system][subject] || "Subject description not available";
};

const getTopicById = (topicId: string): CurriculumTopic | null => {
  for (const system in CURRICULUM_TOPICS) {
    for (const level in CURRICULUM_TOPICS[system as SchoolSystem]) {
      for (const subject in CURRICULUM_TOPICS[system as SchoolSystem][level as PrimaryLevel]) {
        const topics = CURRICULUM_TOPICS[system as SchoolSystem][level as PrimaryLevel][subject];
        const topic = topics.find(t => t.id === topicId);
        if (topic) return topic;
      }
    }
  }
  return null;
};

const getActivityById = (activityId: string): CompetenceActivity | null => {
  for (const system in COMPETENCE_ACTIVITIES) {
    for (const level in COMPETENCE_ACTIVITIES[system as SchoolSystem]) {
      for (const subject in COMPETENCE_ACTIVITIES[system as SchoolSystem][level as PrimaryLevel]) {
        const activities = COMPETENCE_ACTIVITIES[system as SchoolSystem][level as PrimaryLevel][subject];
        const activity = activities.find(a => a.id === activityId);
        if (activity) return activity;
      }
    }
  }
  return null;
};

const getCompetenceBasedActivities = (subject: string, level: PrimaryLevel, system: SchoolSystem): string[] => {
  try {
    const activities = getCompetenceActivities(subject, level, system);
    return activities.flatMap(activity => activity.activities);
  } catch (error) {
    console.error("Error getting competence-based activities:", error);
    return [
      `Develop ${subject} knowledge through hands-on activities`,
      `Apply ${subject} concepts in real-world scenarios`,
      `Collaborate on ${subject} group projects`,
      `Present ${subject} findings to peers`
    ];
  }
};

const getProjectPedagogySuggestions = (subject: string, level: PrimaryLevel, system: SchoolSystem): string[] => {
  const suggestions: Record<SchoolSystem, Record<PrimaryLevel, string[]>> = {
    anglophone: {
      "1": [
        "Create a visual story about the topic",
        "Build a simple model or diorama",
        "Make a class presentation",
        "Create a picture book"
      ],
      "2": [
        "Design a poster about the topic",
        "Create a simple experiment",
        "Make a group presentation",
        "Build a classroom display"
      ],
      "3": [
        "Research and present findings",
        "Create a multimedia presentation",
        "Design a survey and analyze results",
        "Organize a class debate"
      ],
      "4": [
        "Conduct independent research",
        "Create a documentary or video",
        "Design and implement a solution",
        "Lead a class discussion"
      ],
      "5": [
        "Develop a comprehensive project portfolio",
        "Create an interactive presentation",
        "Design and test a hypothesis",
        "Mentor younger students"
      ],
      "6": [
        "Complete a capstone project",
        "Create a professional presentation",
        "Conduct original research",
        "Develop a community service project"
      ],
      "SIL": [
        "Complete advanced research project",
        "Create professional-quality presentation",
        "Develop innovative solutions",
        "Lead school-wide initiatives"
      ]
    },
    francophone: {
      "1": [
        "Créer une histoire visuelle sur le sujet",
        "Construire un modèle simple ou un diorama",
        "Faire une présentation en classe",
        "Créer un livre d'images"
      ],
      "2": [
        "Concevoir une affiche sur le sujet",
        "Créer une expérience simple",
        "Faire une présentation de groupe",
        "Construire un affichage en classe"
      ],
      "3": [
        "Rechercher et présenter les résultats",
        "Créer une présentation multimédia",
        "Concevoir une enquête et analyser les résultats",
        "Organiser un débat en classe"
      ],
      "4": [
        "Effectuer une recherche indépendante",
        "Créer un documentaire ou une vidéo",
        "Concevoir et mettre en œuvre une solution",
        "Diriger une discussion en classe"
      ],
      "5": [
        "Développer un portfolio de projet complet",
        "Créer une présentation interactive",
        "Concevoir et tester une hypothèse",
        "Mentorer des élèves plus jeunes"
      ],
      "6": [
        "Terminer un projet de synthèse",
        "Créer une présentation professionnelle",
        "Effectuer une recherche originale",
        "Développer un projet de service communautaire"
      ],
      "SIL": [
        "Terminer un projet de recherche avancé",
        "Créer une présentation de qualité professionnelle",
        "Développer des solutions innovantes",
        "Diriger des initiatives à l'échelle de l'école"
      ]
    }
  };
  
  return suggestions[system][level] || [
    `Create a project about ${subject}`,
    `Research and present on ${subject}`,
    `Design a solution related to ${subject}`,
    `Collaborate on a ${subject} initiative`
  ];
};

const getAfricanContextExamples = (subject: string, level: PrimaryLevel, system: SchoolSystem): string[] => {
  const examples: Record<SchoolSystem, string[]> = {
    anglophone: [
      `Use African folktales to teach ${subject} concepts`,
      `Incorporate local cultural practices in ${subject} learning`,
      `Study ${subject} through African historical perspectives`,
      `Apply ${subject} to solve local community challenges`,
      `Explore ${subject} using African art and music`,
      `Connect ${subject} to traditional African knowledge systems`
    ],
    francophone: [
      `Utiliser les contes africains pour enseigner les concepts de ${subject}`,
      `Intégrer les pratiques culturelles locales dans l'apprentissage de ${subject}`,
      `Étudier ${subject} à travers les perspectives historiques africaines`,
      `Appliquer ${subject} pour résoudre les défis communautaires locaux`,
      `Explorer ${subject} en utilisant l'art et la musique africains`,
      `Connecter ${subject} aux systèmes de connaissances traditionnels africains`
    ]
  };
  
  return examples[system] || [
    `Apply ${subject} concepts to African contexts`,
    `Use local examples in ${subject} learning`,
    `Connect ${subject} to African culture and history`
  ];
};

// Context Provider
export const CameroonianCurriculumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value: CameroonianCurriculumContextType = {
    getTopicsForSubject,
    getCompetenceActivities,
    getSubjectDescription,
    getTopicById,
    getActivityById,
    getCompetenceBasedActivities,
    getProjectPedagogySuggestions,
    getAfricanContextExamples,
  };

  return (
    <CameroonianCurriculumContext.Provider value={value}>
      {children}
    </CameroonianCurriculumContext.Provider>
  );
};

// Custom Hook
export const useCameroonianCurriculum = (): CameroonianCurriculumContextType => {
  const context = useContext(CameroonianCurriculumContext);
  if (context === undefined) {
    throw new Error("useCameroonianCurriculum must be used within a CameroonianCurriculumProvider");
  }
  return context;
};
