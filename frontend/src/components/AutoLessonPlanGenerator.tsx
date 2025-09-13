import React, { useState } from 'react';
import { 
  BookOpen, FileText, Clock, Target, Users, Settings, 
  Download, Edit, Save, X, Plus, Trash2, Eye
} from 'lucide-react';
import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';
import { useCameroonianCurriculum } from '../contexts/CameroonianCurriculumContext';
import { useAuth } from '../contexts/AuthContext';
import { PrimaryLevel } from '../contexts/CameroonianEducationContext';
import toast from 'react-hot-toast';

interface AutoLessonPlanGeneratorProps {
  onClose: () => void;
  onSave: (lessonPlan: any) => void;
}

// Anglophone Lesson Stage
interface AnglophoneLessonStage {
  stage: string;
  content: string;
  facilitatingActivities: string;
  learningActivities: string;
  resources: string;
}

// Francophone Lesson Stage
interface FrancophoneLessonStage {
  etape: string;
  opi: string;
  activitesEnseignant: string;
  activitesEleve: string;
  materiel: string;
  duree: string;
  modeRegroupement: string;
}

// Template types for Francophone lessons
type FrancophoneTemplateType = 'mathematiques' | 'francais-lecture' | 'francais-langue';

// Anglophone Lesson Plan
interface AnglophoneLessonPlan {
  id: string;
  // Header Section - Left Side
  integrated: string;
  learningTheme: string;
  domain: string;
  lessonTitle: string;
  entryBehaviour: string;
  specificObjectives: string;
  didacticMaterials: string;
  references: string;
  
  // Header Section - Right Side
  class: string;
  enrolment: number;
  time: string;
  duration: number;
  
  // Additional fields
  subject: string;
  system: 'anglophone';
  level: string;
  stages: AnglophoneLessonStage[];
  date: string;
  status: 'draft' | 'ready' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// Francophone Lesson Plan
interface FrancophoneLessonPlan {
  id: string;
  // Header Section
  centreInteret: string;
  domaine: string;
  discipline: string;
  sousDiscipline: string;
  titre: string;
  duree: number;
  niveau: string;
  classe: string;
  effectif: number;
  competenceVisee: string;
  competenceADevelopper: string;
  opo: string;
  opr: string;
  
  // Additional fields
  subject: string;
  system: 'francophone';
  level: string;
  stages: FrancophoneLessonStage[];
  date: string;
  status: 'draft' | 'ready' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// Union type for lesson plans
type CameroonianLessonPlan = AnglophoneLessonPlan | FrancophoneLessonPlan;

const AutoLessonPlanGenerator: React.FC<AutoLessonPlanGeneratorProps> = ({
  onClose,
  onSave
}) => {
  const { getClassDisplayName, getSubjects, getAgeForLevel } = useCameroonianEducation();
  const { language, school } = useAuth();
  const { getCompetenceBasedActivities, getProjectPedagogySuggestions, getAfricanContextExamples } = useCameroonianCurriculum();

  // Automatically set the system based on the user's school
  const [selectedSystem, setSelectedSystem] = useState<'anglophone' | 'francophone'>('anglophone');
  const [selectedLevel, setSelectedLevel] = useState<PrimaryLevel>('1');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  // Update system when school changes
  React.useEffect(() => {
    if (school?.system) {
      setSelectedSystem(school.system);
    } else {
      // If no school is set, default to anglophone
      setSelectedSystem('anglophone');
    }
  }, [school?.system]);
  
  // Anglophone fields
  const [integrated, setIntegrated] = useState<string>('');
  const [learningTheme, setLearningTheme] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [entryBehaviour, setEntryBehaviour] = useState<string>('');
  const [specificObjectives, setSpecificObjectives] = useState<string>('');
  const [didacticMaterials, setDidacticMaterials] = useState<string>('');
  const [references, setReferences] = useState<string>('');
  const [enrolment, setEnrolment] = useState<number>(25);
  const [time, setTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(40);
  
  // Francophone fields
  const [selectedFrancophoneTemplate, setSelectedFrancophoneTemplate] = useState<FrancophoneTemplateType>('mathematiques');
  const [centreInteret, setCentreInteret] = useState<string>('');
  const [domaine, setDomaine] = useState<string>('Les connaissances fondamentales');
  const [discipline, setDiscipline] = useState<string>('');
  const [sousDiscipline, setSousDiscipline] = useState<string>('');
  const [titre, setTitre] = useState<string>('');
  const [niveau, setNiveau] = useState<string>('');
  const [classe, setClasse] = useState<string>('');
  const [effectif, setEffectif] = useState<number>(25);
  const [competenceVisee, setCompetenceVisee] = useState<string>('');
  const [competenceADevelopper, setCompetenceADevelopper] = useState<string>('');
  const [opo, setOpo] = useState<string>('');
  const [opr, setOpr] = useState<string>('');
  const [duree, setDuree] = useState<number>(45);

  // Francophone template configurations based on your documents
  const francophoneTemplateConfigs = {
    mathematiques: {
      title: 'Mathématiques',
      discipline: 'Mathématiques',
      sousDiscipline: '',
      duree: 45,
      competenceVisee: 'Utiliser les notions de base en mathématiques',
      etapes: [
        'Révision',
        'Introduction et motivation',
        'Découverte',
        'Analyse',
        'Confrontation',
        'Consolidation',
        'Synthèse',
        'Évaluation'
      ]
    },
    'francais-lecture': {
      title: 'Français - Lecture',
      discipline: 'Français',
      sousDiscipline: 'Lecture',
      duree: 30,
      competenceVisee: 'Développer les compétences en lecture',
      etapes: [
        'Révision',
        'Mise en situation ou phase globale',
        'Évaluation',
        'Phase analytique',
        'Synthétique',
        'Combinatoire I',
        'Discrimination auditive',
        'Discrimination visuelle',
        'Combinatoire II',
        'Formation des phrases simples',
        'Écriture',
        'Épeler les mots'
      ]
    },
    'francais-langue': {
      title: 'Français - Langue',
      discipline: 'Français',
      sousDiscipline: 'Initiation à l\'étude de la langue',
      duree: 45,
      competenceVisee: 'Maîtriser les notions de grammaire, vocabulaire et orthographe',
      etapes: [
        'Éveil',
        'Révision',
        'Introduction et motivation',
        'Découverte',
        'Analyse',
        'Synthèse',
        'Évaluation'
      ]
    }
  };
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<CameroonianLessonPlan | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Initialize Francophone template
  const initializeFrancophoneTemplate = (template: FrancophoneTemplateType) => {
    const config = francophoneTemplateConfigs[template];
    setDiscipline(config.discipline);
    setSousDiscipline(config.sousDiscipline);
    setDuree(config.duree);
    setCompetenceVisee(config.competenceVisee);
  };

  // Handle Francophone template change
  const handleFrancophoneTemplateChange = (template: FrancophoneTemplateType) => {
    setSelectedFrancophoneTemplate(template);
    initializeFrancophoneTemplate(template);
  };

  const levels: PrimaryLevel[] = ['1', '2', '3', '4', '5', '6', 'SIL'];
  const subjects = getSubjects(selectedLevel, selectedSystem);

  // Anglophone data
  const learningThemes = [
    'The Home', 'The School', 'The Community', 'The Environment', 
    'Health and Safety', 'Culture and Heritage', 'Technology', 'Communication'
  ];

  const domains = [
    'Listening and Speaking', 'Reading', 'Writing', 'Grammar', 
    'Vocabulary', 'Comprehension', 'Composition', 'Literature'
  ];

  // Francophone data
  const centresInteret = [
    'La famille', 'L\'école', 'La communauté', 'L\'environnement',
    'La santé et la sécurité', 'La culture et le patrimoine', 'La technologie', 'La communication'
  ];

  const domaines = [
    'Les connaissances fondamentales', 'Les compétences transversales',
    'L\'éducation civique et morale', 'L\'éducation physique et sportive'
  ];

  const disciplines = [
    'Mathématiques', 'Français', 'Sciences', 'Histoire-Géographie',
    'Éducation civique', 'Éducation physique', 'Arts plastiques', 'Musique'
  ];

  const generateLessonPlan = async () => {
    // Validate required fields based on system with detailed error messages
    if (selectedSystem === 'anglophone') {
      const missingFields = [];
      if (!lessonTitle.trim()) missingFields.push('Lesson Title');
      if (!selectedSubject) missingFields.push('Subject');
      if (!learningTheme) missingFields.push('Learning Theme');
      if (!domain) missingFields.push('Domain');
      if (!integrated.trim()) missingFields.push('Integrated');
      
      if (missingFields.length > 0) {
        toast.error(language === 'en' 
          ? `Please fill in: ${missingFields.join(', ')}` 
          : `Veuillez remplir: ${missingFields.join(', ')}`);
        return;
      }
    } else {
      const missingFields = [];
      if (!titre.trim()) missingFields.push('Titre');
      if (!selectedSubject) missingFields.push('Subject');
      if (!domaine) missingFields.push('Domaine');
      if (!discipline) missingFields.push('Discipline');
      if (!centreInteret.trim()) missingFields.push('Centre d\'Intérêt');
      
      if (missingFields.length > 0) {
        toast.error(language === 'en' 
          ? `Please fill in: ${missingFields.join(', ')}` 
          : `Veuillez remplir: ${missingFields.join(', ')}`);
        return;
      }
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate competence-based activities
      const competenceActivities = getCompetenceBasedActivities(selectedSubject, selectedLevel, selectedSystem);
      const projectSuggestions = getProjectPedagogySuggestions(selectedSubject, selectedLevel, selectedSystem);
      const africanExamples = getAfricanContextExamples(selectedSubject, selectedLevel, selectedSystem);

      let lessonPlan: CameroonianLessonPlan;

      if (selectedSystem === 'anglophone') {
        // Generate Anglophone lesson plan
        lessonPlan = {
          id: `lesson_${Date.now()}`,
          // Header Section - Left Side
          integrated: integrated,
          learningTheme: learningTheme,
          domain: domain,
          lessonTitle: lessonTitle,
          entryBehaviour: entryBehaviour || generateEntryBehaviour(lessonTitle, selectedSubject, selectedLevel),
          specificObjectives: specificObjectives || generateSpecificObjectives(lessonTitle, selectedSubject, selectedLevel, domain),
          didacticMaterials: didacticMaterials || generateDidacticMaterials(selectedSubject, selectedLevel, africanExamples).join(', '),
          references: references || generateReferences(selectedSubject, selectedLevel).join('; '),
          
          // Header Section - Right Side
          class: getClassDisplayName(selectedLevel, selectedSystem),
          enrolment: enrolment,
          time: time || 'Insert time',
          duration: duration,
          
          // Additional fields
          subject: selectedSubject,
          system: 'anglophone',
          level: selectedLevel,
          stages: generateAnglophoneLessonStages(lessonTitle, selectedSubject, selectedLevel, domain, competenceActivities, projectSuggestions),
          date: new Date().toISOString().split('T')[0],
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      } else {
        // Generate Francophone lesson plan
        lessonPlan = {
          id: `lesson_${Date.now()}`,
          // Header Section
          centreInteret: centreInteret,
          domaine: domaine,
          discipline: discipline,
          sousDiscipline: sousDiscipline,
          titre: titre,
          duree: duration,
          niveau: niveau || getClassDisplayName(selectedLevel, selectedSystem),
          classe: classe || getClassDisplayName(selectedLevel, selectedSystem),
          effectif: effectif,
          competenceVisee: competenceVisee || generateCompetenceVisee(titre, selectedSubject, selectedLevel),
          competenceADevelopper: competenceADevelopper || generateCompetenceADevelopper(titre, selectedSubject, selectedLevel),
          opo: opo || generateOPO(titre, selectedSubject, selectedLevel),
          opr: opr || generateOPR(titre, selectedSubject, selectedLevel),
          
          // Additional fields
          subject: selectedSubject,
          system: 'francophone',
          level: selectedLevel,
          stages: generateFrancophoneLessonStages(titre, selectedSubject, selectedLevel, domaine, competenceActivities, projectSuggestions),
          date: new Date().toISOString().split('T')[0],
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }

      setGeneratedPlan(lessonPlan);
      setIsEditing(true);
      toast.success(language === 'en' ? 'Lesson plan generated successfully!' : 'Plan de leçon généré avec succès!');
    } catch (error) {
      toast.error(language === 'en' ? 'Error generating lesson plan' : 'Erreur lors de la génération du plan de leçon');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDurationForLevel = (level: PrimaryLevel): number => {
    const durationMap = {
      '1': 35,
      '2': 40,
      '3': 45,
      '4': 50,
      '5': 50,
      '6': 50,
      'SIL': 60
    };
    return durationMap[level];
  };

  const generateEntryBehaviour = (title: string, subject: string, level: PrimaryLevel): string => {
    if (subject.toLowerCase().includes('language') || subject.toLowerCase().includes('français')) {
      return `Learners can recognize familiar people at home and respond when called`;
    } else if (subject.toLowerCase().includes('mathematics') || subject.toLowerCase().includes('mathématiques')) {
      return `Learners can count from 1 to 10 and recognize basic shapes`;
    } else if (subject.toLowerCase().includes('science') || subject.toLowerCase().includes('sciences')) {
      return `Learners can identify common objects in their environment`;
    }
    return `Learners have basic knowledge related to ${title.toLowerCase()}`;
  };

  const generateSpecificObjectives = (title: string, subject: string, level: PrimaryLevel, domain: string): string => {
    const baseObjectives = [
      `Understand the concept of ${title.toLowerCase()}`,
      `Apply knowledge of ${title.toLowerCase()} in practical situations`,
      `Demonstrate comprehension through activities`
    ];

    if (domain.toLowerCase().includes('listening and speaking')) {
      return [
        `Use greetings such as "Hello!", "Hi!", and "Good morning" in real situations`,
        `Express greetings politely to elders and family using respectful tone`,
        `Respond to peer greetings during guided activities`
      ].join('; ');
    } else if (domain.toLowerCase().includes('reading')) {
      return [
        `Read and comprehend texts related to ${title.toLowerCase()}`,
        `Identify key words and phrases in context`,
        `Demonstrate understanding through oral responses`
      ].join('; ');
    } else if (domain.toLowerCase().includes('writing')) {
      return [
        `Write clear and coherent sentences about ${title.toLowerCase()}`,
        `Use appropriate vocabulary when writing`,
        `Demonstrate proper sentence structure`
      ].join('; ');
    }

    return baseObjectives.join('; ');
  };

  const generateDidacticMaterials = (subject: string, level: PrimaryLevel, africanExamples: string[]): string[] => {
    const commonMaterials = [
      'Picture cards',
      'Whiteboard/Chalkboard',
      'Worksheets',
      'Visual aids'
    ];

    if (subject.toLowerCase().includes('language') || subject.toLowerCase().includes('français')) {
      return [
        'Picture cards of African families',
        'Greeting phrase strips',
        'Puppets',
        'Calabash drum',
        'Mirror',
        'Role badges',
        'Dialogue cards'
      ];
    } else if (subject.toLowerCase().includes('science') || subject.toLowerCase().includes('sciences')) {
      return [
        'Laboratory materials',
        'Magnifying glass',
        'Charts and diagrams',
        'Natural objects from local environment',
        'Measuring tools'
      ];
    } else if (subject.toLowerCase().includes('mathematics') || subject.toLowerCase().includes('mathématiques')) {
      return [
        'Number cards',
        'Counting beads',
        'Geometric shapes',
        'Calculator',
        'Measuring tools'
      ];
    }

    return commonMaterials;
  };

  const generateReferences = (subject: string, level: PrimaryLevel): string[] => {
    return [
      'Early Years Language Framework',
      'Oral Routine Booklet - Level 1',
      'Cameroonian Primary Curriculum',
      'Competence-Based Approach Guide'
    ];
  };

  // Francophone helper functions
  const generateCompetenceVisee = (title: string, subject: string, level: PrimaryLevel): string => {
    return `Utiliser les notions de base en ${subject.toLowerCase()}`;
  };

  const generateCompetenceADevelopper = (title: string, subject: string, level: PrimaryLevel): string => {
    return `Résoudre les problèmes de la vie courante faisant intervenir ${title.toLowerCase()}`;
  };

  const generateOPO = (title: string, subject: string, level: PrimaryLevel): string => {
    return `À partir d'un exercice de la vie courante faisant intervenir ${title.toLowerCase()}, à la fin de la leçon, l'élève sera capable de :`;
  };

  const generateOPR = (title: string, subject: string, level: PrimaryLevel): string => {
    return `L'élève sera capable de résoudre des problèmes simples liés à ${title.toLowerCase()}`;
  };

  const generateAnglophoneLessonStages = (title: string, subject: string, level: PrimaryLevel, domain: string, competenceActivities: string[], projectSuggestions: string[]): AnglophoneLessonStage[] => {
    const stages: AnglophoneLessonStage[] = [];

    // Introduction Stage
    stages.push({
      stage: 'INTRODUCTION',
      content: `Think about ${title.toLowerCase()}. What do you already know about this topic? Share your ideas with the person next to you. Raise your hand if you can give an example related to ${title.toLowerCase()}.`,
      facilitatingActivities: `Use visual aids, real objects, or pictures related to ${title.toLowerCase()}; encourage students to share prior knowledge; create a mind map of their ideas.`,
      learningActivities: `Students share what they know about ${title.toLowerCase()}; participate in class discussion; contribute to the mind map or concept web.`,
      resources: `Visual aids, real objects, pictures, mind map materials, whiteboard`
    });

    // Presentation Stage
    stages.push({
      stage: 'PRESENTATION',
      content: `Let's learn more about ${title.toLowerCase()}. Look at these examples and listen carefully. What patterns do you notice? How does this relate to what we discussed earlier?`,
      facilitatingActivities: `Present new concepts using multiple examples; use visual and auditory aids; demonstrate key concepts; check for understanding through questioning.`,
      learningActivities: `Listen and observe carefully; identify patterns and relationships; ask questions; take notes on key points.`,
      resources: `Textbooks, visual aids, audio materials, examples, demonstration materials`
    });

    // Application Stage
    stages.push({
      stage: 'APPLICATION',
      content: `Now let's practice what we've learned about ${title.toLowerCase()}. Work with your partner to complete these activities. Try to use the new concepts in different situations.`,
      facilitatingActivities: `Provide guided practice activities; monitor student work; offer support and feedback; facilitate peer collaboration.`,
      learningActivities: `Complete practice exercises; work collaboratively with peers; apply new knowledge in different contexts; seek help when needed.`,
      resources: `Practice worksheets, activity materials, reference charts, peer collaboration tools`
    });

    return stages;
  };

  const generateFrancophoneLessonStages = (title: string, subject: string, level: PrimaryLevel, domaine: string, competenceActivities: string[], projectSuggestions: string[]): FrancophoneLessonStage[] => {
    const stages: FrancophoneLessonStage[] = [];

    // Standard francophone stages
    const standardStages = [
      'Révision',
      'Introduction et motivation',
      'Découverte',
      'Analyse',
      'Confrontation',
      'Consolidation',
      'Synthèse',
      'Evaluation'
    ];

    standardStages.forEach((etape, index) => {
      stages.push({
        etape: etape,
        opi: `OPI ${index + 1}: ${generateOPIForStage(etape, title, subject)}`,
        activitesEnseignant: generateTeacherActivities(etape, title, subject, level),
        activitesEleve: generateStudentActivities(etape, title, subject, level),
        materiel: generateMaterials(etape, subject, level),
        duree: generateDurationForStage(etape, level),
        modeRegroupement: generateGroupingMode(etape)
      });
    });

    return stages;
  };

  const generateOPIForStage = (etape: string, title: string, subject: string): string => {
    const opiMap: { [key: string]: string } = {
      'Révision': `Réviser les notions précédentes liées à ${title.toLowerCase()}`,
      'Introduction et motivation': `Introduire le nouveau concept de ${title.toLowerCase()}`,
      'Découverte': `Découvrir les éléments de ${title.toLowerCase()}`,
      'Analyse': `Analyser les composantes de ${title.toLowerCase()}`,
      'Confrontation': `Confronter les idées sur ${title.toLowerCase()}`,
      'Consolidation': `Consolider les acquis sur ${title.toLowerCase()}`,
      'Synthèse': `Synthétiser les connaissances sur ${title.toLowerCase()}`,
      'Evaluation': `Évaluer la compréhension de ${title.toLowerCase()}`
    };
    return opiMap[etape] || `Traiter l'étape ${etape.toLowerCase()}`;
  };

  const generateTeacherActivities = (etape: string, title: string, subject: string, level: PrimaryLevel): string => {
    return `L'enseignant guide les élèves dans l'étape ${etape.toLowerCase()} en utilisant des méthodes appropriées pour ${title.toLowerCase()}`;
  };

  const generateStudentActivities = (etape: string, title: string, subject: string, level: PrimaryLevel): string => {
    return `Les élèves participent activement à l'étape ${etape.toLowerCase()} en travaillant sur ${title.toLowerCase()}`;
  };

  const generateMaterials = (etape: string, subject: string, level: PrimaryLevel): string => {
    return `Matériel pédagogique adapté pour ${subject.toLowerCase()}`;
  };

  const generateDurationForStage = (etape: string, level: PrimaryLevel): string => {
    const durationMap: { [key: string]: string } = {
      'Révision': '5 min',
      'Introduction et motivation': '5 min',
      'Découverte': '10 min',
      'Analyse': '10 min',
      'Confrontation': '5 min',
      'Consolidation': '5 min',
      'Synthèse': '3 min',
      'Evaluation': '2 min'
    };
    return durationMap[etape] || '5 min';
  };

  const generateGroupingMode = (etape: string): string => {
    const groupingMap: { [key: string]: string } = {
      'Révision': 'Classe entière',
      'Introduction et motivation': 'Classe entière',
      'Découverte': 'Travail individuel',
      'Analyse': 'Travail en groupe',
      'Confrontation': 'Classe entière',
      'Consolidation': 'Travail en binôme',
      'Synthèse': 'Classe entière',
      'Evaluation': 'Travail individuel'
    };
    return groupingMap[etape] || 'Classe entière';
  };

  const generateEvaluation = (title: string, subject: string, level: PrimaryLevel): string => {
    return `Choose one person from the greeting chart and greet them respectfully. Speak clearly, use gesture, and let the class decide if it was polite and correct.`;
  };

  const generateHomework = (title: string, subject: string, level: PrimaryLevel): string => {
    return `Practice greeting family members at home using polite words and gestures. Draw a picture of yourself greeting someone and write one greeting phrase.`;
  };

  const generateNotes = (title: string, subject: string, level: PrimaryLevel): string => {
    return `Key points to emphasize: Understanding of ${title.toLowerCase()}, practical applications, and student engagement. Focus on respectful communication and cultural values.`;
  };

  const handleSave = () => {
    if (generatedPlan) {
      onSave(generatedPlan);
      toast.success(language === 'en' ? 'Lesson plan saved successfully!' : 'Plan de leçon sauvegardé avec succès!');
      onClose();
    }
  };

  const updatePlan = (field: keyof CameroonianLessonPlan, value: any) => {
    if (generatedPlan) {
      setGeneratedPlan({
        ...generatedPlan,
        [field]: value,
        updatedAt: new Date()
      });
    }
  };

  const updateStage = (index: number, field: string, value: string) => {
    if (generatedPlan) {
      const newStages = [...generatedPlan.stages];
      newStages[index] = {
        ...newStages[index],
        [field]: value
      };
      updatePlan('stages', newStages);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'en' ? 'Auto Lesson Plan Generator' : 'Générateur Automatique de Plan de Leçon'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {!generatedPlan ? (
            /* Generation Form */
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  {language === 'en' 
                    ? 'Fill in the lesson details to automatically generate a complete Cameroonian lesson plan format.'
                    : 'Remplissez les détails de la leçon pour générer automatiquement un format de plan de leçon camerounais complet.'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'School System' : 'Système Scolaire'}
                  </label>
                  <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                    {selectedSystem === 'anglophone' ? 'Anglophone' : 'Francophone'}
                    <span className="text-sm text-gray-500 ml-2">
                      ({language === 'en' ? 'Auto-detected from your school' : 'Détecté automatiquement depuis votre école'})
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Class Level' : 'Niveau de Classe'}
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value as PrimaryLevel)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Select class level"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>
                        {getClassDisplayName(level, selectedSystem)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Subject' : 'Matière'}
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Select subject"
                  >
                    <option value="">{language === 'en' ? 'Select Subject' : 'Sélectionner une Matière'}</option>
                    {subjects.map(subject => (
                      <option key={subject.code} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Duration (minutes)' : 'Durée (minutes)'}
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="20"
                    max="120"
                  />
                </div>
              </div>

              {/* Conditional fields based on system */}
              {selectedSystem === 'anglophone' ? (
                /* Anglophone Fields */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Integrated' : 'Intégré'} *
                    </label>
                    <input
                      type="text"
                      value={integrated}
                      onChange={(e) => setIntegrated(e.target.value)}
                      placeholder={language === 'en' ? 'Enter integrated subject' : 'Entrez la matière intégrée'}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Learning Theme' : 'Thème d\'Apprentissage'} *
                    </label>
                    <select
                      value={learningTheme}
                      onChange={(e) => setLearningTheme(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Select learning theme"
                    >
                      <option value="">{language === 'en' ? 'Select Theme' : 'Sélectionner un Thème'}</option>
                      {learningThemes.map(theme => (
                        <option key={theme} value={theme}>
                          {theme}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Domain' : 'Domaine'} *
                    </label>
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Select domain"
                    >
                      <option value="">{language === 'en' ? 'Select Domain' : 'Sélectionner un Domaine'}</option>
                      {domains.map(domain => (
                        <option key={domain} value={domain}>
                          {domain}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Lesson Title' : 'Titre de la Leçon'} *
                    </label>
                    <input
                      type="text"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      placeholder={language === 'en' ? 'Enter lesson title' : 'Entrez le titre de la leçon'}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Enrolment' : 'Effectif'}
                    </label>
                    <input
                      type="number"
                      value={enrolment}
                      onChange={(e) => setEnrolment(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Time' : 'Heure'}
                    </label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder={language === 'en' ? 'e.g., 8:00 AM' : 'ex: 8h00'}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Entry Behaviour' : 'Comportement d\'Entrée'}
                    </label>
                    <textarea
                      value={entryBehaviour}
                      onChange={(e) => setEntryBehaviour(e.target.value)}
                      placeholder={language === 'en' ? 'Enter entry behaviour' : 'Entrez le comportement d\'entrée'}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Specific Objectives' : 'Objectifs Spécifiques'}
                    </label>
                    <textarea
                      value={specificObjectives}
                      onChange={(e) => setSpecificObjectives(e.target.value)}
                      placeholder={language === 'en' ? 'Enter specific objectives' : 'Entrez les objectifs spécifiques'}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Didactic Materials' : 'Matériels Didactiques'}
                    </label>
                    <textarea
                      value={didacticMaterials}
                      onChange={(e) => setDidacticMaterials(e.target.value)}
                      placeholder={language === 'en' ? 'Enter didactic materials' : 'Entrez les matériels didactiques'}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'References' : 'Références'}
                    </label>
                    <textarea
                      value={references}
                      onChange={(e) => setReferences(e.target.value)}
                      placeholder={language === 'en' ? 'Enter references' : 'Entrez les références'}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                /* Francophone Fields */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Centre d'intérêt *
                      </label>
                    <select
                      value={centreInteret}
                      onChange={(e) => setCentreInteret(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Select centre d'intérêt"
                    >
                      <option value="">Sélectionner un centre d'intérêt</option>
                      {centresInteret.map(centre => (
                        <option key={centre} value={centre}>
                          {centre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domaine *
                    </label>
                    <select
                      value={domaine}
                      onChange={(e) => setDomaine(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Select domaine"
                    >
                      <option value="">Sélectionner un domaine</option>
                      {domaines.map(dom => (
                        <option key={dom} value={dom}>
                          {dom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discipline *
                    </label>
                    <select
                      value={discipline}
                      onChange={(e) => setDiscipline(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Select discipline"
                    >
                      <option value="">Sélectionner une discipline</option>
                      {disciplines.map(disp => (
                        <option key={disp} value={disp}>
                          {disp}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sous-discipline
                    </label>
                    <input
                      type="text"
                      value={sousDiscipline}
                      onChange={(e) => setSousDiscipline(e.target.value)}
                      placeholder="Entrez la sous-discipline"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      value={titre}
                      onChange={(e) => setTitre(e.target.value)}
                      placeholder="Entrez le titre de la leçon"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau
                    </label>
                    <input
                      type="text"
                      value={niveau}
                      onChange={(e) => setNiveau(e.target.value)}
                      placeholder="Entrez le niveau"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Classe
                    </label>
                    <input
                      type="text"
                      value={classe}
                      onChange={(e) => setClasse(e.target.value)}
                      placeholder="Entrez la classe"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Effectif
                    </label>
                    <input
                      type="number"
                      value={effectif}
                      onChange={(e) => setEffectif(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compétence visée
                    </label>
                    <textarea
                      value={competenceVisee}
                      onChange={(e) => setCompetenceVisee(e.target.value)}
                      placeholder="Entrez la compétence visée"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compétence à faire développer
                    </label>
                    <textarea
                      value={competenceADevelopper}
                      onChange={(e) => setCompetenceADevelopper(e.target.value)}
                      placeholder="Entrez la compétence à faire développer"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      O.P.O.
                    </label>
                    <textarea
                      value={opo}
                      onChange={(e) => setOpo(e.target.value)}
                      placeholder="Entrez les objectifs pédagogiques opérationnels"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      O.P.R.
                    </label>
                    <textarea
                      value={opr}
                      onChange={(e) => setOpr(e.target.value)}
                      placeholder="Entrez les objectifs pédagogiques de référence"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={generateLessonPlan}
                  disabled={isGenerating || !selectedSubject || (selectedSystem === 'anglophone' ? (!lessonTitle.trim() || !learningTheme || !domain || !integrated.trim()) : (!titre.trim() || !domaine || !discipline || !centreInteret.trim()))}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  title={language === 'en' 
                    ? 'Fill in all required fields to generate lesson plan' 
                    : 'Remplissez tous les champs requis pour générer le plan de leçon'}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {language === 'en' ? 'Generating...' : 'Génération...'}
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 mr-2" />
                      {language === 'en' ? 'Generate Lesson Plan' : 'Générer le Plan de Leçon'}
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Generated Lesson Plan Editor */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'en' ? 'Generated Lesson Plan' : 'Plan de Leçon Généré'}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {isEditing ? (language === 'en' ? 'View' : 'Voir') : (language === 'en' ? 'Edit' : 'Modifier')}
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {language === 'en' ? 'Save' : 'Sauvegarder'}
                  </button>
                </div>
              </div>

              {/* Lesson Plan Header */}
              <div className="bg-blue-50 p-4 rounded-lg">
                {generatedPlan.system === 'anglophone' ? (
                  <h2 className="text-center text-xl font-bold text-blue-900 mb-4">
                    INDIVIDUAL LESSON PLAN ON {generatedPlan.subject.toUpperCase()} FOR {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                  </h2>
                ) : (
                  <h2 className="text-center text-xl font-bold text-blue-900 mb-4">
                    {generatedPlan.discipline.toUpperCase()}
                  </h2>
                )}
                
                {generatedPlan.system === 'anglophone' ? (
                  /* Anglophone Content */
                  <div className="grid grid-cols-2 gap-8">
                    {/* Left Side */}
                    <div className="space-y-4">
                      <div>
                        <span className="font-semibold">INTEGRATED</span>
                        <div className="border-b border-gray-300 h-6"></div>
                        <span className="text-sm text-gray-600">{generatedPlan.integrated}</span>
                      </div>
                      <div>
                        <span className="font-semibold">LEARNING THEME</span>
                        <div className="border-b border-gray-300 h-6"></div>
                        <span className="text-sm text-gray-600">{generatedPlan.learningTheme}</span>
                      </div>
                      <div>
                        <span className="font-semibold">DOMAIN</span>
                        <div className="border-b border-gray-300 h-6"></div>
                        <span className="text-sm text-gray-600">{generatedPlan.domain}</span>
                      </div>
                      <div>
                        <span className="font-semibold">LESSON TITLE:</span>
                        <div className="border-b border-gray-300 h-6"></div>
                        <span className="text-sm text-gray-600">{generatedPlan.lessonTitle}</span>
                      </div>
                      <div>
                        <span className="font-semibold">ENTRY BEHAVIOUR:</span>
                        <div className="border-b border-gray-300 h-6"></div>
                        <span className="text-sm text-gray-600">{generatedPlan.entryBehaviour}</span>
                      </div>
                      <div>
                        <span className="font-semibold">SPECIFIC OBJECTIVES</span>
                        <div className="border-b border-gray-300 h-6"></div>
                        <span className="text-sm text-gray-600">{generatedPlan.specificObjectives}</span>
                      </div>
                      <div>
                        <span className="font-semibold">DIDACTIC MATERIALS</span>
                        <div className="border-b border-gray-300 h-6"></div>
                        <span className="text-sm text-gray-600">{generatedPlan.didacticMaterials}</span>
                      </div>
                      <div>
                        <span className="font-semibold">REFERENCES</span>
                        <div className="border-b border-gray-300 h-6"></div>
                        <span className="text-sm text-gray-600">{generatedPlan.references}</span>
                      </div>
                    </div>
                    
                    {/* Right Side */}
                    <div className="space-y-4">
                      <div>
                        <span className="font-semibold underline">CLASS:</span>
                        <div className="border-b border-gray-300 h-6"></div>
                        <span className="text-sm text-gray-600">{generatedPlan.class}</span>
                      </div>
                      <div>
                        <span className="font-semibold underline">ENROLMENT:</span>
                        <div className="border-b border-gray-300 h-6"></div>
                        <span className="text-sm text-gray-600">{generatedPlan.enrolment}</span>
                      </div>
                      <div>
                        <span className="font-semibold underline">TIME:</span>
                        <div className="border-b border-gray-300 h-6"></div>
                        <span className="text-sm text-gray-600">{generatedPlan.time}</span>
                      </div>
                      <div>
                        <span className="font-semibold underline">DURATION:</span>
                        <div className="border-b border-gray-300 h-6"></div>
                        <span className="text-sm text-gray-600">{generatedPlan.duration} minutes</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Francophone Content */
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold">Centre d'intérêt :</span>
                        <span className="ml-2 text-sm text-gray-600">{generatedPlan.centreInteret}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Domaine :</span>
                        <span className="ml-2 text-sm text-gray-600">{generatedPlan.domaine}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Discipline :</span>
                        <span className="ml-2 text-sm text-gray-600">{generatedPlan.discipline}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Sous-discipline :</span>
                        <span className="ml-2 text-sm text-gray-600">{generatedPlan.sousDiscipline}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Titre :</span>
                        <span className="ml-2 text-sm text-gray-600">{generatedPlan.titre}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Durée :</span>
                        <span className="ml-2 text-sm text-gray-600">{generatedPlan.duree} minutes</span>
                      </div>
                      <div>
                        <span className="font-semibold">Niveau :</span>
                        <span className="ml-2 text-sm text-gray-600">{generatedPlan.niveau}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Classe :</span>
                        <span className="ml-2 text-sm text-gray-600">{generatedPlan.classe}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Effectif :</span>
                        <span className="ml-2 text-sm text-gray-600">{generatedPlan.effectif}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold">Compétence visée :</span>
                        <span className="ml-2 text-sm text-gray-600">{generatedPlan.competenceVisee}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Compétence à faire développer :</span>
                        <span className="ml-2 text-sm text-gray-600">{generatedPlan.competenceADevelopper}</span>
                      </div>
                      <div>
                        <span className="font-semibold">O.P.O. :</span>
                        <span className="ml-2 text-sm text-gray-600">{generatedPlan.opo}</span>
                      </div>
                      <div>
                        <span className="font-semibold">O.P.R. :</span>
                        <span className="ml-2 text-sm text-gray-600">{generatedPlan.opr}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>


              {/* Lesson Stages Table */}
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  {generatedPlan.system === 'anglophone' ? 'LESSON STAGES' : 'Progression'}
                </h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      {generatedPlan.system === 'anglophone' ? (
                        <>
                          <th className="border border-gray-300 p-2 text-left font-semibold">STAGES</th>
                          <th className="border border-gray-300 p-2 text-left font-semibold">CONTENT</th>
                          <th className="border border-gray-300 p-2 text-left font-semibold">FACILITATING ACTIVITIES</th>
                          <th className="border border-gray-300 p-2 text-left font-semibold">LEARNING ACTIVITIES</th>
                          <th className="border border-gray-300 p-2 text-left font-semibold">RESOURCES</th>
                        </>
                      ) : (
                        <>
                          <th className="border border-gray-300 p-2 text-left font-semibold">Etapes</th>
                          <th className="border border-gray-300 p-2 text-left font-semibold">OPI</th>
                          <th className="border border-gray-300 p-2 text-left font-semibold">Activités de l'enseignant</th>
                          <th className="border border-gray-300 p-2 text-left font-semibold">Activités de l'élève</th>
                          <th className="border border-gray-300 p-2 text-left font-semibold">Matériel</th>
                          <th className="border border-gray-300 p-2 text-left font-semibold">Durée</th>
                          <th className="border border-gray-300 p-2 text-left font-semibold">Mode de regroupement</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {generatedPlan.stages.map((stage, index) => (
                      <tr key={index} className={generatedPlan.system === 'anglophone' ? 
                        ((stage as AnglophoneLessonStage).stage.includes('INTRODUCTION') || (stage as AnglophoneLessonStage).stage.includes('PRESENTATION') || (stage as AnglophoneLessonStage).stage.includes('APPLICATION') ? 'bg-blue-50' : '') :
                        ((stage as FrancophoneLessonStage).etape.includes('Révision') || (stage as FrancophoneLessonStage).etape.includes('Introduction') || (stage as FrancophoneLessonStage).etape.includes('Découverte') || (stage as FrancophoneLessonStage).etape.includes('Analyse') || (stage as FrancophoneLessonStage).etape.includes('Confrontation') || (stage as FrancophoneLessonStage).etape.includes('Consolidation') || (stage as FrancophoneLessonStage).etape.includes('Synthèse') || (stage as FrancophoneLessonStage).etape.includes('Evaluation') ? 'bg-blue-50' : '')
                      }>
                        {generatedPlan.system === 'anglophone' ? (
                          <>
                            <td className="border border-gray-300 p-2 font-semibold">
                              {(stage as AnglophoneLessonStage).stage.includes('INTRODUCTION') || (stage as AnglophoneLessonStage).stage.includes('PRESENTATION') || (stage as AnglophoneLessonStage).stage.includes('APPLICATION') ? (
                                <span className="font-bold">{(stage as AnglophoneLessonStage).stage}</span>
                              ) : (
                                (stage as AnglophoneLessonStage).stage
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {isEditing ? (
                                <textarea
                                  value={(stage as AnglophoneLessonStage).content}
                                  onChange={(e) => updateStage(index, 'content', e.target.value)}
                                  className="w-full p-1 border border-gray-300 rounded text-sm"
                                  rows={3}
                                />
                              ) : (
                                (stage as AnglophoneLessonStage).content
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {isEditing ? (
                                <textarea
                                  value={(stage as AnglophoneLessonStage).facilitatingActivities}
                                  onChange={(e) => updateStage(index, 'facilitatingActivities', e.target.value)}
                                  className="w-full p-1 border border-gray-300 rounded text-sm"
                                  rows={3}
                                />
                              ) : (
                                (stage as AnglophoneLessonStage).facilitatingActivities
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {isEditing ? (
                                <textarea
                                  value={(stage as AnglophoneLessonStage).learningActivities}
                                  onChange={(e) => updateStage(index, 'learningActivities', e.target.value)}
                                  className="w-full p-1 border border-gray-300 rounded text-sm"
                                  rows={3}
                                />
                              ) : (
                                (stage as AnglophoneLessonStage).learningActivities
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={(stage as AnglophoneLessonStage).resources}
                                  onChange={(e) => updateStage(index, 'resources', e.target.value)}
                                  className="w-full p-1 border border-gray-300 rounded text-sm"
                                />
                              ) : (
                                (stage as AnglophoneLessonStage).resources
                              )}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="border border-gray-300 p-2 font-semibold">
                              {(stage as FrancophoneLessonStage).etape.includes('Révision') || (stage as FrancophoneLessonStage).etape.includes('Introduction') || (stage as FrancophoneLessonStage).etape.includes('Découverte') || (stage as FrancophoneLessonStage).etape.includes('Analyse') || (stage as FrancophoneLessonStage).etape.includes('Confrontation') || (stage as FrancophoneLessonStage).etape.includes('Consolidation') || (stage as FrancophoneLessonStage).etape.includes('Synthèse') || (stage as FrancophoneLessonStage).etape.includes('Evaluation') ? (
                                <span className="font-bold">{(stage as FrancophoneLessonStage).etape}</span>
                              ) : (
                                (stage as FrancophoneLessonStage).etape
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {isEditing ? (
                                <textarea
                                  value={(stage as FrancophoneLessonStage).opi}
                                  onChange={(e) => updateStage(index, 'opi', e.target.value)}
                                  className="w-full p-1 border border-gray-300 rounded text-sm"
                                  rows={3}
                                />
                              ) : (
                                (stage as FrancophoneLessonStage).opi
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {isEditing ? (
                                <textarea
                                  value={(stage as FrancophoneLessonStage).activitesEnseignant}
                                  onChange={(e) => updateStage(index, 'activitesEnseignant', e.target.value)}
                                  className="w-full p-1 border border-gray-300 rounded text-sm"
                                  rows={3}
                                />
                              ) : (
                                (stage as FrancophoneLessonStage).activitesEnseignant
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {isEditing ? (
                                <textarea
                                  value={(stage as FrancophoneLessonStage).activitesEleve}
                                  onChange={(e) => updateStage(index, 'activitesEleve', e.target.value)}
                                  className="w-full p-1 border border-gray-300 rounded text-sm"
                                  rows={3}
                                />
                              ) : (
                                (stage as FrancophoneLessonStage).activitesEleve
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {isEditing ? (
                                <textarea
                                  value={(stage as FrancophoneLessonStage).materiel}
                                  onChange={(e) => updateStage(index, 'materiel', e.target.value)}
                                  className="w-full p-1 border border-gray-300 rounded text-sm"
                                  rows={3}
                                />
                              ) : (
                                (stage as FrancophoneLessonStage).materiel
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={(stage as FrancophoneLessonStage).duree}
                                  onChange={(e) => updateStage(index, 'duree', e.target.value)}
                                  className="w-full p-1 border border-gray-300 rounded text-sm"
                                />
                              ) : (
                                (stage as FrancophoneLessonStage).duree
                              )}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={(stage as FrancophoneLessonStage).modeRegroupement}
                                  onChange={(e) => updateStage(index, 'modeRegroupement', e.target.value)}
                                  className="w-full p-1 border border-gray-300 rounded text-sm"
                                />
                              ) : (
                                (stage as FrancophoneLessonStage).modeRegroupement
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoLessonPlanGenerator;