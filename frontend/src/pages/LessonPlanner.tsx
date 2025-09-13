import React, { useState, useRef } from 'react';
import { Plus, Trash2, Save, Eye, Clock, BookOpen, Target, Users, Calendar, User, FileText, Upload, Download, ArrowLeft, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AutoLessonPlanGenerator from '../components/AutoLessonPlanGenerator';

interface LearningObjective {
  id: string;
  description: string;
  completed: boolean;
  selected?: boolean;
}

interface Material {
  id: string;
  name: string;
  selected?: boolean;
}

interface Activity {
  id: string;
  description: string;
}

interface LessonStage {
  id: string;
  stage: string;
  content: string;
  facilitatingActivities: string;
  learningActivities: string;
  resources: string;
}

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  class: string;
  date: string;
  time: string;
  duration: string;
  learningTheme: string;
  selectedObjective: string;
  domain: string;
  entryBehaviour: string;
  objectives: LearningObjective[];
  materials: Material[];
  activities: Activity[];
  stages: LessonStage[];
  assessmentMethod: string;
  references: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SchemeOfWork {
  id: string;
  title: string;
  subject: string;
  class: string;
  term: string;
  objectives: LearningObjective[];
  materials: Material[];
  createdAt: Date;
}

interface LessonTableRow {
  id: string;
  domain: string;
  lessonTitle: string;
  activitiesAndExamples: string;
  assessmentTools: string;
  assessmentStrategy: string;
  teachingResources: string;
}

interface WeeklyScheme {
  weekNumber: number;
  weekTitle: string;
  coreCompetency: string;
  grammarFocus: string;
  miniProjectComponent: string;
  phonicsFocus: string;
  lessons: LessonTableRow[];
}

interface ImportedScheme {
  id: string;
  title: string;
  subject: string;
  class: string;
  term: string;
  objectives: LearningObjective[];
  materials: Material[];
  weeklySchemes?: WeeklyScheme[];
}

// Learning themes by class level
const learningThemes = {
  '1': ['The home', 'The Village/Town', 'The School', 'Occupations', 'Travelling', 'Health', 'Games and Communication'],
  '2': ['The home', 'The Village/Town', 'The School', 'Occupations', 'Travelling', 'Health', 'Games and Communication'],
  '3': ['The home', 'The Village/Town', 'The School', 'Occupations', 'Travelling', 'Health', 'Games and Communication'],
  '4': ['The home', 'The Village/Town', 'The School', 'Occupations', 'Travelling', 'Health', 'Games and Communication'],
  '5': ['Nature', 'The Village/Town', 'The School', 'Occupations', 'Travelling', 'Health', 'Games', 'The Universe and Space'],
  '6': ['Nature', 'The Village/Town', 'The School', 'Occupations', 'Travelling', 'Health', 'Games', 'The Universe and Space']
};

// Predefined stage names
const stageNames = [
  'Introduction',
  'Presentation',
  'Practice',
  'Application',
  'Evaluation',
  'Consolidation',
  'Review',
  'Warm-up',
  'Main Activity',
  'Cool-down',
  'Assessment',
  'Reflection',
  'Discussion',
  'Demonstration',
  'Guided Practice',
  'Independent Practice',
  'Group Work',
  'Individual Work',
  'Whole Class Activity',
  'Small Group Activity'
];

// Predefined resources
const resourceOptions = [
  'Textbooks',
  'Workbooks',
  'Whiteboard',
  'Charts',
  'Posters',
  'Flashcards',
  'Audio recordings',
  'Video clips',
  'Pictures',
  'Real objects',
  'Manipulatives',
  'Worksheets',
  'Handouts',
  'Digital devices',
  'Projector',
  'Computer',
  'Tablet',
  'Internet resources',
  'Games',
  'Art supplies',
  'Music instruments',
  'Sports equipment',
  'Science materials',
  'Measuring tools',
  'Writing materials',
  'Reading books',
  'Story books',
  'Reference books',
  'Dictionaries',
  'Maps',
  'Globes',
  'Models',
  'Samples',
  'Specimens',
  'Laboratory equipment',
  'Safety equipment',
  'Timers',
  'Calendars',
  'Clocks',
  'Calculators',
  'Rulers',
  'Compasses',
  'Protractors',
  'Graph paper',
  'Construction paper',
  'Scissors',
  'Glue',
  'Tape',
  'Markers',
  'Crayons',
  'Pencils',
  'Pens',
  'Erasers',
  'Sharpeners',
  'Notebooks',
  'Folders',
  'Binders',
  'Staplers',
  'Paper clips',
  'Rubber bands',
  'String',
  'Rope',
  'Balls',
  'Blocks',
  'Puzzles',
  'Board games',
  'Card games',
  'Dice',
  'Counters',
  'Beads',
  'Buttons',
  'Coins',
  'Stamps',
  'Stickers',
  'Rewards',
  'Certificates',
  'Badges',
  'Prizes'
];

// Predefined assessment methods
const assessmentMethods = [
  'Oral Questioning',
  'Written Quiz',
  'Multiple Choice Test',
  'True/False Questions',
  'Fill in the Blanks',
  'Matching Exercise',
  'Short Answer Questions',
  'Essay Questions',
  'Practical Demonstration',
  'Group Presentation',
  'Individual Presentation',
  'Peer Assessment',
  'Self Assessment',
  'Portfolio Review',
  'Project Assessment',
  'Observation Checklist',
  'Performance Task',
  'Role Play',
  'Debate',
  'Discussion',
  'Interview',
  'Case Study Analysis',
  'Problem Solving Task',
  'Creative Writing',
  'Drawing/Artwork',
  'Model Making',
  'Experiment Report',
  'Field Trip Report',
  'Research Project',
  'Book Review',
  'Story Telling',
  'Drama Performance',
  'Music Performance',
  'Physical Activity',
  'Game-based Assessment',
  'Digital Presentation',
  'Video Recording',
  'Audio Recording',
  'Photo Documentation',
  'Reflection Journal',
  'Learning Log',
  'Exit Ticket',
  'Quick Check',
  'Thumbs Up/Down',
  'Traffic Light System',
  'Rating Scale',
  'Rubric Assessment',
  'Checklist',
  'Anecdotal Records',
  'Running Records',
  'Formative Assessment',
  'Summative Assessment',
  'Diagnostic Assessment',
  'Benchmark Assessment',
  'Standardized Test',
  'Teacher-made Test',
  'Open-ended Questions',
  'Closed-ended Questions',
  'Problem-based Learning',
  'Inquiry-based Assessment',
  'Collaborative Assessment',
  'Authentic Assessment',
  'Alternative Assessment'
];

const LessonPlanner: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lessonPlan, setLessonPlan] = useState<LessonPlan>({
    id: '',
    title: '',
    subject: '',
    class: '',
    date: '',
    time: '',
    duration: '',
    learningTheme: '',
    selectedObjective: '',
    domain: '',
    entryBehaviour: '',
    objectives: [],
    materials: [],
    activities: [],
    stages: [],
    assessmentMethod: '',
    references: '',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [newObjective, setNewObjective] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDetailedImportModal, setShowDetailedImportModal] = useState(false);
  const [importedSchemes, setImportedSchemes] = useState<ImportedScheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<ImportedScheme | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<WeeklyScheme | null>(null);
  const [selectedLessons, setSelectedLessons] = useState<LessonTableRow[]>([]);
  const [showAutoLessonPlanGenerator, setShowAutoLessonPlanGenerator] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof LessonPlan, value: string) => {
    setLessonPlan(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date()
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      const objective: LearningObjective = {
        id: Date.now().toString(),
        description: newObjective.trim(),
        completed: false
      };
      setLessonPlan(prev => ({
        ...prev,
        objectives: [...prev.objectives, objective],
        updatedAt: new Date()
      }));
      setNewObjective('');
      toast.success('Learning objective added!');
    }
  };

  const removeObjective = (id: string) => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== id),
      updatedAt: new Date()
    }));
    toast.success('Learning objective removed!');
  };

  const toggleObjective = (id: string) => {
    setLessonPlan(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj =>
        obj.id === id ? { ...obj, completed: !obj.completed } : obj
      ),
      updatedAt: new Date()
    }));
  };

  const selectObjective = (id: string) => {
    setLessonPlan(prev => ({
      ...prev,
      selectedObjective: id,
      objectives: prev.objectives.map(obj => ({
        ...obj,
        selected: obj.id === id
      })),
      updatedAt: new Date()
    }));
  };

  const toggleMaterialSelection = (id: string) => {
    setLessonPlan(prev => ({
      ...prev,
      materials: prev.materials.map(mat =>
        mat.id === id ? { ...mat, selected: !mat.selected } : mat
      ),
      updatedAt: new Date()
    }));
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      const material: Material = {
        id: Date.now().toString(),
        name: newMaterial.trim()
      };
      setLessonPlan(prev => ({
        ...prev,
        materials: [...prev.materials, material],
        updatedAt: new Date()
      }));
      setNewMaterial('');
      toast.success('Material added!');
    }
  };

  const removeMaterial = (id: string) => {
    setLessonPlan(prev => ({
      ...prev,
      materials: prev.materials.filter(mat => mat.id !== id),
      updatedAt: new Date()
    }));
    toast.success('Material removed!');
  };

  const addActivity = () => {
    if (newActivity.trim()) {
      const activity: Activity = {
        id: Date.now().toString(),
        description: newActivity.trim()
      };
      setLessonPlan(prev => ({
        ...prev,
        activities: [...prev.activities, activity],
        updatedAt: new Date()
      }));
      setNewActivity('');
      toast.success('Activity added!');
    }
  };

  const removeActivity = (id: string) => {
    setLessonPlan(prev => ({
      ...prev,
      activities: prev.activities.filter(act => act.id !== id),
      updatedAt: new Date()
    }));
    toast.success('Activity removed!');
  };

  const addStage = () => {
    const stage: LessonStage = {
      id: Date.now().toString(),
      stage: '',
      content: '',
      facilitatingActivities: '',
      learningActivities: '',
      resources: ''
    };
    setLessonPlan(prev => ({
      ...prev,
      stages: [...prev.stages, stage],
      updatedAt: new Date()
    }));
  };

  const updateStage = (id: string, field: keyof LessonStage, value: string) => {
    setLessonPlan(prev => ({
      ...prev,
      stages: prev.stages.map(stage =>
        stage.id === id ? { ...stage, [field]: value } : stage
      ),
      updatedAt: new Date()
    }));
  };

  const removeStage = (id: string) => {
    setLessonPlan(prev => ({
      ...prev,
      stages: prev.stages.filter(stage => stage.id !== id),
      updatedAt: new Date()
    }));
  };

  const saveLessonPlan = () => {
    if (!lessonPlan.title || !lessonPlan.subject || !lessonPlan.class) {
      toast.error('Please fill in all required fields');
      return;
    }

    const savedPlan = {
      ...lessonPlan,
      id: lessonPlan.id || Date.now().toString(),
      createdAt: lessonPlan.id ? lessonPlan.createdAt : new Date(),
      updatedAt: new Date()
    };

    setLessonPlan(savedPlan);
    toast.success('Lesson plan saved successfully!');
  };

  const previewLessonPlan = () => {
    if (!lessonPlan.title) {
      toast.error('Please add a lesson title to preview');
      return;
    }
    setShowPreview(true);
  };

  // Mock schemes of work for demonstration
  const mockSchemes: ImportedScheme[] = [
    {
      id: '1',
      title: 'English Language Term 1 - Class 1',
      subject: 'English',
      class: '1',
      term: 'Term 1',
      objectives: [
        { id: '1', description: 'Students will be able to greet others respectfully', completed: false },
        { id: '2', description: 'Students will recognize and pronounce basic letter sounds', completed: false },
        { id: '3', description: 'Students will identify objects in the home', completed: false }
      ],
      materials: [
        { id: '1', name: 'Greeting cards' },
        { id: '2', name: 'Alphabet charts' },
        { id: '3', name: 'Picture books' },
        { id: '4', name: 'Writing notebooks' }
      ],
      weeklySchemes: [
        {
          weekNumber: 1,
          weekTitle: 'Greetings, Letter Sounds and Objects in the Home',
          coreCompetency: 'Recognize and pronounce basic letter sounds; greet others respectfully',
          grammarFocus: 'Interjections; personal pronouns ("I", "you")',
          miniProjectComponent: 'Draw and label one object found in the home (e.g., mat, cup)',
          phonicsFocus: 'Initial sounds in monosyllabic words; identifying /b/, /m/, /s/, /d/',
          lessons: [
            {
              id: '1',
              domain: 'Listening and Speaking',
              lessonTitle: 'Saying hello at home',
              activitiesAndExamples: 'Greet peers and family using "Hello!", "Hi!", "Good morning"',
              assessmentTools: 'Oral greeting checklist',
              assessmentStrategy: 'Evaluate tone, pronunciation, and usage',
              teachingResources: 'Greeting cards, visual prompts'
            },
            {
              id: '2',
              domain: 'Reading',
              lessonTitle: 'Sounding out letter sounds',
              activitiesAndExamples: 'Identify and repeat /b/, /m/, /s/, /d/',
              assessmentTools: 'Sound recognition sheet',
              assessmentStrategy: 'Score phoneme clarity',
              teachingResources: 'Alphabet charts, phoneme posters'
            },
            {
              id: '3',
              domain: 'Writing',
              lessonTitle: 'Tracing strokes and letters',
              activitiesAndExamples: 'Trace curves, zigzag lines, and letters B, M, S, D',
              assessmentTools: 'Handwriting sheet',
              assessmentStrategy: 'Assess stroke control and form',
              teachingResources: 'Lined paper, tracing templates'
            },
            {
              id: '4',
              domain: 'Grammar, Vocab & Pron.',
              lessonTitle: 'Using interjections and pronouns',
              activitiesAndExamples: 'Say "Hi!" "Hello!" "I am happy." "You are kind."',
              assessmentTools: 'Pronoun rubric',
              assessmentStrategy: 'Score sentence form and accuracy',
              teachingResources: 'Role visuals, sentence starters'
            },
            {
              id: '5',
              domain: 'Phonics',
              lessonTitle: 'Initial sounds in home words',
              activitiesAndExamples: 'Identify first sounds: "mop", "mat", "bed"',
              assessmentTools: 'Sound isolation checklist',
              assessmentStrategy: 'Evaluate listening and phonemic awareness',
              teachingResources: 'Sound wall, object cards'
            },
            {
              id: '6',
              domain: 'Literature & Drama',
              lessonTitle: 'Rhyme: In My Little House',
              activitiesAndExamples: 'Perform a rhyme: "In my house, I find my mat / Where I sit and chat"',
              assessmentTools: 'Recitation rubric',
              assessmentStrategy: 'Score rhythm and pronunciation',
              teachingResources: 'Rhyme strips, beat props'
            },
            {
              id: '7',
              domain: 'Mini Project',
              lessonTitle: 'Drawing an object from home',
              activitiesAndExamples: 'Draw and label one home item (e.g., mat, cup) for project strip',
              assessmentTools: 'Project draft rubric',
              assessmentStrategy: 'Evaluate labeling and sound-letter match',
              teachingResources: 'Drawing sheet, label cards'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Mathematics Term 1 - Class 3',
      subject: 'Mathematics',
      class: '3',
      term: 'Term 1',
      objectives: [
        { id: '1', description: 'Students will be able to add and subtract numbers up to 100', completed: false },
        { id: '2', description: 'Students will understand place value concepts', completed: false },
        { id: '3', description: 'Students will solve word problems involving addition and subtraction', completed: false }
      ],
      materials: [
        { id: '1', name: 'Number cards 1-100' },
        { id: '2', name: 'Base ten blocks' },
        { id: '3', name: 'Whiteboard and markers' },
        { id: '4', name: 'Math workbooks' }
      ],
      weeklySchemes: [
        {
          weekNumber: 1,
          weekTitle: 'Number Recognition and Counting',
          coreCompetency: 'Count and recognize numbers 1-50',
          grammarFocus: 'Number words and counting patterns',
          miniProjectComponent: 'Create a number chart 1-20',
          phonicsFocus: 'Number word pronunciation',
          lessons: [
            {
              id: '1',
              domain: 'Number Recognition',
              lessonTitle: 'Counting 1-20',
              activitiesAndExamples: 'Count objects and write numbers 1-20',
              assessmentTools: 'Number recognition test',
              assessmentStrategy: 'Observe counting accuracy',
              teachingResources: 'Counting beads, number cards'
            },
            {
              id: '2',
              domain: 'Addition',
              lessonTitle: 'Simple addition within 10',
              activitiesAndExamples: 'Add single digit numbers using manipulatives',
              assessmentTools: 'Addition worksheet',
              assessmentStrategy: 'Check calculation accuracy',
              teachingResources: 'Counters, addition charts'
            }
          ]
        }
      ]
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const schemeData = JSON.parse(content);
        
        // Validate the imported data structure
        if (schemeData.title && schemeData.objectives && schemeData.materials) {
          const importedScheme: ImportedScheme = {
            id: Date.now().toString(),
            title: schemeData.title,
            subject: schemeData.subject || '',
            class: schemeData.class || '',
            term: schemeData.term || '',
            objectives: schemeData.objectives.map((obj: any, index: number) => ({
              id: `imported-${Date.now()}-${index}`,
              description: obj.description || obj,
              completed: false
            })),
            materials: schemeData.materials.map((mat: any, index: number) => ({
              id: `imported-${Date.now()}-${index}`,
              name: typeof mat === 'string' ? mat : mat.name
            }))
          };
          
          setImportedSchemes(prev => [...prev, importedScheme]);
          toast.success('Scheme of work imported successfully!');
        } else {
          toast.error('Invalid file format. Please check the file structure.');
        }
      } catch (error) {
        toast.error('Error reading file. Please ensure it\'s a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const importFromScheme = (scheme: ImportedScheme) => {
    setSelectedScheme(scheme);
    setShowImportModal(true);
  };

  const importDetailedFromScheme = (scheme: ImportedScheme) => {
    setSelectedScheme(scheme);
    setShowDetailedImportModal(true);
  };

  const selectWeek = (week: WeeklyScheme) => {
    setSelectedWeek(week);
    setSelectedLessons([]);
  };

  const toggleLessonSelection = (lesson: LessonTableRow) => {
    setSelectedLessons(prev => {
      const isSelected = prev.some(l => l.id === lesson.id);
      if (isSelected) {
        return prev.filter(l => l.id !== lesson.id);
      } else {
        return [...prev, lesson];
      }
    });
  };

  const confirmDetailedImport = () => {
    if (!selectedWeek || selectedLessons.length === 0) return;

    // Import selected lessons as lesson stages
    const newStages = selectedLessons.map(lesson => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      stage: lesson.domain,
      content: lesson.activitiesAndExamples,
      facilitatingActivities: lesson.assessmentStrategy,
      learningActivities: lesson.activitiesAndExamples,
      resources: lesson.teachingResources
    }));

    setLessonPlan(prev => ({
      ...prev,
      stages: [...prev.stages, ...newStages],
      updatedAt: new Date()
    }));

    // Import teaching resources as materials
    const newMaterials = selectedLessons.flatMap(lesson => 
      lesson.teachingResources.split(',').map(resource => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: resource.trim(),
        selected: false
      }))
    );

    setLessonPlan(prev => ({
      ...prev,
      materials: [...prev.materials, ...newMaterials],
      updatedAt: new Date()
    }));

    // Update lesson plan title and domain if not set
    if (!lessonPlan.title && selectedLessons.length > 0) {
      setLessonPlan(prev => ({
        ...prev,
        title: selectedLessons[0].lessonTitle,
        domain: selectedLessons[0].domain,
        updatedAt: new Date()
      }));
    }

    toast.success(`Imported ${selectedLessons.length} lessons from Week ${selectedWeek.weekNumber}!`);
    setShowDetailedImportModal(false);
    setSelectedScheme(null);
    setSelectedWeek(null);
    setSelectedLessons([]);
  };

  const confirmImport = (importObjectives: boolean, importMaterials: boolean) => {
    if (!selectedScheme) return;

    if (importObjectives && selectedScheme.objectives.length > 0) {
      const newObjectives = selectedScheme.objectives.map(obj => ({
        ...obj,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        selected: false
      }));
      setLessonPlan(prev => ({
        ...prev,
        objectives: [...prev.objectives, ...newObjectives],
        updatedAt: new Date()
      }));
      toast.success(`${selectedScheme.objectives.length} objectives imported!`);
    }

    if (importMaterials && selectedScheme.materials.length > 0) {
      const newMaterials = selectedScheme.materials.map(mat => ({
        ...mat,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        selected: false
      }));
      setLessonPlan(prev => ({
        ...prev,
        materials: [...prev.materials, ...newMaterials],
        updatedAt: new Date()
      }));
      toast.success(`${selectedScheme.materials.length} materials imported!`);
    }

    setShowImportModal(false);
    setSelectedScheme(null);
  };

  const exportSchemeTemplate = () => {
    const template = {
      title: "Sample Scheme of Work",
      subject: "Mathematics",
      class: "3",
      term: "Term 1",
      objectives: [
        "Students will be able to add and subtract numbers up to 100",
        "Students will understand place value concepts",
        "Students will solve word problems involving addition and subtraction"
      ],
      materials: [
        "Number cards 1-100",
        "Base ten blocks",
        "Whiteboard and markers",
        "Math workbooks"
      ]
    };

    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scheme-of-work-template.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lesson Plan Builder</h1>
            <p className="text-gray-600">Create comprehensive lesson plans with learning objectives and activities</p>
          </div>
          {(user?.role === 'super_admin' || user?.role === 'school_admin') && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Scheme of Work Import Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-600" />
            Import from Scheme of Work
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={exportSchemeTemplate}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
              title="Download template"
              aria-label="Download template"
            >
              <Download className="h-4 w-4 mr-2" />
              Template
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
              title="Upload scheme of work"
              aria-label="Upload scheme of work"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Mock Schemes */}
          {mockSchemes.map((scheme) => (
            <div key={scheme.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{scheme.title}</h3>
                  <p className="text-xs text-gray-500">{scheme.subject} - Class {scheme.class}</p>
                  <p className="text-xs text-gray-500">{scheme.term}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => importFromScheme(scheme)}
                    className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                    title="Import objectives and materials"
                    aria-label="Import objectives and materials"
                  >
                    Basic
                  </button>
                  {scheme.weeklySchemes && scheme.weeklySchemes.length > 0 && (
                    <button
                      onClick={() => importDetailedFromScheme(scheme)}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                      title="Import detailed lesson table"
                      aria-label="Import detailed lesson table"
                    >
                      Detailed
                    </button>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <p>{scheme.objectives.length} objectives</p>
                <p>{scheme.materials.length} materials</p>
                {scheme.weeklySchemes && scheme.weeklySchemes.length > 0 && (
                  <p>{scheme.weeklySchemes.length} weekly schemes</p>
                )}
              </div>
            </div>
          ))}

          {/* Imported Schemes */}
          {importedSchemes.map((scheme) => (
            <div key={scheme.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-green-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{scheme.title}</h3>
                  <p className="text-xs text-gray-500">{scheme.subject} - Class {scheme.class}</p>
                  <p className="text-xs text-gray-500">{scheme.term}</p>
                </div>
                <button
                  onClick={() => importFromScheme(scheme)}
                  className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                  title="Import from this scheme"
                  aria-label="Import from this scheme"
                >
                  Import
                </button>
              </div>
              <div className="text-xs text-gray-600">
                <p>{scheme.objectives.length} objectives</p>
                <p>{scheme.materials.length} materials</p>
              </div>
            </div>
          ))}
        </div>

        {importedSchemes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No imported schemes yet. Upload a JSON file or use the sample schemes above.</p>
          </div>
        )}
      </div>

      {!showPreview ? (
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Basic Information
              </h2>
              <button
                onClick={() => setShowAutoLessonPlanGenerator(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                title="Auto-generate lesson plan using AI"
                aria-label="Auto-generate lesson plan"
              >
                <Zap className="h-4 w-4 mr-2" />
                Auto-Generate
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  value={lessonPlan.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter lesson title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  value={lessonPlan.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Select subject"
                  title="Select subject"
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Science">Science</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Art">Art</option>
                  <option value="Music">Music</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Writing">Writing</option>
                  <option value="Spelling">Spelling</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Level *
                </label>
                <select
                  value={lessonPlan.class}
                  onChange={(e) => handleInputChange('class', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Select class level"
                  title="Select class level"
                >
                  <option value="">Select Class</option>
                  <option value="1">Class 1</option>
                  <option value="2">Class 2</option>
                  <option value="3">Class 3</option>
                  <option value="4">Class 4</option>
                  <option value="5">Class 5</option>
                  <option value="6">Class 6</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={lessonPlan.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={lessonPlan.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={lessonPlan.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 45 minutes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Learning Theme *
                </label>
                <select
                  value={lessonPlan.learningTheme}
                  onChange={(e) => handleInputChange('learningTheme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Select learning theme"
                  title="Select learning theme"
                >
                  <option value="">Select Learning Theme</option>
                  {lessonPlan.class && learningThemes[lessonPlan.class as keyof typeof learningThemes]?.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
                {!lessonPlan.class && (
                  <p className="text-xs text-gray-500 mt-1">
                    Please select a class level first to see available themes
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Domain
                </label>
                <input
                  type="text"
                  value={lessonPlan.domain}
                  onChange={(e) => handleInputChange('domain', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Listening and Speaking, Reading, Writing"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entry Behaviour
                </label>
                <textarea
                  value={lessonPlan.entryBehaviour}
                  onChange={(e) => handleInputChange('entryBehaviour', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe what learners already know or can do..."
                />
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Learning Objectives
            </h2>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Add a learning objective..."
                />
                <button
                  onClick={addObjective}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  title="Add learning objective"
                  aria-label="Add learning objective"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Objective Selection Dropdown */}
              {lessonPlan.objectives.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-3">
                    Select ONE objective for this lesson:
                  </h3>
                  <select
                    value={lessonPlan.selectedObjective}
                    onChange={(e) => selectObjective(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    aria-label="Select objective for this lesson"
                    title="Select objective for this lesson"
                  >
                    <option value="">Choose an objective...</option>
                    {lessonPlan.objectives.map((objective) => (
                      <option key={objective.id} value={objective.id}>
                        {objective.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                {lessonPlan.objectives.map((objective) => (
                  <div key={objective.id} className={`flex items-center space-x-2 p-3 rounded-md ${
                    objective.selected ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={objective.completed}
                      onChange={() => toggleObjective(objective.id)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className={`flex-1 ${objective.completed ? 'line-through text-gray-500' : ''} ${
                      objective.selected ? 'text-blue-900 font-medium' : ''
                    }`}>
                      {objective.description}
                      {objective.selected && (
                        <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                          SELECTED
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => removeObjective(objective.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove objective"
                      aria-label="Remove objective"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Materials Needed */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
              Materials Needed
            </h2>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Add a material..."
                />
                <button
                  onClick={addMaterial}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                  title="Add material"
                  aria-label="Add material"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Material Selection Instructions */}
              {lessonPlan.materials.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm text-purple-800">
                    <strong>Select materials that suit this lesson:</strong> Check the boxes for materials you'll use.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {lessonPlan.materials.map((material) => (
                  <div key={material.id} className={`flex items-center space-x-3 p-3 rounded-md ${
                    material.selected ? 'bg-purple-100 border border-purple-300' : 'bg-gray-50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={material.selected || false}
                      onChange={() => toggleMaterialSelection(material.id)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className={`flex-1 ${material.selected ? 'text-purple-900 font-medium' : 'text-gray-900'}`}>
                      {material.name}
                      {material.selected && (
                        <span className="ml-2 text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                          SELECTED
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => removeMaterial(material.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove material"
                      aria-label="Remove material"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lesson Stages */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600" />
                Lesson Stages
              </h2>
              <button
                onClick={addStage}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                title="Add lesson stage"
                aria-label="Add lesson stage"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stage
              </button>
            </div>

            <div className="space-y-6">
              {lessonPlan.stages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No lesson stages added yet. Click "Add Stage" to begin.</p>
                </div>
              ) : (
                lessonPlan.stages.map((stage, index) => (
                  <div key={stage.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Stage {index + 1}</h3>
                      <button
                        onClick={() => removeStage(stage.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove stage"
                        aria-label="Remove stage"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stage Name
                        </label>
                        <select
                          value={stage.stage}
                          onChange={(e) => updateStage(stage.id, 'stage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          aria-label="Select stage name"
                          title="Select stage name"
                        >
                          <option value="">Select Stage Name</option>
                          {stageNames.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Or type a custom stage name in the field below
                        </p>
                        <input
                          type="text"
                          value={stage.stage}
                          onChange={(e) => updateStage(stage.id, 'stage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mt-2"
                          placeholder="Custom stage name..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Resources
                        </label>
                        <div className="space-y-3">
                          {/* Dropdown Selection */}
                          <div>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  const currentResources = stage.resources ? stage.resources.split(', ') : [];
                                  const newResource = e.target.value;
                                  if (!currentResources.includes(newResource)) {
                                    const updatedResources = [...currentResources, newResource].join(', ');
                                    updateStage(stage.id, 'resources', updatedResources);
                                  }
                                  e.target.value = ''; // Reset selection
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              aria-label="Add resource from list"
                              title="Add resource from list"
                            >
                              <option value="">Select from predefined resources...</option>
                              {resourceOptions
                                .filter(resource => !stage.resources?.includes(resource))
                                .map((resource) => (
                                  <option key={resource} value={resource}>
                                    {resource}
                                  </option>
                                ))}
                            </select>
                          </div>

                          {/* Custom Resource Input */}
                          <div>
                            <input
                              type="text"
                              placeholder="Or type a custom resource..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const customResource = e.currentTarget.value.trim();
                                  if (customResource) {
                                    const currentResources = stage.resources ? stage.resources.split(', ') : [];
                                    if (!currentResources.includes(customResource)) {
                                      const updatedResources = [...currentResources, customResource].join(', ');
                                      updateStage(stage.id, 'resources', updatedResources);
                                    }
                                    e.currentTarget.value = ''; // Clear input
                                  }
                                }
                              }}
                              aria-label="Add custom resource"
                              title="Add custom resource"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Press Enter to add custom resource
                            </p>
                          </div>

                          {/* Selected Resources Display */}
                          <div className="text-xs text-gray-500">
                            <p className="font-medium">Selected resources:</p>
                            {stage.resources ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {stage.resources.split(', ').map((resource, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-md"
                                  >
                                    {resource}
                                    <button
                                      onClick={() => {
                                        const currentResources = stage.resources.split(', ');
                                        const updatedResources = currentResources
                                          .filter(r => r !== resource)
                                          .join(', ');
                                        updateStage(stage.id, 'resources', updatedResources);
                                      }}
                                      className="ml-1 text-orange-600 hover:text-orange-800"
                                      title="Remove resource"
                                      aria-label="Remove resource"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400">No resources selected</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content
                        </label>
                        <textarea
                          value={stage.content}
                          onChange={(e) => updateStage(stage.id, 'content', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows={3}
                          placeholder="Describe the content for this stage..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Facilitating Activities
                        </label>
                        <textarea
                          value={stage.facilitatingActivities}
                          onChange={(e) => updateStage(stage.id, 'facilitatingActivities', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows={3}
                          placeholder="What the teacher will do..."
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Learning Activities
                        </label>
                        <textarea
                          value={stage.learningActivities}
                          onChange={(e) => updateStage(stage.id, 'learningActivities', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows={3}
                          placeholder="What the learners will do..."
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assessment and References */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
              Assessment & References
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Method
                </label>
                <div className="space-y-3">
                  {/* Assessment Method Dropdown */}
                  <div>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          const currentMethod = lessonPlan.assessmentMethod;
                          const newMethod = e.target.value;
                          if (!currentMethod.includes(newMethod)) {
                            const updatedMethod = currentMethod ? `${currentMethod}\n\n${newMethod}` : newMethod;
                            handleInputChange('assessmentMethod', updatedMethod);
                          }
                          e.target.value = ''; // Reset selection
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Add assessment method from list"
                      title="Add assessment method from list"
                    >
                      <option value="">Select from predefined assessment methods...</option>
                      {assessmentMethods
                        .filter(method => !lessonPlan.assessmentMethod?.includes(method))
                        .map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Select a method to add to your assessment plan
                    </p>
                  </div>

                  {/* Assessment Method Content */}
                  <div>
                    <textarea
                      value={lessonPlan.assessmentMethod}
                      onChange={(e) => handleInputChange('assessmentMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={4}
                      placeholder="Describe how you will assess student learning... (You can also select from the dropdown above)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Type your assessment details or select from the dropdown above
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  References
                </label>
                <textarea
                  value={lessonPlan.references}
                  onChange={(e) => handleInputChange('references', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="List textbooks, websites, or other resources used..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={previewLessonPlan}
              className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Lesson Plan
            </button>
            <button
              onClick={saveLessonPlan}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Lesson Plan
            </button>
          </div>
        </div>
      ) : (
        /* Preview Mode */
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Lesson Plan Preview</h2>
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Back to Edit
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              INDIVIDUAL LESSON PLAN ON {lessonPlan.subject?.toUpperCase() || 'SUBJECT'}
            </h1>
            <p className="text-lg text-gray-600">
              FOR {lessonPlan.date ? new Date(lessonPlan.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }).toUpperCase() : 'DATE'}
            </p>
          </div>

          {/* Lesson Information Table */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold bg-gray-50">LEARNING THEME</td>
                  <td className="border border-gray-300 p-3">{lessonPlan.learningTheme || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold bg-gray-50">LEVEL</td>
                  <td className="border border-gray-300 p-3">{lessonPlan.class || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold bg-gray-50">CLASS</td>
                  <td className="border border-gray-300 p-3">{lessonPlan.class || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold bg-gray-50">TIME</td>
                  <td className="border border-gray-300 p-3">{lessonPlan.time || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold bg-gray-50">DURATION</td>
                  <td className="border border-gray-300 p-3">{lessonPlan.duration || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold bg-gray-50">DOMAIN</td>
                  <td className="border border-gray-300 p-3">{lessonPlan.domain || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold bg-gray-50">LESSON TITLE</td>
                  <td className="border border-gray-300 p-3">{lessonPlan.title || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold bg-gray-50">ENTRY BEHAVIOUR</td>
                  <td className="border border-gray-300 p-3">{lessonPlan.entryBehaviour || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Specific Objectives */}
          {lessonPlan.objectives.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">SPECIFIC OBJECTIVES</h3>
              <p className="text-lg font-semibold text-gray-700 mb-3">Learners will be able to:</p>
              <ul className="list-disc list-inside space-y-2">
                {lessonPlan.objectives.map((objective) => (
                  <li key={objective.id} className="text-gray-700">{objective.description}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Didactic Materials & References */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">DIDACTIC MATERIALS:</h4>
                <p className="text-gray-700">
                  {lessonPlan.materials.length > 0 
                    ? lessonPlan.materials.map(m => m.name).join(', ')
                    : 'N/A'
                  }
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">REFERENCES:</h4>
                <p className="text-gray-700">{lessonPlan.references || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Lesson Stages */}
          {lessonPlan.stages.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">LESSON STAGES</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 font-semibold text-left">STAGES</th>
                      <th className="border border-gray-300 p-3 font-semibold text-left">CONTENT</th>
                      <th className="border border-gray-300 p-3 font-semibold text-left">FACILITATING ACTIVITIES</th>
                      <th className="border border-gray-300 p-3 font-semibold text-left">LEARNING ACTIVITIES</th>
                      <th className="border border-gray-300 p-3 font-semibold text-left">RESOURCES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessonPlan.stages.map((stage) => (
                      <tr key={stage.id}>
                        <td className="border border-gray-300 p-3 font-semibold">{stage.stage}</td>
                        <td className="border border-gray-300 p-3">{stage.content}</td>
                        <td className="border border-gray-300 p-3">{stage.facilitatingActivities}</td>
                        <td className="border border-gray-300 p-3">{stage.learningActivities}</td>
                        <td className="border border-gray-300 p-3">{stage.resources}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Assessment Method */}
          {lessonPlan.assessmentMethod && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">ASSESSMENT METHOD</h3>
              <p className="text-gray-700">{lessonPlan.assessmentMethod}</p>
            </div>
          )}
        </div>
      )}

      {/* Import Confirmation Modal */}
      {showImportModal && selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Import from {selectedScheme.title}
            </h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Select what you want to import from this scheme of work:
              </p>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Learning Objectives ({selectedScheme.objectives.length} items)
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Materials ({selectedScheme.materials.length} items)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setSelectedScheme(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const importObjectives = (document.querySelector('input[type="checkbox"]:nth-of-type(1)') as HTMLInputElement)?.checked || false;
                  const importMaterials = (document.querySelector('input[type="checkbox"]:nth-of-type(2)') as HTMLInputElement)?.checked || false;
                  confirmImport(importObjectives, importMaterials);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Import Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Import Modal */}
      {showDetailedImportModal && selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Import Detailed Lessons from {selectedScheme.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Select a week and choose specific lessons to import
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {!selectedWeek ? (
                // Week Selection
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Select Week</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedScheme.weeklySchemes?.map((week) => (
                      <div
                        key={week.weekNumber}
                        onClick={() => selectWeek(week)}
                        className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow hover:border-blue-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-900">
                            Week {week.weekNumber}
                          </h5>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {week.lessons.length} lessons
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{week.weekTitle}</p>
                        <p className="text-xs text-gray-500">
                          <strong>Core Competency:</strong> {week.coreCompetency}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Lesson Selection
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        Week {selectedWeek.weekNumber}: {selectedWeek.weekTitle}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Select lessons to import ({selectedLessons.length} selected)
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedWeek(null);
                        setSelectedLessons([]);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      ← Back to Weeks
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Week Overview</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Core Competency:</strong> {selectedWeek.coreCompetency}
                      </div>
                      <div>
                        <strong>Grammar Focus:</strong> {selectedWeek.grammarFocus}
                      </div>
                      <div>
                        <strong>Mini Project:</strong> {selectedWeek.miniProjectComponent}
                      </div>
                      <div>
                        <strong>Phonics Focus:</strong> {selectedWeek.phonicsFocus}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900">Select Lessons</h5>
                    <div className="space-y-2">
                      {selectedWeek.lessons.map((lesson) => {
                        const isSelected = selectedLessons.some(l => l.id === lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            onClick={() => toggleLessonSelection(lesson)}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleLessonSelection(lesson)}
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h6 className="font-medium text-gray-900">{lesson.lessonTitle}</h6>
                                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {lesson.domain}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{lesson.activitiesAndExamples}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                                  <div><strong>Assessment:</strong> {lesson.assessmentTools}</div>
                                  <div><strong>Resources:</strong> {lesson.teachingResources}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDetailedImportModal(false);
                  setSelectedScheme(null);
                  setSelectedWeek(null);
                  setSelectedLessons([]);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              {selectedWeek && selectedLessons.length > 0 && (
                <button
                  onClick={confirmDetailedImport}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Import {selectedLessons.length} Selected Lessons
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auto Lesson Plan Generator Modal */}
      {showAutoLessonPlanGenerator && (
        <AutoLessonPlanGenerator
          onClose={() => setShowAutoLessonPlanGenerator(false)}
          onSave={(generatedPlan) => {
            // Convert the generated plan to the LessonPlanner format
            const convertedPlan: LessonPlan = {
              id: generatedPlan.id,
              title: generatedPlan.system === 'anglophone' ? generatedPlan.lessonTitle : generatedPlan.titre,
              subject: generatedPlan.subject,
              class: generatedPlan.system === 'anglophone' ? generatedPlan.class : generatedPlan.classe,
              date: generatedPlan.date,
              time: generatedPlan.system === 'anglophone' ? generatedPlan.time : '',
              duration: `${generatedPlan.system === 'anglophone' ? generatedPlan.duration : generatedPlan.duree} minutes`,
              learningTheme: generatedPlan.system === 'anglophone' ? generatedPlan.learningTheme : generatedPlan.centreInteret,
              selectedObjective: generatedPlan.system === 'anglophone' ? generatedPlan.specificObjectives : generatedPlan.competenceVisee,
              domain: generatedPlan.system === 'anglophone' ? generatedPlan.domain : generatedPlan.domaine,
              entryBehaviour: generatedPlan.system === 'anglophone' ? generatedPlan.entryBehaviour : '',
              objectives: [],
              materials: [],
              activities: [],
              stages: generatedPlan.stages.map((stage: any, index: number) => ({
                id: index.toString(),
                stage: generatedPlan.system === 'anglophone' ? (stage as any).stage : (stage as any).etape,
                content: generatedPlan.system === 'anglophone' ? (stage as any).content : (stage as any).opi,
                facilitatingActivities: generatedPlan.system === 'anglophone' ? (stage as any).facilitatingActivities : (stage as any).activitesEnseignant,
                learningActivities: generatedPlan.system === 'anglophone' ? (stage as any).learningActivities : (stage as any).activitesEleve,
                resources: generatedPlan.system === 'anglophone' ? (stage as any).resources : (stage as any).materiel
              })),
              assessmentMethod: '',
              references: generatedPlan.system === 'anglophone' ? generatedPlan.references : '',
              createdAt: generatedPlan.createdAt,
              updatedAt: generatedPlan.updatedAt
            };
            
            setLessonPlan(convertedPlan);
            setShowAutoLessonPlanGenerator(false);
            toast.success('Lesson plan generated and loaded successfully!');
          }}
        />
      )}
    </div>
  );
};

export default LessonPlanner;