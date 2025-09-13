import React, { createContext, useContext, ReactNode } from 'react';

export interface CurriculumSubject {
  id: string;
  name: string;
  code: string;
  description: string;
  objectives: string[];
  keySkills: string[];
  assessmentMethods: string[];
}

export interface CurriculumLevel {
  id: string;
  name: string;
  ageRange: string;
  description: string;
  subjects: CurriculumSubject[];
}

export interface SchemeOfWork {
  id: string;
  subjectId: string;
  levelId: string;
  term: number;
  week: number;
  topic: string;
  objectives: string[];
  content: string[];
  activities: string[];
  resources: string[];
  assessment: string[];
  duration: number; // in minutes
  prerequisites: string[];
  keywords: string[];
}

export interface WeeklyPlan {
  id: string;
  subjectId: string;
  levelId: string;
  term: number;
  week: number;
  theme: string;
  subThemes: string[];
  learningOutcomes: string[];
  crossCurricularLinks: string[];
  differentiation: string[];
  homework: string[];
  notes: string;
  schemeOfWorkId: string;
}

export interface AnglophoneCurriculumData {
  levels: CurriculumLevel[];
  schemesOfWork: SchemeOfWork[];
  weeklyPlans: WeeklyPlan[];
}

interface AnglophoneCurriculumContextType {
  curriculumData: AnglophoneCurriculumData;
  getSubjectsByLevel: (levelId: string) => CurriculumSubject[];
  getSchemeOfWork: (subjectId: string, levelId: string, term: number, week: number) => SchemeOfWork | undefined;
  getWeeklyPlan: (subjectId: string, levelId: string, term: number, week: number) => WeeklyPlan | undefined;
  getSchemesForSubject: (subjectId: string, levelId: string) => SchemeOfWork[];
  getWeeklyPlansForSubject: (subjectId: string, levelId: string) => WeeklyPlan[];
  getLevels: () => CurriculumLevel[];
  getSubjects: () => CurriculumSubject[];
}

const AnglophoneCurriculumContext = createContext<AnglophoneCurriculumContextType | undefined>(undefined);

interface AnglophoneCurriculumProviderProps {
  children: ReactNode;
}

export const AnglophoneCurriculumProvider: React.FC<AnglophoneCurriculumProviderProps> = ({ children }) => {
  // Official Anglophone Curriculum Data from Cameroon Ministry of Basic Education
  const curriculumData: AnglophoneCurriculumData = {
    levels: [
      {
        id: 'level-1',
        name: 'Level I (Class 1 & 2)',
        ageRange: '5-7 years',
        description: 'Foundation level focusing on basic literacy, numeracy, and life skills development',
        subjects: [
          {
            id: 'english-level-1',
            name: 'English Language',
            code: 'ENG-L1',
            description: 'Development of basic communication skills in English through listening, speaking, reading, and writing',
            objectives: [
              'Develop basic listening and speaking skills',
              'Master letter recognition and phonics',
              'Build simple sentence construction',
              'Develop reading fluency and comprehension',
              'Practice basic writing skills'
            ],
            keySkills: ['Phonics', 'Reading', 'Writing', 'Speaking', 'Listening', 'Grammar', 'Vocabulary'],
            assessmentMethods: ['Oral presentations', 'Written tests', 'Reading assessments', 'Portfolio', 'Observation']
          },
          {
            id: 'mathematics-level-1',
            name: 'Mathematics',
            code: 'MATH-L1',
            description: 'Introduction to mathematical concepts through hands-on activities and problem-solving',
            objectives: [
              'Develop number sense and counting skills',
              'Master basic number operations (addition, subtraction)',
              'Understand measurement concepts',
              'Develop spatial awareness and geometry',
              'Build problem-solving skills'
            ],
            keySkills: ['Number Operations', 'Counting', 'Measurement', 'Geometry', 'Problem Solving', 'Patterns'],
            assessmentMethods: ['Written tests', 'Practical activities', 'Problem-solving tasks', 'Observation']
          },
          {
            id: 'science-level-1',
            name: 'Science and Technology',
            code: 'SCI-L1',
            description: 'Introduction to scientific thinking through exploration of the human body, environment, and basic technology',
            objectives: [
              'Demonstrate knowledge of the human body and hygiene',
              'Describe the environment including plants and animals',
              'Use scientific instruments and technological tools',
              'Respect scientific procedures and norms',
              'Construct miniatures and models'
            ],
            keySkills: ['Observation', 'Experimentation', 'Scientific Method', 'Health Education', 'Environmental Science'],
            assessmentMethods: ['Practical work', 'Projects', 'Observations', 'Experiments', 'Portfolio']
          },
          {
            id: 'french-level-1',
            name: 'Français',
            code: 'FR-L1',
            description: 'Introduction to French as the second official language through basic communication skills',
            objectives: [
              'Develop basic listening and speaking skills in French',
              'Learn simple vocabulary and phrases',
              'Understand basic French grammar',
              'Practice reading simple French texts',
              'Write simple French sentences'
            ],
            keySkills: ['Listening', 'Speaking', 'Reading', 'Writing', 'Grammar', 'Vocabulary'],
            assessmentMethods: ['Oral presentations', 'Written tests', 'Reading assessments', 'Portfolio']
          },
          {
            id: 'citizenship-level-1',
            name: 'Citizenship',
            code: 'CIT-L1',
            description: 'Development of social values, patriotism, and understanding of community life',
            objectives: [
              'Identify effects of human activities',
              'Relate human activities to development',
              'Display spirit of objectivity, tolerance, and patriotism',
              'Practice values of harmonious living',
              'Show love for nation and the outside world'
            ],
            keySkills: ['Social Values', 'Patriotism', 'Tolerance', 'Community Awareness', 'Moral Development'],
            assessmentMethods: ['Observation', 'Projects', 'Discussions', 'Portfolio', 'Behavioral Assessment']
          },
          {
            id: 'vocational-level-1',
            name: 'Vocational Studies',
            code: 'VOC-L1',
            description: 'Development of practical skills through Arts and Crafts, and Agro-pastoral Farming',
            objectives: [
              'Use equipment to produce objects following procedures',
              'Acquire knowledge and skills for productive work',
              'Manipulate local materials to produce objects',
              'Produce arts objects using local materials',
              'Demonstrate spirit of collaboration and creativity'
            ],
            keySkills: ['Arts and Crafts', 'Agro-pastoral Farming', 'Creativity', 'Collaboration', 'Practical Skills'],
            assessmentMethods: ['Practical work', 'Projects', 'Portfolio', 'Observation', 'Product Assessment']
          },
          {
            id: 'arts-level-1',
            name: 'Arts',
            code: 'ART-L1',
            description: 'Development of artistic expression and creativity through various art forms',
            objectives: [
              'Express creativity through various art forms',
              'Develop fine motor skills',
              'Understand basic art concepts',
              'Appreciate different art styles',
              'Create original artworks'
            ],
            keySkills: ['Drawing', 'Painting', 'Crafting', 'Creativity', 'Fine Motor Skills', 'Art Appreciation'],
            assessmentMethods: ['Portfolio', 'Practical work', 'Observation', 'Art Projects']
          },
          {
            id: 'pes-level-1',
            name: 'Physical Education and Sports',
            code: 'PES-L1',
            description: 'Development of physical fitness, motor skills, and healthy lifestyle habits',
            objectives: [
              'Develop basic motor skills',
              'Improve physical fitness',
              'Learn team work and cooperation',
              'Understand importance of physical activity',
              'Develop healthy lifestyle habits'
            ],
            keySkills: ['Motor Skills', 'Physical Fitness', 'Teamwork', 'Coordination', 'Health Awareness'],
            assessmentMethods: ['Practical assessment', 'Observation', 'Fitness tests', 'Participation']
          },
          {
            id: 'ict-level-1',
            name: 'Information and Communication Technologies',
            code: 'ICT-L1',
            description: 'Introduction to basic computer skills and digital literacy',
            objectives: [
              'Develop basic computer skills',
              'Understand safe internet use',
              'Learn basic typing skills',
              'Use educational software',
              'Develop digital citizenship'
            ],
            keySkills: ['Computer Basics', 'Internet Safety', 'Typing', 'Digital Literacy', 'Educational Software'],
            assessmentMethods: ['Practical tests', 'Projects', 'Observation', 'Portfolio']
          }
        ]
      },
      {
        id: 'level-2',
        name: 'Level II (Class 3 & 4)',
        ageRange: '7-9 years',
        description: 'Intermediate level building on Level I foundations with more complex concepts',
        subjects: [
          {
            id: 'english-level-2',
            name: 'English Language',
            code: 'ENG-L2',
            description: 'Advanced English language skills with complex reading, writing, and communication',
            objectives: [
              'Enhance reading comprehension and fluency',
              'Develop creative and expository writing',
              'Master advanced grammar concepts',
              'Build extensive vocabulary',
              'Improve oral communication skills'
            ],
            keySkills: ['Advanced Reading', 'Creative Writing', 'Advanced Grammar', 'Vocabulary', 'Oral Communication'],
            assessmentMethods: ['Comprehension tests', 'Creative writing', 'Grammar tests', 'Oral presentations', 'Portfolio']
          },
          {
            id: 'mathematics-level-2',
            name: 'Mathematics',
            code: 'MATH-L2',
            description: 'Advanced mathematical concepts including fractions, decimals, and complex problem-solving',
            objectives: [
              'Master advanced number operations',
              'Understand fractions and decimals',
              'Develop complex problem-solving strategies',
              'Learn basic algebra concepts',
              'Apply mathematics to real-life situations'
            ],
            keySkills: ['Advanced Operations', 'Fractions', 'Decimals', 'Problem Solving', 'Algebra', 'Data Analysis'],
            assessmentMethods: ['Written tests', 'Problem-solving tasks', 'Practical activities', 'Projects']
          },
          {
            id: 'science-level-2',
            name: 'Science and Technology',
            code: 'SCI-L2',
            description: 'Advanced scientific concepts including environmental science, health education, and technology',
            objectives: [
              'Understand advanced scientific concepts',
              'Conduct scientific experiments',
              'Apply scientific method',
              'Understand environmental issues',
              'Use advanced technological tools'
            ],
            keySkills: ['Scientific Method', 'Experimentation', 'Environmental Science', 'Health Education', 'Technology'],
            assessmentMethods: ['Experiments', 'Projects', 'Written tests', 'Practical work', 'Portfolio']
          },
          {
            id: 'social-studies-level-2',
            name: 'Social Studies',
            code: 'SOC-L2',
            description: 'Comprehensive study of history, geography, and citizenship',
            objectives: [
              'Understand historical events and their significance',
              'Learn geographical concepts and map skills',
              'Develop citizenship values and responsibilities',
              'Understand cultural diversity',
              'Analyze social issues'
            ],
            keySkills: ['History', 'Geography', 'Citizenship', 'Cultural Awareness', 'Critical Thinking'],
            assessmentMethods: ['Written tests', 'Projects', 'Presentations', 'Map work', 'Discussions']
          }
        ]
      },
      {
        id: 'level-3',
        name: 'Level III (Class 5 & 6)',
        ageRange: '9-11 years',
        description: 'Advanced level preparing students for secondary education with comprehensive subject coverage',
        subjects: [
          {
            id: 'english-level-3',
            name: 'English Language and Literature',
            code: 'ENG-L3',
            description: 'Mastery of English language skills with advanced literature, composition, and critical thinking',
            objectives: [
              'Master advanced reading and comprehension skills',
              'Develop sophisticated writing and composition skills',
              'Analyze literature and texts critically',
              'Present complex ideas effectively through speaking and writing',
              'Use advanced grammar, vocabulary, and language structures',
              'Prepare for secondary education'
            ],
            keySkills: ['Advanced Literature', 'Critical Analysis', 'Sophisticated Writing', 'Presentation Skills', 'Research', 'Grammar', 'Vocabulary', 'Composition'],
            assessmentMethods: ['Literature analysis', 'Research projects', 'Presentations', 'Written compositions', 'Portfolio', 'Oral examinations']
          },
          {
            id: 'mathematics-level-3',
            name: 'Mathematics',
            code: 'MATH-L3',
            description: 'Advanced mathematics including algebra, geometry, statistics, and preparation for secondary math',
            objectives: [
              'Master advanced mathematical concepts and operations',
              'Solve complex problems independently using multiple strategies',
              'Apply mathematics to real-world situations and contexts',
              'Develop logical reasoning and analytical thinking skills',
              'Understand geometric principles and spatial relationships',
              'Prepare for secondary mathematics education'
            ],
            keySkills: ['Advanced Algebra', 'Geometry', 'Statistics', 'Problem Solving', 'Logical Reasoning', 'Data Analysis', 'Spatial Awareness'],
            assessmentMethods: ['Complex problem solving', 'Projects', 'Written tests', 'Practical applications', 'Mathematical investigations']
          },
          {
            id: 'science-level-3',
            name: 'Science and Technology',
            code: 'SCI-L3',
            description: 'Comprehensive science education including physics, chemistry, biology, and advanced technology',
            objectives: [
              'Understand advanced scientific principles and concepts',
              'Conduct independent scientific investigations and experiments',
              'Apply scientific knowledge to solve real-world problems',
              'Understand technological applications and their impact',
              'Develop critical thinking and scientific reasoning',
              'Prepare for secondary science education'
            ],
            keySkills: ['Physics', 'Chemistry', 'Biology', 'Scientific Investigation', 'Technology Application', 'Environmental Science', 'Health Education'],
            assessmentMethods: ['Scientific investigations', 'Laboratory work', 'Research projects', 'Written tests', 'Practical assessments']
          },
          {
            id: 'french-level-3',
            name: 'Français',
            code: 'FR-L3',
            description: 'Advanced French language skills with complex communication, literature, and cultural understanding',
            objectives: [
              'Master advanced French communication skills',
              'Read and understand complex French texts and literature',
              'Write sophisticated French compositions and essays',
              'Understand French culture and cultural contexts',
              'Use advanced French grammar and vocabulary',
              'Prepare for secondary French education'
            ],
            keySkills: ['Advanced Communication', 'Literature Analysis', 'Composition', 'Cultural Understanding', 'Advanced Grammar', 'Vocabulary'],
            assessmentMethods: ['Oral presentations', 'Written compositions', 'Literature analysis', 'Cultural projects', 'Portfolio']
          },
          {
            id: 'social-studies-level-3',
            name: 'Social Studies',
            code: 'SOC-L3',
            description: 'Comprehensive study of history, geography, and citizenship with focus on national and global perspectives',
            objectives: [
              'Understand historical events and their significance',
              'Learn advanced geographical concepts and map skills',
              'Develop citizenship values and responsibilities',
              'Understand cultural diversity and global perspectives',
              'Analyze social issues and current events',
              'Prepare for secondary social studies education'
            ],
            keySkills: ['History', 'Geography', 'Citizenship', 'Cultural Awareness', 'Critical Thinking', 'Map Skills', 'Current Events'],
            assessmentMethods: ['Research projects', 'Presentations', 'Map work', 'Written tests', 'Discussions', 'Portfolio']
          },
          {
            id: 'vocational-level-3',
            name: 'Vocational Studies',
            code: 'VOC-L3',
            description: 'Advanced practical skills including Arts and Crafts, Agro-pastoral Farming, and Home Economics',
            objectives: [
              'Master advanced practical skills and techniques',
              'Develop entrepreneurial and business skills',
              'Understand agricultural and farming principles',
              'Learn home management and economic principles',
              'Develop creativity and innovation in practical work',
              'Prepare for technical and vocational education'
            ],
            keySkills: ['Arts and Crafts', 'Agro-pastoral Farming', 'Home Economics', 'Entrepreneurship', 'Creativity', 'Practical Skills'],
            assessmentMethods: ['Practical work', 'Projects', 'Portfolio', 'Product assessment', 'Business plans']
          },
          {
            id: 'arts-level-3',
            name: 'Arts',
            code: 'ART-L3',
            description: 'Advanced artistic expression including Performing Arts (Dance, Music, Theatre) and Visual Arts',
            objectives: [
              'Master advanced artistic techniques and skills',
              'Develop creative expression through various art forms',
              'Understand cultural and historical art contexts',
              'Perform and present artistic works confidently',
              'Appreciate and critique different art forms',
              'Prepare for secondary arts education'
            ],
            keySkills: ['Performing Arts', 'Visual Arts', 'Dance', 'Music', 'Theatre', 'Creativity', 'Cultural Expression'],
            assessmentMethods: ['Performances', 'Art exhibitions', 'Portfolio', 'Practical assessments', 'Cultural presentations']
          },
          {
            id: 'pes-level-3',
            name: 'Physical Education and Sports',
            code: 'PES-L3',
            description: 'Advanced physical education including athletics, team sports, and health education',
            objectives: [
              'Master advanced physical skills and techniques',
              'Develop team work and leadership skills',
              'Understand health and fitness principles',
              'Participate in competitive and recreational sports',
              'Develop healthy lifestyle habits',
              'Prepare for secondary physical education'
            ],
            keySkills: ['Athletics', 'Team Sports', 'Physical Fitness', 'Health Education', 'Leadership', 'Sportsmanship'],
            assessmentMethods: ['Physical assessments', 'Sports competitions', 'Health projects', 'Fitness tests', 'Participation']
          },
          {
            id: 'national-languages-level-3',
            name: 'National Languages and Cultures',
            code: 'NLC-L3',
            description: 'Study of Cameroonian national languages and cultural heritage',
            objectives: [
              'Learn and use at least one national language',
              'Understand cultural diversity and heritage',
              'Appreciate traditional values and customs',
              'Develop cultural identity and pride',
              'Understand cultural preservation and transmission',
              'Prepare for cultural integration and understanding'
            ],
            keySkills: ['National Languages', 'Cultural Heritage', 'Traditional Values', 'Cultural Identity', 'Language Skills'],
            assessmentMethods: ['Language assessments', 'Cultural presentations', 'Traditional performances', 'Cultural projects']
          },
          {
            id: 'ict-level-3',
            name: 'Information and Communication Technologies',
            code: 'ICT-L3',
            description: 'Advanced ICT skills including computer applications, internet, and digital citizenship',
            objectives: [
              'Master advanced computer skills and applications',
              'Use internet and digital tools effectively and safely',
              'Develop digital citizenship and ethical behavior',
              'Create and manage digital content and projects',
              'Understand technology\'s role in modern society',
              'Prepare for secondary ICT education'
            ],
            keySkills: ['Computer Applications', 'Internet Skills', 'Digital Citizenship', 'Content Creation', 'Digital Literacy', 'Ethics'],
            assessmentMethods: ['Practical tests', 'Digital projects', 'Online assessments', 'Portfolio', 'Ethics discussions']
          }
        ]
      }
    ],
    schemesOfWork: [
      // Level I - English Language - Term 1 (September - The Home Theme)
      {
        id: 'english-level1-term1-week1',
        subjectId: 'english-level-1',
        levelId: 'level-1',
        term: 1,
        week: 1,
        topic: 'Listening and Speaking - Greetings and Self Introduction',
        objectives: [
          'Greet at different periods of the day',
          'Introduce self to others',
          'Say letter sounds of the alphabet',
          'Identify and name proper and common nouns',
          'Identify and name members of the nuclear and extended family'
        ],
        content: [
          'Greetings',
          'Self Introduction',
          'Letters & sounds of the alphabet',
          'Nouns (Proper and common nouns)',
          'Members of the family'
        ],
        activities: [
          'Greeting practice at different times',
          'Self introduction exercises',
          'Letter sound recognition',
          'Noun identification games',
          'Family member identification'
        ],
        resources: [
          'Pictures',
          'Flashcards',
          'Charts',
          'Real objects'
        ],
        assessment: [
          'Oral greeting assessment',
          'Self introduction evaluation',
          'Letter sound recognition test',
          'Noun identification quiz',
          'Family member naming test'
        ],
        duration: 45,
        prerequisites: [],
        keywords: ['greetings', 'introduction', 'alphabet', 'nouns', 'family']
      },
      {
        id: 'english-level1-term1-week2',
        subjectId: 'english-level-1',
        levelId: 'level-1',
        term: 1,
        week: 2,
        topic: 'Reading and Writing - Picture Reading and Letter Formation',
        objectives: [
          'Read and interpret pictures',
          'Read and write letters of the alphabet',
          'Write strokes, curves and zigzag lines',
          'Introduce others appropriately',
          'Respond appropriately to polite requests'
        ],
        content: [
          'Picture reading',
          'Letters of the alphabet',
          'Strokes, curves, zigzag',
          'Introducing others',
          'Polite requests (sorry, welcome)'
        ],
        activities: [
          'Picture interpretation exercises',
          'Letter writing practice',
          'Line drawing exercises',
          'Introduction role-play',
          'Polite request practice'
        ],
        resources: [
          'Real pictures',
          'Flash cards',
          'Charts',
          'Pencils, chalk'
        ],
        assessment: [
          'Picture reading test',
          'Letter writing assessment',
          'Line drawing evaluation',
          'Role-play assessment',
          'Polite request quiz'
        ],
        duration: 45,
        prerequisites: ['Basic letter recognition'],
        keywords: ['picture reading', 'letter formation', 'strokes', 'introductions', 'politeness']
      },
      // Level I - Mathematics - Term 1 (September - The Home Theme)
      {
        id: 'math-level1-term1-week1',
        subjectId: 'mathematics-level-1',
        levelId: 'level-1',
        term: 1,
        week: 1,
        topic: 'Numbers 0-10 - Counting and Recognition',
        objectives: [
          'Count from 0 to 10',
          'Recognize and write numbers 0-10',
          'Understand number value',
          'Develop number sense'
        ],
        content: [
          'Number recognition 0-10',
          'Counting objects',
          'Number writing practice',
          'Number value concepts'
        ],
        activities: [
          'Counting games',
          'Number tracing',
          'Object counting exercises',
          'Number matching activities'
        ],
        resources: [
          'Number cards',
          'Counting objects',
          'Tracing worksheets',
          'Number charts'
        ],
        assessment: [
          'Number recognition test',
          'Counting assessment',
          'Number writing evaluation',
          'Portfolio review'
        ],
        duration: 45,
        prerequisites: [],
        keywords: ['numbers', 'counting', 'recognition', 'value']
      },
      // Level I - Mathematics - Term 1
      {
        id: 'math-level1-term1-week1',
        subjectId: 'mathematics-level-1',
        levelId: 'level-1',
        term: 1,
        week: 1,
        topic: 'Numbers 0-10 - Counting and Recognition',
        objectives: [
          'Count from 0 to 10',
          'Recognize and write numbers 0-10',
          'Understand number value',
          'Develop number sense'
        ],
        content: [
          'Number recognition 0-10',
          'Counting objects',
          'Number writing practice',
          'Number value concepts'
        ],
        activities: [
          'Counting games',
          'Number tracing',
          'Object counting exercises',
          'Number matching activities'
        ],
        resources: [
          'Number cards',
          'Counting objects',
          'Tracing worksheets',
          'Number charts'
        ],
        assessment: [
          'Number recognition test',
          'Counting assessment',
          'Number writing evaluation',
          'Portfolio review'
        ],
        duration: 45,
        prerequisites: [],
        keywords: ['numbers', 'counting', 'recognition', 'value']
      },
      // Level I - Science and Technology - Term 1
      {
        id: 'science-level1-term1-week1',
        subjectId: 'science-level-1',
        levelId: 'level-1',
        term: 1,
        week: 1,
        topic: 'The Human Body - Parts of the Body',
        objectives: [
          'Identify parts of the human body',
          'Understand basic body functions',
          'Learn about personal hygiene',
          'Develop health awareness'
        ],
        content: [
          'Body parts identification',
          'Basic body functions',
          'Personal hygiene practices',
          'Health and safety rules'
        ],
        activities: [
          'Body parts games',
          'Hygiene demonstrations',
          'Health discussions',
          'Safety practices'
        ],
        resources: [
          'Body parts charts',
          'Hygiene materials',
          'Health education posters',
          'Safety equipment'
        ],
        assessment: [
          'Body parts identification test',
          'Hygiene practice observation',
          'Health knowledge quiz',
          'Portfolio assessment'
        ],
        duration: 45,
        prerequisites: [],
        keywords: ['human body', 'hygiene', 'health', 'safety']
      },
      // Level II - English Language - Term 1
      {
        id: 'english-level2-term1-week1',
        subjectId: 'english-level-2',
        levelId: 'level-2',
        term: 1,
        week: 1,
        topic: 'Reading Comprehension - Understanding Texts',
        objectives: [
          'Read and understand simple texts',
          'Answer comprehension questions',
          'Identify main ideas',
          'Develop reading fluency'
        ],
        content: [
          'Reading strategies',
          'Comprehension techniques',
          'Main idea identification',
          'Fluency building exercises'
        ],
        activities: [
          'Guided reading sessions',
          'Comprehension exercises',
          'Discussion groups',
          'Reading aloud practice'
        ],
        resources: [
          'Reading books',
          'Comprehension worksheets',
          'Discussion guides',
          'Reading charts'
        ],
        assessment: [
          'Comprehension test',
          'Reading fluency assessment',
          'Discussion participation',
          'Portfolio review'
        ],
        duration: 45,
        prerequisites: ['Basic reading skills'],
        keywords: ['comprehension', 'reading', 'fluency', 'understanding']
      },
      // Level III - English Language and Literature - Term 1
      {
        id: 'english-level3-term1-week1',
        subjectId: 'english-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Advanced Reading Comprehension - Analyzing Complex Texts',
        objectives: [
          'Analyze complex texts for main ideas and supporting details',
          'Identify literary devices and techniques',
          'Make inferences and draw conclusions',
          'Develop critical thinking skills'
        ],
        content: [
          'Text analysis techniques',
          'Literary devices identification',
          'Inference and conclusion drawing',
          'Critical thinking strategies'
        ],
        activities: [
          'Text analysis exercises',
          'Literary device identification',
          'Discussion groups',
          'Critical thinking tasks'
        ],
        resources: [
          'Complex reading texts',
          'Literary analysis guides',
          'Discussion prompts',
          'Critical thinking worksheets'
        ],
        assessment: [
          'Text analysis test',
          'Literary device identification',
          'Critical thinking assessment',
          'Portfolio review'
        ],
        duration: 45,
        prerequisites: ['Advanced reading skills'],
        keywords: ['comprehension', 'analysis', 'literary devices', 'critical thinking']
      },
      // Level III - Mathematics - Term 1
      {
        id: 'math-level3-term1-week1',
        subjectId: 'mathematics-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Advanced Fractions and Decimals',
        objectives: [
          'Master fraction and decimal operations',
          'Convert between fractions, decimals, and percentages',
          'Solve complex word problems involving fractions and decimals',
          'Apply mathematical concepts to real-world situations'
        ],
        content: [
          'Fraction operations (addition, subtraction, multiplication, division)',
          'Decimal operations and conversions',
          'Percentage calculations',
          'Word problem solving strategies'
        ],
        activities: [
          'Fraction and decimal manipulatives',
          'Real-world problem solving',
          'Mathematical investigations',
          'Group problem-solving tasks'
        ],
        resources: [
          'Fraction and decimal manipulatives',
          'Problem-solving worksheets',
          'Real-world scenarios',
          'Mathematical tools'
        ],
        assessment: [
          'Fraction and decimal operations test',
          'Word problem solving assessment',
          'Real-world application project',
          'Portfolio evaluation'
        ],
        duration: 45,
        prerequisites: ['Basic fraction and decimal concepts'],
        keywords: ['fractions', 'decimals', 'percentages', 'word problems']
      },
      // Official Class 5 Schemes - English Language and Literature (Nature Theme)
      {
        id: 'english-class5-term1-week1-verbs',
        subjectId: 'english-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Grammar and Vocabulary - Regular/Irregular Verbs',
        objectives: [
          'Distinguish between regular and irregular verbs',
          'Use verbs correctly in sentences',
          'Identify verb forms and tenses',
          'Apply verb knowledge in writing'
        ],
        content: [
          'Regular/irregular verbs',
          'Verb conjugation',
          'Verb tenses',
          'Verb usage in context'
        ],
        activities: [
          'Verb identification exercises',
          'Conjugation practice',
          'Sentence construction',
          'Writing activities'
        ],
        resources: [
          'Flash cards',
          'Real objects',
          'Interjection lists',
          'Textbooks'
        ],
        assessment: [
          'Verb identification test',
          'Conjugation quiz',
          'Writing assessment',
          'Oral presentation'
        ],
        duration: 45,
        prerequisites: ['Basic grammar knowledge'],
        keywords: ['verbs', 'grammar', 'conjugation', 'tenses']
      },
      {
        id: 'english-class5-term1-week1-reading',
        subjectId: 'english-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Reading and Literature - Picture Talk and Reading Aloud',
        objectives: [
          'Interpret and appreciate pictures',
          'Read and discuss texts fluently',
          'Develop reading comprehension skills',
          'Enhance oral communication'
        ],
        content: [
          'Picture interpretation',
          'Reading aloud techniques',
          'Text discussion',
          'Comprehension strategies'
        ],
        activities: [
          'Picture talk sessions',
          'Reading aloud practice',
          'Group discussions',
          'Comprehension exercises'
        ],
        resources: [
          'Model essays',
          'Notepads',
          'Picture books',
          'Texts'
        ],
        assessment: [
          'Picture interpretation test',
          'Reading fluency assessment',
          'Discussion participation',
          'Comprehension quiz'
        ],
        duration: 45,
        prerequisites: ['Basic reading skills'],
        keywords: ['reading', 'literature', 'comprehension', 'discussion']
      },
      // Official Class 5 Schemes - Mathematics (Nature Theme)
      {
        id: 'math-class5-term1-week1-numbers',
        subjectId: 'mathematics-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Numbers and Operations - Reading and Writing Numbers (0 to 10000)',
        objectives: [
          'Read and write numbers in words and figures',
          'Understand place value up to 10000',
          'Convert between number forms',
          'Apply number knowledge in real contexts'
        ],
        content: [
          'Number reading and writing',
          'Place value concepts',
          'Number conversion',
          'Real-world number applications'
        ],
        activities: [
          'Number reading exercises',
          'Place value games',
          'Conversion practice',
          'Real-world number problems'
        ],
        resources: [
          'Pictures',
          'Charts',
          'Calendar',
          'Audio-visual aids'
        ],
        assessment: [
          'Number reading test',
          'Place value quiz',
          'Conversion assessment',
          'Practical application test'
        ],
        duration: 45,
        prerequisites: ['Basic number recognition'],
        keywords: ['numbers', 'place value', 'conversion', 'reading']
      },
      {
        id: 'math-class5-term1-week1-sets',
        subjectId: 'mathematics-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Sets and Logic - Definition and Identification of Set Symbols',
        objectives: [
          'Define and identify set symbols',
          'Understand basic set concepts',
          'Use set notation correctly',
          'Apply set logic in problem solving'
        ],
        content: [
          'Set definition and symbols',
          'Set notation',
          'Basic set operations',
          'Set logic applications'
        ],
        activities: [
          'Set symbol identification',
          'Set notation practice',
          'Set operation exercises',
          'Logic problem solving'
        ],
        resources: [
          'Pictures',
          'Charts',
          'Audio-visual materials',
          'Set manipulatives'
        ],
        assessment: [
          'Set symbol test',
          'Notation quiz',
          'Operation assessment',
          'Logic problem solving'
        ],
        duration: 45,
        prerequisites: ['Basic logical thinking'],
        keywords: ['sets', 'symbols', 'logic', 'notation']
      },
      // Official Class 5 Schemes - Science and Technology (Nature Theme)
      {
        id: 'science-class5-term1-week1-environment',
        subjectId: 'science-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Environmental Sciences - Habitats and Care of Birds',
        objectives: [
          'Identify different bird habitats',
          'Explain how to care for bird habitats',
          'Understand bird conservation principles',
          'Develop environmental awareness'
        ],
        content: [
          'Bird habitat identification',
          'Habitat care methods',
          'Conservation principles',
          'Environmental awareness'
        ],
        activities: [
          'Habitat observation',
          'Care planning exercises',
          'Conservation discussions',
          'Environmental projects'
        ],
        resources: [
          'Models',
          'Visual aids',
          'Drawing materials',
          'Field guides'
        ],
        assessment: [
          'Habitat identification test',
          'Care plan presentation',
          'Conservation quiz',
          'Environmental project'
        ],
        duration: 45,
        prerequisites: ['Basic environmental knowledge'],
        keywords: ['habitats', 'birds', 'conservation', 'environment']
      },
      {
        id: 'science-class5-term1-week1-technology',
        subjectId: 'science-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Technology and Engineering - Telecommunications - Camera',
        objectives: [
          'State and explain the use of the camera',
          'Understand the importance of cameras in communication',
          'Learn about camera technology',
          'Apply camera knowledge in practical contexts'
        ],
        content: [
          'Camera functions and uses',
          'Communication applications',
          'Technology principles',
          'Practical applications'
        ],
        activities: [
          'Camera demonstration',
          'Usage practice',
          'Technology exploration',
          'Practical applications'
        ],
        resources: [
          'Camera equipment',
          'Visual aids',
          'Technology guides',
          'Practical materials'
        ],
        assessment: [
          'Camera knowledge test',
          'Usage demonstration',
          'Technology quiz',
          'Practical application'
        ],
        duration: 45,
        prerequisites: ['Basic technology knowledge'],
        keywords: ['camera', 'telecommunications', 'technology', 'communication']
      },
      {
        id: 'science-class5-term1-week1-health',
        subjectId: 'science-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Health Education - HIV/AIDS Prevention',
        objectives: [
          'State how to prevent HIV/AIDS',
          'Show sympathy for persons living with HIV/AIDS',
          'Understand HIV/AIDS transmission',
          'Develop health awareness and empathy'
        ],
        content: [
          'HIV/AIDS prevention methods',
          'Transmission understanding',
          'Empathy and support',
          'Health awareness'
        ],
        activities: [
          'Prevention education',
          'Empathy exercises',
          'Health discussions',
          'Awareness projects'
        ],
        resources: [
          'Real objects',
          'Charts',
          'Pictures',
          'Models'
        ],
        assessment: [
          'Prevention knowledge test',
          'Empathy assessment',
          'Health awareness quiz',
          'Awareness project'
        ],
        duration: 45,
        prerequisites: ['Basic health knowledge'],
        keywords: ['HIV/AIDS', 'prevention', 'empathy', 'health']
      },
      // Official Class 2 Schemes - Level I (The Home Theme)
      {
        id: 'english-class2-term1-week1',
        subjectId: 'english-level-1',
        levelId: 'level-1',
        term: 1,
        week: 1,
        topic: 'Listening and Speaking - Greetings and Alphabet Sounds',
        objectives: [
          'Greet at different periods of the day',
          'Say letter sounds of the alphabet',
          'Develop basic communication skills',
          'Build phonemic awareness'
        ],
        content: [
          'Greetings',
          'Letters & sounds of the alphabet',
          'Basic communication',
          'Phonemic awareness'
        ],
        activities: [
          'Greeting practice',
          'Letter sound recognition',
          'Communication exercises',
          'Phonemic awareness games'
        ],
        resources: [
          'Pictures',
          'Flash cards',
          'Charts',
          'Real objects'
        ],
        assessment: [
          'Oral greeting test',
          'Letter sound recognition',
          'Communication assessment',
          'Phonemic awareness quiz'
        ],
        duration: 45,
        prerequisites: [],
        keywords: ['greetings', 'alphabet', 'sounds', 'communication']
      },
      {
        id: 'english-class2-term1-week1-reading',
        subjectId: 'english-level-1',
        levelId: 'level-1',
        term: 1,
        week: 1,
        topic: 'Reading - Picture Reading and Alphabet Letters',
        objectives: [
          'Read and interpret pictures',
          'Read and write letters of the alphabet',
          'Develop basic reading skills',
          'Build letter recognition'
        ],
        content: [
          'Picture reading',
          'Letters of the alphabet',
          'Basic reading skills',
          'Letter recognition'
        ],
        activities: [
          'Picture interpretation',
          'Letter reading practice',
          'Reading exercises',
          'Letter recognition games'
        ],
        resources: [
          'Real pictures',
          'Flash cards',
          'Charts',
          'Reading materials'
        ],
        assessment: [
          'Picture reading test',
          'Letter recognition quiz',
          'Reading assessment',
          'Letter writing test'
        ],
        duration: 45,
        prerequisites: ['Basic letter recognition'],
        keywords: ['picture reading', 'alphabet', 'letters', 'recognition']
      },
      // Official Class 3 Schemes - Level II (The Home Theme)
      {
        id: 'english-class3-term1-week1',
        subjectId: 'english-level-2',
        levelId: 'level-2',
        term: 1,
        week: 1,
        topic: 'Speaking and Listening - Greetings and Sight Words',
        objectives: [
          'Greet people and respond to greetings appropriately at different periods of the day',
          'Read sight words',
          'Develop communication skills',
          'Build vocabulary'
        ],
        content: [
          'Greetings: morning, afternoon, night',
          'Sight words',
          'Communication skills',
          'Vocabulary building'
        ],
        activities: [
          'Greeting practice',
          'Sight word reading',
          'Communication exercises',
          'Vocabulary games'
        ],
        resources: [
          'Flashcards',
          'Magazines',
          'Charts',
          'Adventure stories'
        ],
        assessment: [
          'Greeting assessment',
          'Sight word test',
          'Communication evaluation',
          'Vocabulary quiz'
        ],
        duration: 45,
        prerequisites: ['Basic reading skills'],
        keywords: ['greetings', 'sight words', 'communication', 'vocabulary']
      },
      {
        id: 'english-class3-term1-week1-writing',
        subjectId: 'english-level-2',
        levelId: 'level-2',
        term: 1,
        week: 1,
        topic: 'Writing - Upright Joint Script and Grammar',
        objectives: [
          'Copy out short texts of at least five different sentences legibly and consistently',
          'Appropriate use of auxiliary verbs',
          'Develop writing skills',
          'Understand basic grammar'
        ],
        content: [
          'Upright joint script',
          'Auxiliary verbs',
          'Writing skills',
          'Basic grammar'
        ],
        activities: [
          'Script writing practice',
          'Verb usage exercises',
          'Writing activities',
          'Grammar practice'
        ],
        resources: [
          'Pens',
          'Charts',
          'Writing materials',
          'Grammar guides'
        ],
        assessment: [
          'Writing assessment',
          'Grammar test',
          'Script evaluation',
          'Verb usage quiz'
        ],
        duration: 45,
        prerequisites: ['Basic writing skills'],
        keywords: ['script', 'auxiliary verbs', 'writing', 'grammar']
      },
      // Official Class 4 Schemes - Level II (The Home Theme)
      {
        id: 'english-class4-term1-week1',
        subjectId: 'english-level-2',
        levelId: 'level-2',
        term: 1,
        week: 1,
        topic: 'Speaking and Listening - Greetings and Numbers',
        objectives: [
          'Greet people and respond to greetings appropriately at different periods of the day',
          'Read words and numbers from 501-600',
          'Develop communication skills',
          'Build number recognition'
        ],
        content: [
          'Greetings: morning, afternoon, night',
          'Sight words',
          'Numbers from 501-600',
          'Communication skills'
        ],
        activities: [
          'Greeting practice',
          'Word and number reading',
          'Communication exercises',
          'Number recognition games'
        ],
        resources: [
          'Flashcards',
          'Magazines',
          'Charts',
          'Number cards'
        ],
        assessment: [
          'Greeting assessment',
          'Word reading test',
          'Number recognition quiz',
          'Communication evaluation'
        ],
        duration: 45,
        prerequisites: ['Basic reading and number skills'],
        keywords: ['greetings', 'words', 'numbers', 'communication']
      },
      {
        id: 'english-class4-term1-week1-comprehension',
        subjectId: 'english-level-2',
        levelId: 'level-2',
        term: 1,
        week: 1,
        topic: 'Reading - Comprehension Text on Family and Synonyms',
        objectives: [
          'Read and understand comprehension text on a family',
          'Use the correct synonyms of words',
          'Develop reading comprehension',
          'Build vocabulary through synonyms'
        ],
        content: [
          'Comprehension text on family',
          'Synonyms',
          'Reading comprehension',
          'Vocabulary building'
        ],
        activities: [
          'Family text reading',
          'Synonym exercises',
          'Comprehension questions',
          'Vocabulary games'
        ],
        resources: [
          'Adventure story',
          'Practice creative writing',
          'Real objects',
          'Vocabulary charts'
        ],
        assessment: [
          'Comprehension test',
          'Synonym quiz',
          'Reading assessment',
          'Vocabulary evaluation'
        ],
        duration: 45,
        prerequisites: ['Basic reading comprehension'],
        keywords: ['comprehension', 'family', 'synonyms', 'vocabulary']
      },
      // Official Class 6 Schemes - Level III (Nature Theme)
      {
        id: 'english-class6-term1-week1-verbs',
        subjectId: 'english-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Grammar and Vocabulary - Regular/Irregular Verbs',
        objectives: [
          'Distinguish between regular and irregular verbs',
          'Use verbs correctly in sentences',
          'Identify verb forms and tenses',
          'Apply verb knowledge in writing'
        ],
        content: [
          'Regular/irregular verbs',
          'Verb conjugation',
          'Verb tenses',
          'Verb usage in context'
        ],
        activities: [
          'Verb identification exercises',
          'Conjugation practice',
          'Sentence construction',
          'Writing activities'
        ],
        resources: [
          'Flash cards',
          'Real objects',
          'Interjection lists',
          'Textbooks'
        ],
        assessment: [
          'Verb identification test',
          'Conjugation quiz',
          'Writing assessment',
          'Oral presentation'
        ],
        duration: 45,
        prerequisites: ['Advanced grammar knowledge'],
        keywords: ['verbs', 'grammar', 'conjugation', 'tenses']
      },
      {
        id: 'english-class6-term1-week1-reading',
        subjectId: 'english-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Reading and Literature - Picture Talk and Reading Aloud',
        objectives: [
          'Interpret and appreciate pictures',
          'Read and discuss texts fluently',
          'Develop advanced reading comprehension',
          'Enhance oral communication'
        ],
        content: [
          'Picture interpretation',
          'Reading aloud techniques',
          'Text discussion',
          'Advanced comprehension'
        ],
        activities: [
          'Picture talk sessions',
          'Reading aloud practice',
          'Group discussions',
          'Comprehension exercises'
        ],
        resources: [
          'Model essays',
          'Notepads',
          'Picture books',
          'Advanced texts'
        ],
        assessment: [
          'Picture interpretation test',
          'Reading fluency assessment',
          'Discussion participation',
          'Comprehension quiz'
        ],
        duration: 45,
        prerequisites: ['Advanced reading skills'],
        keywords: ['reading', 'literature', 'comprehension', 'discussion']
      },
      // Level III - Science and Technology - Term 1
      {
        id: 'science-level3-term1-week1',
        subjectId: 'science-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Environmental Science - Ecosystems and Conservation',
        objectives: [
          'Understand ecosystem components and interactions',
          'Learn about environmental conservation principles',
          'Investigate human impact on the environment',
          'Develop environmental awareness and responsibility'
        ],
        content: [
          'Ecosystem structure and function',
          'Biodiversity and conservation',
          'Human environmental impact',
          'Sustainable practices'
        ],
        activities: [
          'Ecosystem field studies',
          'Conservation projects',
          'Environmental impact assessments',
          'Sustainability discussions'
        ],
        resources: [
          'Ecosystem models',
          'Environmental data',
          'Conservation materials',
          'Field study equipment'
        ],
        assessment: [
          'Ecosystem knowledge test',
          'Conservation project',
          'Environmental impact report',
          'Portfolio assessment'
        ],
        duration: 45,
        prerequisites: ['Basic environmental concepts'],
        keywords: ['ecosystems', 'conservation', 'biodiversity', 'sustainability']
      },
      // Level III - Français - Term 1
      {
        id: 'french-level3-term1-week1',
        subjectId: 'french-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Advanced French Communication - Complex Conversations',
        objectives: [
          'Engage in complex French conversations',
          'Use advanced French vocabulary and expressions',
          'Understand cultural nuances in French communication',
          'Develop fluency and confidence in French speaking'
        ],
        content: [
          'Advanced conversation topics',
          'Complex vocabulary and expressions',
          'Cultural communication patterns',
          'Fluency development techniques'
        ],
        activities: [
          'Complex conversation practice',
          'Cultural role-playing',
          'Vocabulary expansion exercises',
          'Fluency building activities'
        ],
        resources: [
          'Advanced French texts',
          'Cultural materials',
          'Audio recordings',
          'Conversation guides'
        ],
        assessment: [
          'Conversation assessment',
          'Vocabulary test',
          'Cultural understanding evaluation',
          'Portfolio review'
        ],
        duration: 45,
        prerequisites: ['Intermediate French skills'],
        keywords: ['conversation', 'vocabulary', 'culture', 'fluency']
      },
      // Level III - Social Studies - Term 1
      {
        id: 'social-level3-term1-week1',
        subjectId: 'social-studies-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Cameroon History - Independence and Modern Development',
        objectives: [
          'Understand Cameroon\'s independence struggle and achievement',
          'Learn about post-independence development',
          'Analyze historical events and their impact',
          'Develop national pride and historical awareness'
        ],
        content: [
          'Independence movement and leaders',
          'Post-independence development',
          'Historical analysis and interpretation',
          'National identity and pride'
        ],
        activities: [
          'Historical research projects',
          'Timeline creation',
          'Historical analysis discussions',
          'National pride activities'
        ],
        resources: [
          'Historical documents',
          'Timeline materials',
          'Research resources',
          'National symbols'
        ],
        assessment: [
          'Historical knowledge test',
          'Research project',
          'Timeline assessment',
          'Portfolio evaluation'
        ],
        duration: 45,
        prerequisites: ['Basic historical knowledge'],
        keywords: ['history', 'independence', 'development', 'national identity']
      },
      // Level III - Vocational Studies - Term 1
      {
        id: 'vocational-level3-term1-week1',
        subjectId: 'vocational-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Entrepreneurship and Business Skills',
        objectives: [
          'Understand basic business concepts and principles',
          'Develop entrepreneurial thinking and skills',
          'Learn about business planning and management',
          'Apply practical skills to business scenarios'
        ],
        content: [
          'Business concepts and principles',
          'Entrepreneurial thinking',
          'Business planning basics',
          'Practical business applications'
        ],
        activities: [
          'Business simulation exercises',
          'Entrepreneurial project planning',
          'Business case studies',
          'Practical business applications'
        ],
        resources: [
          'Business planning materials',
          'Case study resources',
          'Simulation tools',
          'Practical application materials'
        ],
        assessment: [
          'Business knowledge test',
          'Entrepreneurial project',
          'Business plan assessment',
          'Portfolio evaluation'
        ],
        duration: 45,
        prerequisites: ['Basic practical skills'],
        keywords: ['entrepreneurship', 'business', 'planning', 'management']
      },
      // Level III - Arts - Term 1
      {
        id: 'arts-level3-term1-week1',
        subjectId: 'arts-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Performing Arts - Advanced Dance and Music',
        objectives: [
          'Master advanced dance techniques and choreography',
          'Develop musical skills and performance abilities',
          'Understand cultural and artistic expression',
          'Create and perform original artistic works'
        ],
        content: [
          'Advanced dance techniques',
          'Musical performance skills',
          'Cultural artistic expression',
          'Original artistic creation'
        ],
        activities: [
          'Advanced dance practice',
          'Musical performance preparation',
          'Cultural artistic exploration',
          'Original work creation'
        ],
        resources: [
          'Dance and music equipment',
          'Cultural materials',
          'Performance spaces',
          'Artistic creation tools'
        ],
        assessment: [
          'Performance assessment',
          'Technical skill evaluation',
          'Cultural understanding test',
          'Portfolio review'
        ],
        duration: 45,
        prerequisites: ['Basic performing arts skills'],
        keywords: ['dance', 'music', 'performance', 'cultural expression']
      },
      // Level III - Physical Education and Sports - Term 1
      {
        id: 'pes-level3-term1-week1',
        subjectId: 'pes-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Advanced Athletics and Team Sports',
        objectives: [
          'Master advanced athletic techniques and skills',
          'Develop team work and leadership abilities',
          'Understand sports rules and strategies',
          'Participate in competitive and recreational sports'
        ],
        content: [
          'Advanced athletic techniques',
          'Team work and leadership',
          'Sports rules and strategies',
          'Competitive participation'
        ],
        activities: [
          'Advanced athletic training',
          'Team sports practice',
          'Leadership development',
          'Competitive participation'
        ],
        resources: [
          'Athletic equipment',
          'Sports facilities',
          'Training materials',
          'Competition resources'
        ],
        assessment: [
          'Athletic performance test',
          'Team work assessment',
          'Leadership evaluation',
          'Participation record'
        ],
        duration: 45,
        prerequisites: ['Basic physical education skills'],
        keywords: ['athletics', 'team sports', 'leadership', 'competition']
      },
      // Level III - National Languages and Cultures - Term 1
      {
        id: 'national-languages-level3-term1-week1',
        subjectId: 'national-languages-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Cultural Heritage and Traditional Values',
        objectives: [
          'Learn about Cameroonian cultural heritage',
          'Understand traditional values and customs',
          'Develop cultural identity and pride',
          'Appreciate cultural diversity and unity'
        ],
        content: [
          'Cultural heritage knowledge',
          'Traditional values and customs',
          'Cultural identity development',
          'Cultural diversity appreciation'
        ],
        activities: [
          'Cultural heritage exploration',
          'Traditional value discussions',
          'Cultural identity activities',
          'Diversity appreciation exercises'
        ],
        resources: [
          'Cultural materials',
          'Traditional artifacts',
          'Cultural stories and legends',
          'Diversity resources'
        ],
        assessment: [
          'Cultural knowledge test',
          'Traditional value assessment',
          'Cultural identity project',
          'Portfolio evaluation'
        ],
        duration: 45,
        prerequisites: ['Basic cultural awareness'],
        keywords: ['cultural heritage', 'traditional values', 'cultural identity', 'diversity']
      },
      // Level III - ICT - Term 1
      {
        id: 'ict-level3-term1-week1',
        subjectId: 'ict-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        topic: 'Advanced Computer Applications and Digital Citizenship',
        objectives: [
          'Master advanced computer applications and software',
          'Develop digital citizenship and ethical behavior',
          'Create and manage digital content and projects',
          'Understand technology\'s role in modern society'
        ],
        content: [
          'Advanced computer applications',
          'Digital citizenship principles',
          'Digital content creation',
          'Technology and society'
        ],
        activities: [
          'Advanced software practice',
          'Digital citizenship discussions',
          'Digital content creation',
          'Technology impact analysis'
        ],
        resources: [
          'Computer software',
          'Digital citizenship materials',
          'Content creation tools',
          'Technology resources'
        ],
        assessment: [
          'Software proficiency test',
          'Digital citizenship evaluation',
          'Content creation project',
          'Portfolio assessment'
        ],
        duration: 45,
        prerequisites: ['Basic ICT skills'],
        keywords: ['computer applications', 'digital citizenship', 'content creation', 'technology']
      }
    ],
    weeklyPlans: [
      {
        id: 'english-level1-week1-plan',
        subjectId: 'english-level-1',
        levelId: 'level-1',
        term: 1,
        week: 1,
        theme: 'Building Communication Skills',
        subThemes: ['Sentence Construction', 'Following Instructions', 'Basic Communication', 'Language Structure'],
        learningOutcomes: [
          'Students will construct simple sentences correctly',
          'Students will follow verbal instructions accurately',
          'Students will participate in basic conversations',
          'Students will understand sentence structure'
        ],
        crossCurricularLinks: [
          'Mathematics: Following step-by-step instructions',
          'Science: Describing observations in sentences',
          'Arts: Creating sentences about artwork'
        ],
        differentiation: [
          'Advanced learners: Complex sentence construction',
          'Struggling learners: Simple two-word sentences',
          'Visual learners: Picture-based sentence building'
        ],
        homework: [
          'Practice sentence construction at home',
          'Follow simple instructions from parents',
          'Create sentences about daily activities'
        ],
        notes: 'Focus on building confidence in communication. Use lots of positive reinforcement and peer support.',
        schemeOfWorkId: 'english-level1-term1-week1'
      },
      {
        id: 'math-level1-week1-plan',
        subjectId: 'mathematics-level-1',
        levelId: 'level-1',
        term: 1,
        week: 1,
        theme: 'Number Foundation',
        subThemes: ['Number Recognition', 'Counting Skills', 'Number Value', 'Mathematical Thinking'],
        learningOutcomes: [
          'Students will recognize numbers 0-10',
          'Students will count objects accurately',
          'Students will understand number value',
          'Students will develop number sense'
        ],
        crossCurricularLinks: [
          'English: Number words and counting songs',
          'Science: Counting objects in experiments',
          'Arts: Number art and crafts'
        ],
        differentiation: [
          'Advanced learners: Numbers beyond 10',
          'Struggling learners: Focus on 0-5 first',
          'Kinesthetic learners: Hands-on counting activities'
        ],
        homework: [
          'Count objects at home',
          'Practice number writing',
          'Find numbers in the environment'
        ],
        notes: 'Use concrete objects for counting. Ensure all students understand one-to-one correspondence.',
        schemeOfWorkId: 'math-level1-term1-week1'
      },
      {
        id: 'science-level1-week1-plan',
        subjectId: 'science-level-1',
        levelId: 'level-1',
        term: 1,
        week: 1,
        theme: 'Understanding Our Bodies',
        subThemes: ['Body Parts', 'Body Functions', 'Personal Hygiene', 'Health Awareness'],
        learningOutcomes: [
          'Students will identify major body parts',
          'Students will understand basic body functions',
          'Students will practice good hygiene habits',
          'Students will develop health awareness'
        ],
        crossCurricularLinks: [
          'English: Body parts vocabulary',
          'Mathematics: Counting body parts',
          'Arts: Drawing and labeling body parts'
        ],
        differentiation: [
          'Advanced learners: Internal body systems',
          'Struggling learners: Focus on external body parts',
          'Visual learners: Body parts charts and models'
        ],
        homework: [
          'Practice hygiene routines at home',
          'Identify body parts with family',
          'Draw and label body parts'
        ],
        notes: 'Emphasize the importance of hygiene and health. Use age-appropriate language and examples.',
        schemeOfWorkId: 'science-level1-term1-week1'
      },
      {
        id: 'english-level2-week1-plan',
        subjectId: 'english-level-2',
        levelId: 'level-2',
        term: 1,
        week: 1,
        theme: 'Advanced Reading Skills',
        subThemes: ['Text Comprehension', 'Reading Strategies', 'Critical Thinking', 'Fluency Development'],
        learningOutcomes: [
          'Students will read and understand grade-level texts',
          'Students will answer comprehension questions accurately',
          'Students will identify main ideas in texts',
          'Students will read with improved fluency'
        ],
        crossCurricularLinks: [
          'Social Studies: Reading about communities',
          'Science: Reading informational texts',
          'Mathematics: Reading word problems'
        ],
        differentiation: [
          'Advanced learners: Complex texts and analysis',
          'Struggling learners: Simplified texts with support',
          'Auditory learners: Read-aloud sessions'
        ],
        homework: [
          'Read assigned texts at home',
          'Practice comprehension questions',
          'Read aloud to family members'
        ],
        notes: 'Focus on building reading confidence and comprehension skills. Provide various text types.',
        schemeOfWorkId: 'english-level2-term1-week1'
      },
      {
        id: 'math-level3-week1-plan',
        subjectId: 'mathematics-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        theme: 'Understanding Fractions',
        subThemes: ['Fraction Concepts', 'Visual Representation', 'Fraction Comparison', 'Problem Solving'],
        learningOutcomes: [
          'Students will understand what fractions represent',
          'Students will identify numerator and denominator',
          'Students will compare simple fractions',
          'Students will solve basic fraction problems'
        ],
        crossCurricularLinks: [
          'Science: Measuring and dividing materials',
          'Arts: Fraction art projects',
          'English: Fraction vocabulary and word problems'
        ],
        differentiation: [
          'Advanced learners: Complex fraction operations',
          'Struggling learners: Visual fraction models only',
          'Kinesthetic learners: Fraction manipulatives'
        ],
        homework: [
          'Practice fraction problems at home',
          'Find fractions in everyday life',
          'Create fraction art projects'
        ],
        notes: 'Use visual models extensively. Ensure students understand the concept before moving to operations.',
        schemeOfWorkId: 'math-level3-term1-week1'
      },
      {
        id: 'english-level3-week1-plan',
        subjectId: 'english-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        theme: 'Advanced Literary Analysis',
        subThemes: ['Text Analysis', 'Literary Devices', 'Critical Thinking', 'Composition Skills'],
        learningOutcomes: [
          'Students will analyze complex texts for main ideas and supporting details',
          'Students will identify and explain literary devices and techniques',
          'Students will make inferences and draw conclusions from texts',
          'Students will develop critical thinking and analytical skills'
        ],
        crossCurricularLinks: [
          'Social Studies: Analyzing historical texts and documents',
          'Science: Reading and analyzing scientific articles',
          'Mathematics: Interpreting data and statistics in texts'
        ],
        differentiation: [
          'Advanced learners: Complex literary analysis and original composition',
          'Struggling learners: Simplified texts with guided analysis',
          'Visual learners: Graphic organizers and visual analysis tools'
        ],
        homework: [
          'Read assigned complex texts and prepare analysis',
          'Practice identifying literary devices in various texts',
          'Complete critical thinking exercises'
        ],
        notes: 'Focus on building analytical skills and critical thinking. Encourage discussion and debate.',
        schemeOfWorkId: 'english-level3-term1-week1'
      },
      {
        id: 'math-level3-week1-plan',
        subjectId: 'mathematics-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        theme: 'Advanced Mathematical Operations',
        subThemes: ['Fraction Operations', 'Decimal Calculations', 'Percentage Problems', 'Real-World Applications'],
        learningOutcomes: [
          'Students will master fraction and decimal operations',
          'Students will convert between fractions, decimals, and percentages',
          'Students will solve complex word problems involving fractions and decimals',
          'Students will apply mathematical concepts to real-world situations'
        ],
        crossCurricularLinks: [
          'Science: Calculating percentages in experiments and data analysis',
          'Social Studies: Understanding statistics and data in historical contexts',
          'English: Reading and interpreting word problems and mathematical texts'
        ],
        differentiation: [
          'Advanced learners: Complex multi-step problems and real-world applications',
          'Struggling learners: Step-by-step guided practice with visual aids',
          'Kinesthetic learners: Hands-on manipulatives and practical applications'
        ],
        homework: [
          'Practice fraction and decimal operations with real-world examples',
          'Complete word problem solving exercises',
          'Research and solve mathematical problems from daily life'
        ],
        notes: 'Emphasize real-world applications and problem-solving strategies. Use manipulatives for visual learners.',
        schemeOfWorkId: 'math-level3-term1-week1'
      },
      {
        id: 'science-level3-week1-plan',
        subjectId: 'science-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        theme: 'Environmental Science and Conservation',
        subThemes: ['Ecosystems', 'Biodiversity', 'Conservation', 'Sustainability'],
        learningOutcomes: [
          'Students will understand ecosystem components and interactions',
          'Students will learn about environmental conservation principles',
          'Students will investigate human impact on the environment',
          'Students will develop environmental awareness and responsibility'
        ],
        crossCurricularLinks: [
          'Social Studies: Understanding environmental policies and conservation efforts',
          'Mathematics: Analyzing environmental data and statistics',
          'English: Reading and writing about environmental issues'
        ],
        differentiation: [
          'Advanced learners: Independent research projects and environmental impact assessments',
          'Struggling learners: Guided exploration with simplified concepts',
          'Visual learners: Diagrams, charts, and visual representations of ecosystems'
        ],
        homework: [
          'Research local environmental issues and conservation efforts',
          'Create a personal environmental action plan',
          'Observe and document local ecosystem components'
        ],
        notes: 'Emphasize hands-on learning and real-world environmental connections. Encourage student activism.',
        schemeOfWorkId: 'science-level3-term1-week1'
      },
      {
        id: 'french-level3-week1-plan',
        subjectId: 'french-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        theme: 'Advanced French Communication',
        subThemes: ['Complex Conversations', 'Advanced Vocabulary', 'Cultural Communication', 'Fluency Development'],
        learningOutcomes: [
          'Students will engage in complex French conversations',
          'Students will use advanced French vocabulary and expressions',
          'Students will understand cultural nuances in French communication',
          'Students will develop fluency and confidence in French speaking'
        ],
        crossCurricularLinks: [
          'Social Studies: Learning about French-speaking cultures and countries',
          'Arts: Exploring French art, music, and literature',
          'History: Understanding French historical and cultural influences'
        ],
        differentiation: [
          'Advanced learners: Complex cultural discussions and original compositions',
          'Struggling learners: Structured conversation practice with support',
          'Auditory learners: Audio recordings and listening comprehension exercises'
        ],
        homework: [
          'Practice French conversations with family and friends',
          'Listen to French audio materials and practice pronunciation',
          'Research French culture and traditions'
        ],
        notes: 'Focus on cultural understanding and authentic communication. Use multimedia resources extensively.',
        schemeOfWorkId: 'french-level3-term1-week1'
      },
      {
        id: 'social-level3-week1-plan',
        subjectId: 'social-studies-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        theme: 'Cameroon History and National Identity',
        subThemes: ['Independence Movement', 'Post-Independence Development', 'National Identity', 'Historical Analysis'],
        learningOutcomes: [
          'Students will understand Cameroon\'s independence struggle and achievement',
          'Students will learn about post-independence development',
          'Students will analyze historical events and their impact',
          'Students will develop national pride and historical awareness'
        ],
        crossCurricularLinks: [
          'English: Reading and analyzing historical documents and texts',
          'Arts: Exploring historical art and cultural expressions',
          'Mathematics: Understanding historical timelines and data'
        ],
        differentiation: [
          'Advanced learners: Independent research projects and historical analysis',
          'Struggling learners: Guided exploration with simplified historical concepts',
          'Visual learners: Timelines, maps, and visual historical materials'
        ],
        homework: [
          'Research family history and connections to national events',
          'Create a timeline of important historical events',
          'Interview family members about historical experiences'
        ],
        notes: 'Emphasize personal connections to history and national pride. Use local resources and oral history.',
        schemeOfWorkId: 'social-level3-term1-week1'
      },
      {
        id: 'vocational-level3-week1-plan',
        subjectId: 'vocational-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        theme: 'Entrepreneurship and Business Development',
        subThemes: ['Business Concepts', 'Entrepreneurial Thinking', 'Business Planning', 'Practical Applications'],
        learningOutcomes: [
          'Students will understand basic business concepts and principles',
          'Students will develop entrepreneurial thinking and skills',
          'Students will learn about business planning and management',
          'Students will apply practical skills to business scenarios'
        ],
        crossCurricularLinks: [
          'Mathematics: Business calculations, budgeting, and financial planning',
          'English: Business communication and presentation skills',
          'Social Studies: Understanding economic systems and market dynamics'
        ],
        differentiation: [
          'Advanced learners: Complex business projects and real-world applications',
          'Struggling learners: Simplified business concepts with guided practice',
          'Kinesthetic learners: Hands-on business simulations and practical activities'
        ],
        homework: [
          'Research local businesses and their operations',
          'Develop a simple business idea and basic plan',
          'Practice business communication skills'
        ],
        notes: 'Focus on practical applications and real-world business scenarios. Encourage creativity and innovation.',
        schemeOfWorkId: 'vocational-level3-term1-week1'
      },
      {
        id: 'arts-level3-week1-plan',
        subjectId: 'arts-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        theme: 'Advanced Performing Arts',
        subThemes: ['Dance Techniques', 'Musical Performance', 'Cultural Expression', 'Original Creation'],
        learningOutcomes: [
          'Students will master advanced dance techniques and choreography',
          'Students will develop musical skills and performance abilities',
          'Students will understand cultural and artistic expression',
          'Students will create and perform original artistic works'
        ],
        crossCurricularLinks: [
          'Social Studies: Understanding cultural traditions and artistic heritage',
          'English: Reading and interpreting artistic texts and performances',
          'History: Exploring historical artistic movements and traditions'
        ],
        differentiation: [
          'Advanced learners: Complex choreography and original composition',
          'Struggling learners: Simplified techniques with guided practice',
          'Visual learners: Visual demonstrations and artistic representations'
        ],
        homework: [
          'Practice dance and musical techniques at home',
          'Research cultural artistic traditions',
          'Create original artistic works'
        ],
        notes: 'Emphasize cultural expression and creativity. Encourage performance and artistic confidence.',
        schemeOfWorkId: 'arts-level3-term1-week1'
      },
      {
        id: 'pes-level3-week1-plan',
        subjectId: 'pes-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        theme: 'Advanced Athletics and Team Sports',
        subThemes: ['Athletic Techniques', 'Team Work', 'Leadership', 'Competitive Sports'],
        learningOutcomes: [
          'Students will master advanced athletic techniques and skills',
          'Students will develop team work and leadership abilities',
          'Students will understand sports rules and strategies',
          'Students will participate in competitive and recreational sports'
        ],
        crossCurricularLinks: [
          'Mathematics: Understanding sports statistics and measurements',
          'Science: Learning about human body and physical fitness',
          'Social Studies: Understanding sports culture and teamwork'
        ],
        differentiation: [
          'Advanced learners: Complex athletic techniques and leadership roles',
          'Struggling learners: Basic techniques with guided practice',
          'Kinesthetic learners: Hands-on practice and physical activities'
        ],
        homework: [
          'Practice athletic techniques and exercises at home',
          'Research sports rules and strategies',
          'Participate in physical activities outside of school'
        ],
        notes: 'Focus on teamwork, leadership, and sportsmanship. Encourage healthy competition and physical fitness.',
        schemeOfWorkId: 'pes-level3-term1-week1'
      },
      {
        id: 'national-languages-level3-week1-plan',
        subjectId: 'national-languages-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        theme: 'Cultural Heritage and Identity',
        subThemes: ['Cultural Heritage', 'Traditional Values', 'Cultural Identity', 'Diversity Appreciation'],
        learningOutcomes: [
          'Students will learn about Cameroonian cultural heritage',
          'Students will understand traditional values and customs',
          'Students will develop cultural identity and pride',
          'Students will appreciate cultural diversity and unity'
        ],
        crossCurricularLinks: [
          'Social Studies: Understanding cultural diversity and national unity',
          'Arts: Exploring traditional art forms and cultural expressions',
          'English: Reading and writing about cultural traditions'
        ],
        differentiation: [
          'Advanced learners: Independent cultural research and presentations',
          'Struggling learners: Guided cultural exploration with support',
          'Visual learners: Cultural artifacts, images, and visual materials'
        ],
        homework: [
          'Research family cultural traditions and heritage',
          'Learn about different cultural groups in Cameroon',
          'Practice traditional cultural expressions and languages'
        ],
        notes: 'Emphasize cultural pride and diversity appreciation. Use local cultural resources and community involvement.',
        schemeOfWorkId: 'national-languages-level3-term1-week1'
      },
      {
        id: 'ict-level3-week1-plan',
        subjectId: 'ict-level-3',
        levelId: 'level-3',
        term: 1,
        week: 1,
        theme: 'Advanced Digital Skills and Citizenship',
        subThemes: ['Computer Applications', 'Digital Citizenship', 'Content Creation', 'Technology and Society'],
        learningOutcomes: [
          'Students will master advanced computer applications and software',
          'Students will develop digital citizenship and ethical behavior',
          'Students will create and manage digital content and projects',
          'Students will understand technology\'s role in modern society'
        ],
        crossCurricularLinks: [
          'Mathematics: Using technology for calculations and data analysis',
          'English: Digital communication and content creation',
          'Science: Using technology for scientific research and analysis'
        ],
        differentiation: [
          'Advanced learners: Complex digital projects and advanced software',
          'Struggling learners: Basic computer skills with guided practice',
          'Visual learners: Visual software and multimedia content creation'
        ],
        homework: [
          'Practice computer skills and software applications at home',
          'Research digital citizenship and online safety',
          'Create digital content and projects'
        ],
        notes: 'Focus on responsible technology use and digital citizenship. Emphasize creativity and innovation.',
        schemeOfWorkId: 'ict-level3-term1-week1'
      }
    ]
  };

  const getSubjectsByLevel = (levelId: string): CurriculumSubject[] => {
    const level = curriculumData.levels.find(l => l.id === levelId);
    return level ? level.subjects : [];
  };

  const getSchemeOfWork = (subjectId: string, levelId: string, term: number, week: number): SchemeOfWork | undefined => {
    return curriculumData.schemesOfWork.find(
      scheme => scheme.subjectId === subjectId && 
                scheme.levelId === levelId && 
                scheme.term === term && 
                scheme.week === week
    );
  };

  const getWeeklyPlan = (subjectId: string, levelId: string, term: number, week: number): WeeklyPlan | undefined => {
    return curriculumData.weeklyPlans.find(
      plan => plan.subjectId === subjectId && 
              plan.levelId === levelId && 
              plan.term === term && 
              plan.week === week
    );
  };

  const getSchemesForSubject = (subjectId: string, levelId: string): SchemeOfWork[] => {
    return curriculumData.schemesOfWork.filter(
      scheme => scheme.subjectId === subjectId && scheme.levelId === levelId
    );
  };

  const getWeeklyPlansForSubject = (subjectId: string, levelId: string): WeeklyPlan[] => {
    return curriculumData.weeklyPlans.filter(
      plan => plan.subjectId === subjectId && plan.levelId === levelId
    );
  };

  const getLevels = (): CurriculumLevel[] => {
    return curriculumData.levels;
  };

  const getSubjects = (): CurriculumSubject[] => {
    return curriculumData.levels.flatMap(level => level.subjects);
  };

  const value: AnglophoneCurriculumContextType = {
    curriculumData,
    getSubjectsByLevel,
    getSchemeOfWork,
    getWeeklyPlan,
    getSchemesForSubject,
    getWeeklyPlansForSubject,
    getLevels,
    getSubjects,
  };

  return (
    <AnglophoneCurriculumContext.Provider value={value}>
      {children}
    </AnglophoneCurriculumContext.Provider>
  );
};

export const useAnglophoneCurriculum = (): AnglophoneCurriculumContextType => {
  const context = useContext(AnglophoneCurriculumContext);
  if (context === undefined) {
    throw new Error('useAnglophoneCurriculum must be used within an AnglophoneCurriculumProvider');
  }
  return context;
};

export default AnglophoneCurriculumContext;
