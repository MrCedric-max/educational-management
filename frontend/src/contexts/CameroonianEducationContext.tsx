import React, { createContext, useContext, ReactNode } from "react";

// Types and Interfaces
export type PrimaryLevel = "1" | "2" | "3" | "4" | "5" | "6" | "SIL";
export type SchoolSystem = "anglophone" | "francophone";
export type LearningTheme = "english_language" | "mathematics" | "science_technology" | "francais" | "social_studies" | "vocational_studies" | "arts" | "physical_education" | "national_languages" | "ict";

// Cameroonian Class Mappings
export const CAMEROONIAN_CLASS_MAPPING: Record<SchoolSystem, Record<PrimaryLevel, string>> = {
  anglophone: {
    "1": "Class 1",
    "2": "Class 2", 
    "3": "Class 3",
    "4": "Class 4",
    "5": "Class 5",
    "6": "Class 6",
    "SIL": "SIL (Silhouette)"
  },
  francophone: {
    "1": "Cours Préparatoire (CP)",
    "2": "Cours Élémentaire 1 (CE1)",
    "3": "Cours Élémentaire 2 (CE2)", 
    "4": "Cours Moyen 1 (CM1)",
    "5": "Cours Moyen 2 (CM2)",
    "6": "Cours Moyen 2 (CM2)",
    "SIL": "SIL (Silhouette)"
  }
};

// Age Mappings
export const AGE_MAPPING: Record<PrimaryLevel, number> = {
  "1": 6,
  "2": 7,
  "3": 8,
  "4": 9,
  "5": 10,
  "6": 11,
  "SIL": 12,
};

// Learning Objectives
export const LEARNING_OBJECTIVES: Record<SchoolSystem, Record<PrimaryLevel, string[]>> = {
  anglophone: {
    "1": ["Basic literacy and numeracy", "Social skills development", "Motor skills coordination", "Creative expression", "Environmental awareness"],
    "2": ["Reading fluency", "Mathematical operations", "Scientific observation", "Cultural appreciation", "Physical fitness"],
    "3": ["Critical thinking", "Problem solving", "Communication skills", "Teamwork", "Digital literacy"],
    "4": ["Advanced literacy", "Mathematical reasoning", "Scientific inquiry", "Cultural understanding", "Leadership skills"],
    "5": ["Independent learning", "Research skills", "Creative thinking", "Global awareness", "Technology integration"],
    "6": ["Academic excellence", "Critical analysis", "Innovation", "Cultural competence", "Digital citizenship"],
    "SIL": ["Secondary preparation", "Advanced critical thinking", "Independent research", "Leadership demonstration", "Professional preparation"]
  },
  francophone: {
    "1": ["Alphabétisation de base", "Développement des compétences sociales", "Coordination motrice", "Expression créative", "Sensibilisation environnementale"],
    "2": ["Fluidité en lecture", "Opérations mathématiques", "Observation scientifique", "Appréciation culturelle", "Condition physique"],
    "3": ["Pensée critique", "Résolution de problèmes", "Compétences communication", "Travail d'équipe", "Littératie numérique"],
    "4": ["Alphabétisation avancée", "Raisonnement mathématique", "Enquête scientifique", "Compréhension culturelle", "Compétences de leadership"],
    "5": ["Apprentissage indépendant", "Compétences de recherche", "Pensée créative", "Conscience mondiale", "Intégration technologique"],
    "6": ["Excellence académique", "Analyse critique", "Innovation", "Compétence culturelle", "Citoyenneté numérique"],
    "SIL": ["Préparation au secondaire", "Pensée critique avancée", "Recherche indépendante", "Démonstration de leadership", "Préparation professionnelle"]
  }
};

// Assessment Criteria
export const ASSESSMENT_CRITERIA: Record<SchoolSystem, Record<PrimaryLevel, string[]>> = {
  anglophone: {
    "1": ["Participation and engagement", "Basic skill demonstration", "Social interaction", "Creative expression", "Following instructions"],
    "2": ["Skill application", "Understanding demonstration", "Collaboration", "Problem solving", "Progress tracking"],
    "3": ["Knowledge application", "Critical thinking", "Communication effectiveness", "Teamwork", "Self-assessment"],
    "4": ["Advanced skill mastery", "Independent thinking", "Leadership qualities", "Cultural awareness", "Technology use"],
    "5": ["Comprehensive understanding", "Innovation and creativity", "Global perspective", "Digital competence", "Self-directed learning"],
    "6": ["Mastery level performance", "Advanced analysis", "Leadership demonstration", "Cultural competence", "Digital citizenship"],
    "SIL": ["Secondary readiness", "Advanced critical thinking", "Independent research", "Leadership skills", "Professional preparation"]
  },
  francophone: {
    "1": ["Participation et engagement", "Démonstration de compétences de base", "Interaction sociale", "Expression créative", "Suivi des instructions"],
    "2": ["Application des compétences", "Démonstration de compréhension", "Collaboration", "Résolution de problèmes", "Suivi des progrès"],
    "3": ["Application des connaissances", "Pensée critique", "Efficacité de la communication", "Travail d'équipe", "Auto-évaluation"],
    "4": ["Maîtrise des compétences avancées", "Pensée indépendante", "Qualités de leadership", "Conscience culturelle", "Utilisation de la technologie"],
    "5": ["Compréhension complète", "Innovation et créativité", "Perspective mondiale", "Compétence numérique", "Apprentissage autodirigé"],
    "6": ["Performance de niveau maîtrise", "Analyse avancée", "Démonstration de leadership", "Compétence culturelle", "Citoyenneté numérique"],
    "SIL": ["Préparation au secondaire", "Pensée critique avancée", "Recherche indépendante", "Compétences de leadership", "Préparation professionnelle"]
  }
};

// Learning Themes Based on National Anglophone Curriculum
export const LEARNING_THEMES: Record<SchoolSystem, Record<PrimaryLevel, LearningTheme[]>> = {
  anglophone: {
    "1": ["english_language", "mathematics", "science_technology", "francais", "physical_education"],
    "2": ["english_language", "mathematics", "science_technology", "francais", "social_studies", "physical_education", "arts"],
    "3": ["english_language", "mathematics", "science_technology", "francais", "social_studies", "vocational_studies", "arts", "physical_education"],
    "4": ["english_language", "mathematics", "science_technology", "francais", "social_studies", "vocational_studies", "arts", "physical_education", "national_languages"],
    "5": ["english_language", "mathematics", "science_technology", "francais", "social_studies", "vocational_studies", "arts", "physical_education", "national_languages", "ict"],
    "6": ["english_language", "mathematics", "science_technology", "francais", "social_studies", "vocational_studies", "arts", "physical_education", "national_languages", "ict"],
    "SIL": ["english_language", "mathematics", "science_technology", "francais", "social_studies", "vocational_studies", "arts", "physical_education", "national_languages", "ict"]
  },
  francophone: {
    "1": ["francais", "mathematics", "science_technology", "physical_education"],
    "2": ["francais", "mathematics", "science_technology", "social_studies", "physical_education", "arts"],
    "3": ["francais", "mathematics", "science_technology", "social_studies", "vocational_studies", "arts", "physical_education"],
    "4": ["francais", "mathematics", "science_technology", "social_studies", "vocational_studies", "arts", "physical_education", "national_languages"],
    "5": ["francais", "mathematics", "science_technology", "social_studies", "vocational_studies", "arts", "physical_education", "national_languages", "ict"],
    "6": ["francais", "mathematics", "science_technology", "social_studies", "vocational_studies", "arts", "physical_education", "national_languages", "ict"],
    "SIL": ["francais", "mathematics", "science_technology", "social_studies", "vocational_studies", "arts", "physical_education", "national_languages", "ict"]
  }
};

// Learning Theme Labels and Descriptions Based on National Curriculum
export const THEME_LABELS: Record<SchoolSystem, Record<LearningTheme, { label: string; description: string }>> = {
  anglophone: {
    english_language: { 
      label: "English Language & Literature", 
      description: "Listening & Speaking, Reading, Writing, Grammar, Vocabulary & Punctuation, Phonics, Literature" 
    },
    mathematics: { 
      label: "Mathematics", 
      description: "Sets & Logic, Numbers & Operations, Measurements & Size, Geometry & Space, Statistics & Graphs" 
    },
    science_technology: { 
      label: "Science & Technology", 
      description: "Health Education, Environmental Science, Technology & Engineering" 
    },
    francais: { 
      label: "Français", 
      description: "Compréhension et expression orale, Compréhension écrite (lecture), Vocabulaire, Grammaire et conjugaison, Orthographe" 
    },
    social_studies: { 
      label: "Social Studies", 
      description: "History, Geography, Citizenship (Civics, Moral Education, Human Rights, Peace & Security)" 
    },
    vocational_studies: { 
      label: "Vocational Studies", 
      description: "Home Economics, Arts & Crafts, Agro-Pastoral Farming" 
    },
    arts: { 
      label: "Arts", 
      description: "Visual Arts, Performing Arts" 
    },
    physical_education: { 
      label: "Physical Education & Sports", 
      description: "Physical fitness, sports activities, and health education" 
    },
    national_languages: { 
      label: "National Languages & Cultures", 
      description: "Listening & Speaking, Reading, Writing, Grammar" 
    },
    ict: { 
      label: "Information & Communication Technologies", 
      description: "Basic Computer System Knowledge, ICT Tools, Internet & Communication, Health & Safety, Computational Thinking" 
    }
  },
  francophone: {
    francais: { 
      label: "Français", 
      description: "Compréhension et expression orale, Compréhension écrite (lecture), Vocabulaire, Grammaire et conjugaison, Orthographe" 
    },
    mathematics: { 
      label: "Mathématiques", 
      description: "Ensembles & Logique, Nombres & Opérations, Mesures & Taille, Géométrie & Espace, Statistiques & Graphiques" 
    },
    science_technology: { 
      label: "Sciences & Technologie", 
      description: "Éducation à la Santé, Sciences de l'Environnement, Technologie & Ingénierie" 
    },
    social_studies: { 
      label: "Études Sociales", 
      description: "Histoire, Géographie, Citoyenneté (Civisme, Éducation Morale, Droits de l'Homme, Paix & Sécurité)" 
    },
    vocational_studies: { 
      label: "Études Professionnelles", 
      description: "Économie Domestique, Arts & Artisanat, Agriculture & Élevage" 
    },
    arts: { 
      label: "Arts", 
      description: "Arts Visuels, Arts du Spectacle" 
    },
    physical_education: { 
      label: "Éducation Physique & Sports", 
      description: "Condition physique, activités sportives, et éducation à la santé" 
    },
    national_languages: { 
      label: "Langues & Cultures Nationales", 
      description: "Écoute & Expression Orale, Lecture, Écriture, Grammaire" 
    },
    ict: { 
      label: "Technologies de l'Information & Communication", 
      description: "Connaissances de Base du Système Informatique, Outils TIC, Internet & Communication, Santé & Sécurité, Pensée Computationnelle" 
    },
    english_language: { 
      label: "English Language", 
      description: "Listening & Speaking, Reading, Writing, Grammar, Vocabulary" 
    }
  }
};

// Cameroonian Primary School Subjects
export const CAMEROONIAN_SUBJECTS: Record<SchoolSystem, string[]> = {
  anglophone: [
    "English Language",
    "Mathematics",
    "Science",
    "Social Studies",
    "Français",
    "Arts",
    "Physical Education",
    "Vocational Studies",
    "National Languages",
    "ICT"
  ],
  francophone: [
    "Français",
    "Mathématiques",
    "Sciences",
    "Études Sociales",
    "English Language",
    "Arts",
    "Éducation Physique",
    "Études Professionnelles",
    "Langues Nationales",
    "TIC"
  ]
};

// Context Interface
interface CameroonianEducationContextType {
  CAMEROONIAN_CLASS_MAPPING: Record<SchoolSystem, Record<PrimaryLevel, string>>;
  getClassDisplayName: (level: PrimaryLevel, system: SchoolSystem) => string;
  getAgeForLevel: (level: PrimaryLevel) => number;
  getSubjectsForSystem: (system: SchoolSystem) => string[];
  getSubjects: (level: PrimaryLevel, system: SchoolSystem) => Array<{name: string, code: string}>;
  getLearningObjectives: (level: PrimaryLevel, system: SchoolSystem) => string[];
  getAssessmentCriteria: (level: PrimaryLevel, system: SchoolSystem) => string[];
  getSystemDescription: (system: SchoolSystem) => string;
  getTerm: (term: string, system: SchoolSystem) => string;
  getLevelFromClassName: (className: string, system: SchoolSystem) => PrimaryLevel | null;
  getCompetenceBasedObjectives: (level: PrimaryLevel, system: SchoolSystem, subject: string) => string[];
  getProjectPedagogyActivities: (level: PrimaryLevel, system: SchoolSystem, subject: string) => string[];
  getAfricanContextExamples: (level: PrimaryLevel, system: SchoolSystem, subject: string) => string[];
  getLearningThemes: (level: PrimaryLevel, system: SchoolSystem) => LearningTheme[];
  getThemeLabel: (theme: LearningTheme, system: SchoolSystem) => string;
  getThemeDescription: (theme: LearningTheme, system: SchoolSystem) => string;
  getThemeSubjects: (theme: LearningTheme, system: SchoolSystem) => string[];
}

// Context Creation
const CameroonianEducationContext = createContext<CameroonianEducationContextType | undefined>(undefined);

// Helper Functions
const getClassDisplayName = (level: PrimaryLevel, system: SchoolSystem): string => {
  return CAMEROONIAN_CLASS_MAPPING[system][level];
};

const getAgeForLevel = (level: PrimaryLevel): number => {
  return AGE_MAPPING[level];
};

const getSubjectsForSystem = (system: SchoolSystem): string[] => {
  return CAMEROONIAN_SUBJECTS[system];
};

const getSubjects = (level: PrimaryLevel, system: SchoolSystem): Array<{name: string, code: string}> => {
  try {
    console.log("getSubjects called with:", { level, system });
    const themes = LEARNING_THEMES[system][level];
    console.log("themes found:", themes);
    
    const result = themes.map(theme => {
      const themeInfo = THEME_LABELS[system][theme];
      console.log("theme info for", theme, ":", themeInfo);
      return {
        name: themeInfo.label,
        code: theme.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")
      };
    });
    
    console.log("getSubjects result:", result);
    return result;
  } catch (error) {
    console.error("Error in getSubjects:", error);
    return [];
  }
};

const getLearningObjectives = (level: PrimaryLevel, system: SchoolSystem): string[] => {
  return LEARNING_OBJECTIVES[system][level];
};

const getAssessmentCriteria = (level: PrimaryLevel, system: SchoolSystem): string[] => {
  return ASSESSMENT_CRITERIA[system][level];
};

const getSystemDescription = (system: SchoolSystem): string => {
  return system === "anglophone" 
    ? "Anglophone education system with English as the primary language of instruction"
    : "Francophone education system with French as the primary language of instruction";
};

const getTerm = (term: string, system: SchoolSystem): string => {
  const termMap: Record<SchoolSystem, Record<string, string>> = {
    anglophone: {
      "1": "First Term",
      "2": "Second Term", 
      "3": "Third Term"
    },
    francophone: {
      "1": "Premier Trimestre",
      "2": "Deuxième Trimestre",
      "3": "Troisième Trimestre"
    }
  };
  return termMap[system][term] || term;
};

const getLevelFromClassName = (className: string, system: SchoolSystem): PrimaryLevel | null => {
  const classMap = CAMEROONIAN_CLASS_MAPPING[system];
  for (const [level, displayName] of Object.entries(classMap)) {
    if (displayName.toLowerCase() === className.toLowerCase()) {
      return level as PrimaryLevel;
    }
  }
  return null;
};

const getCompetenceBasedObjectives = (level: PrimaryLevel, system: SchoolSystem, subject: string): string[] => {
  // This would be implemented with actual competence-based objectives
  return [
    `Develop ${subject} knowledge and understanding`,
    `Apply ${subject} skills in real-world contexts`,
    `Demonstrate critical thinking in ${subject}`,
    `Show creativity and innovation in ${subject}`
  ];
};

const getProjectPedagogyActivities = (level: PrimaryLevel, system: SchoolSystem, subject: string): string[] => {
  // This would be implemented with actual project-based activities
  return [
    `Create a ${subject} project portfolio`,
    `Conduct ${subject} research investigation`,
    `Present ${subject} findings to peers`,
    `Collaborate on ${subject} group project`
  ];
};

const getAfricanContextExamples = (level: PrimaryLevel, system: SchoolSystem, subject: string): string[] => {
  // This would be implemented with actual African context examples
  return [
    `Apply ${subject} concepts to African cultural contexts`,
    `Use local examples in ${subject} learning`,
    `Connect ${subject} to African history and traditions`,
    `Explore ${subject} through African perspectives`
  ];
};

const getLearningThemes = (level: PrimaryLevel, system: SchoolSystem): LearningTheme[] => {
  return LEARNING_THEMES[system][level];
};

const getThemeLabel = (theme: LearningTheme, system: SchoolSystem): string => {
  return THEME_LABELS[system][theme].label;
};

const getThemeDescription = (theme: LearningTheme, system: SchoolSystem): string => {
  return THEME_LABELS[system][theme].description;
};

const getThemeSubjects = (theme: LearningTheme, system: SchoolSystem): string[] => {
  const themeInfo = THEME_LABELS[system][theme];
  return themeInfo.description.split(", ").map(subject => subject.trim());
};

// Context Provider
export const CameroonianEducationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value: CameroonianEducationContextType = {
    CAMEROONIAN_CLASS_MAPPING,
    getClassDisplayName,
    getAgeForLevel,
    getSubjectsForSystem,
    getSubjects,
    getLearningObjectives,
    getAssessmentCriteria,
    getSystemDescription,
    getTerm,
    getLevelFromClassName,
    getCompetenceBasedObjectives,
    getProjectPedagogyActivities,
    getAfricanContextExamples,
    getLearningThemes,
    getThemeLabel,
    getThemeDescription,
    getThemeSubjects,
  };

  return (
    <CameroonianEducationContext.Provider value={value}>
      {children}
    </CameroonianEducationContext.Provider>
  );
};

// Custom Hook
export const useCameroonianEducation = (): CameroonianEducationContextType => {
  const context = useContext(CameroonianEducationContext);
  if (context === undefined) {
    throw new Error("useCameroonianEducation must be used within a CameroonianEducationProvider");
  }
  return context;
};
