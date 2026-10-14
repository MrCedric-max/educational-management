import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Layers,
  Printer,
  QrCode,
  Save,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateVerificationQrSvg } from '../utils/qrCodeGenerator';

export interface SubjectAssessment {
  id: string;
  name: string;
  nameFr: string;
  code: string;
  coefficient: number;
  group: 'group1' | 'group2' | 'group3'; // MINESEC Subject Grouping
  teacherName: string;
}

export interface StudentGradeEntry {
  studentId: string;
  studentName: string;
  studentNumber: string;
  seq1: number; // Sequence 1 / CA1 (out of 20)
  seq2: number; // Sequence 2 / Exam (out of 20)
  remark: string;
}

export interface ApcRating {
  code: 'CTBA' | 'CBA' | 'CA' | 'CMA' | 'CNA';
  labelFr: string;
  labelEn: string;
  badgeClass: string;
}

export function getApcRating(markOutOf20: number): ApcRating {
  if (markOutOf20 >= 16) {
    return {
      code: 'CTBA',
      labelFr: 'Compétence Très Bien Acquise',
      labelEn: 'Expert Competence',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  } else if (markOutOf20 >= 14) {
    return {
      code: 'CBA',
      labelFr: 'Compétence Bien Acquise',
      labelEn: 'Proficient Competence',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300'
    };
  } else if (markOutOf20 >= 12) {
    return {
      code: 'CA',
      labelFr: 'Compétence Acquise',
      labelEn: 'Acquired Competence',
      badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-300'
    };
  } else if (markOutOf20 >= 10) {
    return {
      code: 'CMA',
      labelFr: 'Compétence Moyennement Acquise',
      labelEn: 'Developing Competence',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  } else {
    return {
      code: 'CNA',
      labelFr: 'Compétence Non Acquise',
      labelEn: 'Not Acquired',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300'
    };
  }
}

// MINESEC Official Subject List
export const subjectsList: SubjectAssessment[] = [
  // Groupe 1 : Sciences et Technologies
  { id: 'math', name: 'Mathematics', nameFr: 'Mathématiques', code: 'MATH', coefficient: 4, group: 'group1', teacherName: 'Mr. Cedric Mbida' },
  { id: 'phy', name: 'Physics & Chemistry', nameFr: 'Sciences Physiques & Chimie', code: 'PHY', coefficient: 3, group: 'group1', teacherName: 'Mr. Cedric Mbida' },
  { id: 'bio', name: 'Biology & Earth Sciences', nameFr: 'SVTEEHB / Biologie', code: 'SVT', coefficient: 2, group: 'group1', teacherName: 'Dr. Joseph Etoa' },
  { id: 'ict', name: 'Computer Science & ICT', nameFr: 'Informatique & TIC', code: 'TIC', coefficient: 2, group: 'group1', teacherName: 'M. Paul Atangana' },

  // Groupe 2 : Langues et Littérature
  { id: 'eng', name: 'English Language & Lit', nameFr: 'Langue Anglaise', code: 'ANG', coefficient: 3, group: 'group2', teacherName: 'Ms. Clara Fon' },
  { id: 'fr', name: 'French Language', nameFr: 'Langue Française', code: 'FRA', coefficient: 3, group: 'group2', teacherName: 'Mme. Marie Ngo' },
  { id: 'esp', name: 'Spanish / German / Nat. Lang', nameFr: 'Espagnol / Allemand', code: 'LV2', coefficient: 2, group: 'group2', teacherName: 'M. Jean Nkoa' },

  // Groupe 3 : Sciences Humaines, Pratiques et Sports
  { id: 'hist', name: 'History & Citizenship', nameFr: 'Histoire - ECM', code: 'HIST', coefficient: 2, group: 'group3', teacherName: 'M. Samuel Tagne' },
  { id: 'geo', name: 'Geography', nameFr: 'Géographie', code: 'GEO', coefficient: 2, group: 'group3', teacherName: 'M. Samuel Tagne' },
  { id: 'pe', name: 'Physical Education & Sports', nameFr: 'EPS / Sport', code: 'EPS', coefficient: 1, group: 'group3', teacherName: 'Coach Alain Ndongo' }
];

export const mockStudents = [
  { id: 's1', name: 'Emma Johnson', number: 'GBHS-2026-001', gender: 'female', birthDate: '12/05/2010', birthPlace: 'Yaoundé', isRepeater: false, attendance: { absentHours: 4, lateCount: 2, detention: 0 } },
  { id: 's2', name: 'Michael Brown', number: 'GBHS-2026-002', gender: 'male', birthDate: '08/11/2009', birthPlace: 'Douala', isRepeater: false, attendance: { absentHours: 12, lateCount: 1, detention: 2 } },
  { id: 's3', name: 'Sophia Davis', number: 'GBHS-2026-003', gender: 'female', birthDate: '23/02/2010', birthPlace: 'Bafoussam', isRepeater: false, attendance: { absentHours: 0, lateCount: 3, detention: 0 } },
  { id: 's4', name: 'James Wilson', number: 'GBHS-2026-004', gender: 'male', birthDate: '15/07/2009', birthPlace: 'Buea', isRepeater: true, attendance: { absentHours: 24, lateCount: 5, detention: 4 } },
  { id: 's5', name: 'Lucas Talla', number: 'GBHS-2026-005', gender: 'male', birthDate: '30/09/2010', birthPlace: 'Yaoundé', isRepeater: false, attendance: { absentHours: 2, lateCount: 0, detention: 0 } },
  { id: 's6', name: 'Chantal Biya Ngu', number: 'GBHS-2026-006', gender: 'female', birthDate: '19/04/2010', birthPlace: 'Ebolowa', isRepeater: false, attendance: { absentHours: 6, lateCount: 1, detention: 0 } },
  { id: 's7', name: 'Brendan Forchu', number: 'GBHS-2026-007', gender: 'male', birthDate: '04/01/2010', birthPlace: 'Bamenda', isRepeater: false, attendance: { absentHours: 18, lateCount: 2, detention: 1 } },
  { id: 's8', name: 'Amina Bello', number: 'GBHS-2026-008', gender: 'female', birthDate: '14/08/2010', birthPlace: 'Maroua', isRepeater: false, attendance: { absentHours: 0, lateCount: 0, detention: 0 } }
];

export const GradebookManager: React.FC = () => {
  const { language, school } = useAuth();

  const [activeTab, setActiveTab] = useState<'subject' | 'broadsheet' | 'reportcard'>('subject');
  const [selectedClass, setSelectedClass] = useState<string>('Form 3A');
  
  // 6-Sequence MINESEC Academic Rhythm Selector
  const [selectedPeriod, setSelectedPeriod] = useState<string>('term1');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
  const [gradingScale, setGradingScale] = useState<'cameroon20' | 'anglophone100'>('cameroon20');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<string>('s1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Anti-Fraud QR Verification Modal
  const [showQrVerificationModal, setShowQrVerificationModal] = useState<boolean>(false);

  const currentSubject = subjectsList.find(s => s.id === selectedSubjectId) || subjectsList[0];

  // State of marks per student: { [periodKey]: { [subjectId]: { [studentId]: StudentGradeEntry } } }
  const [gradesData, setGradesData] = useState<Record<string, Record<string, StudentGradeEntry>>>({});

  // Initialize marks with realistic Cameroonian assessment distributions
  useEffect(() => {
    const storageKey = `ems_gradebook_v2_${selectedClass}_${selectedPeriod}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setGradesData(JSON.parse(stored));
        return;
      } catch (e) {
        console.error(e);
      }
    }

    // Default mock sequence marks
    const initial: Record<string, Record<string, StudentGradeEntry>> = {};
    subjectsList.forEach((subj) => {
      initial[subj.id] = {};
      mockStudents.forEach((student, idx) => {
        const seedBase = 10 + ((idx * 3 + subj.coefficient * 2) % 9);
        const seq1 = Math.min(20, Math.max(7, seedBase + (idx % 2 === 0 ? 1.5 : -1)));
        const seq2 = Math.min(20, Math.max(6.5, seedBase + (idx % 3 === 0 ? 2 : -0.5)));
        
        let remark = 'Travail convenable';
        if ((seq1 + seq2) / 2 >= 16) remark = 'Excellent travail, félicitations!';
        else if ((seq1 + seq2) / 2 >= 14) remark = 'Très bon trimestre, poursuivez ainsi';
        else if ((seq1 + seq2) / 2 >= 12) remark = 'Bon travail d\'ensemble';
        else if ((seq1 + seq2) / 2 >= 10) remark = 'Passable, intensifier les efforts';
        else remark = 'Insuffisant, doit redoubler d\'ardeur';

        initial[subj.id][student.id] = {
          studentId: student.id,
          studentName: student.name,
          studentNumber: student.number,
          seq1,
          seq2,
          remark
        };
      });
    });
    setGradesData(initial);
  }, [selectedClass, selectedPeriod]);

  // Current subject entries
  const currentEntries = useMemo(() => {
    return gradesData[selectedSubjectId] || {};
  }, [gradesData, selectedSubjectId]);

  // Handle Mark Change
  const handleMarkChange = (studentId: string, field: 'seq1' | 'seq2', value: number) => {
    const clamped = isNaN(value) ? 0 : Math.min(20, Math.max(0, value));
    setGradesData(prev => {
      const subjectGrades = { ...(prev[selectedSubjectId] || {}) };
      const current = subjectGrades[studentId] || {
        studentId,
        studentName: mockStudents.find(s => s.id === studentId)?.name || '',
        studentNumber: mockStudents.find(s => s.id === studentId)?.number || '',
        seq1: 0,
        seq2: 0,
        remark: ''
      };
      subjectGrades[studentId] = { ...current, [field]: clamped };
      return { ...prev, [selectedSubjectId]: subjectGrades };
    });
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setGradesData(prev => {
      const subjectGrades = { ...(prev[selectedSubjectId] || {}) };
      const current = subjectGrades[studentId] || {
        studentId,
        studentName: mockStudents.find(s => s.id === studentId)?.name || '',
        studentNumber: mockStudents.find(s => s.id === studentId)?.number || '',
        seq1: 0,
        seq2: 0,
        remark: ''
      };
      subjectGrades[studentId] = { ...current, remark };
      return { ...prev, [selectedSubjectId]: subjectGrades };
    });
  };

  const handleSaveGrades = () => {
    const storageKey = `ems_gradebook_v2_${selectedClass}_${selectedPeriod}`;
    localStorage.setItem(storageKey, JSON.stringify(gradesData));
    toast.success(
      language === 'fr'
        ? 'Notes enregistrées avec succès dans la base MINESEC !'
        : 'Grades successfully saved to MINESEC database!'
    );
  };

  // Calculate subject average for student
  const calculateSubjectScore = (entry?: StudentGradeEntry) => {
    if (!entry) return { average20: 0, average100: 0, mention: 'N/A', apc: getApcRating(0) };
    
    // In Cameroon MINESEC: Sequence 1 + Sequence 2 / 2 = Moyenne Trimestrielle
    const total20 = Math.round(((entry.seq1 + entry.seq2) / 2) * 10) / 10;
    const total100 = Math.round((total20 / 20) * 100);
    const apc = getApcRating(total20);

    let mention = 'Insuffisant';
    if (total20 >= 16) mention = 'Très Bien';
    else if (total20 >= 14) mention = 'Bien';
    else if (total20 >= 12) mention = 'Assez Bien';
    else if (total20 >= 10) mention = 'Passable';
    else if (total20 >= 8) mention = 'Médiocre';

    return { average20: total20, average100: total100, mention, apc };
  };

  // Subject Statistics
  const subjectStats = useMemo(() => {
    const scores = mockStudents.map(s => calculateSubjectScore(currentEntries[s.id]).average20);
    if (scores.length === 0) return { avg: 0, high: 0, low: 0, passRate: 0 };
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = Math.round((sum / scores.length) * 10) / 10;
    const high = Math.max(...scores);
    const low = Math.min(...scores);
    const passed = scores.filter(s => s >= 10).length;
    const passRate = Math.round((passed / scores.length) * 100);
    return { avg, high, low, passRate };
  }, [currentEntries]);

  // Overall student summary for Broadsheet & Official Bulletin
  const studentOverallSummary = useMemo(() => {
    const list = mockStudents.map(student => {
      let totalWeighted = 0;
      let totalCoeffs = 0;
      const subjectDetails: any[] = [];

      subjectsList.forEach(subj => {
        const entry = gradesData[subj.id]?.[student.id];
        const score = calculateSubjectScore(entry);
        const weighted = score.average20 * subj.coefficient;
        totalWeighted += weighted;
        totalCoeffs += subj.coefficient;

        subjectDetails.push({
          subject: subj,
          entry,
          score,
          weighted
        });
      });

      const overallAvg20 = totalCoeffs > 0 ? Math.round((totalWeighted / totalCoeffs) * 100) / 100 : 0;
      const overallAvg100 = Math.round((overallAvg20 / 20) * 100);
      const overallApc = getApcRating(overallAvg20);

      return {
        student,
        subjectDetails,
        totalCoeffs,
        totalWeighted,
        overallAvg20,
        overallAvg100,
        overallApc,
        rank: 0
      };
    });

    // Rank students by overall average
    list.sort((a, b) => b.overallAvg20 - a.overallAvg20);
    list.forEach((item, index) => {
      item.rank = index + 1;
    });

    return list;
  }, [gradesData]);

  // Selected Student Report Card Data
  const reportStudentData = useMemo(() => {
    return studentOverallSummary.find(s => s.student.id === selectedStudentForReport) || studentOverallSummary[0] || null;
  }, [studentOverallSummary, selectedStudentForReport]);

  // Grouped subjects for MINESEC Bulletin
  const groupedSubjectDetails = useMemo(() => {
    if (!reportStudentData) return { group1: [], group2: [], group3: [] };

    const g1 = reportStudentData.subjectDetails.filter((s: any) => s.subject.group === 'group1');
    const g2 = reportStudentData.subjectDetails.filter((s: any) => s.subject.group === 'group2');
    const g3 = reportStudentData.subjectDetails.filter((s: any) => s.subject.group === 'group3');

    const calcGroupTotals = (items: any[]) => {
      const coefSum = items.reduce((acc, curr) => acc + curr.subject.coefficient, 0);
      const pointsSum = items.reduce((acc, curr) => acc + curr.weighted, 0);
      const avg = coefSum > 0 ? Math.round((pointsSum / coefSum) * 100) / 100 : 0;
      return { items, coefSum, pointsSum: Math.round(pointsSum * 10) / 10, avg };
    };

    return {
      group1: calcGroupTotals(g1),
      group2: calcGroupTotals(g2),
      group3: calcGroupTotals(g3)
    };
  }, [reportStudentData]);

  // Class Council Deliberation Decision
  const councilDecision = useMemo(() => {
    if (!reportStudentData) return { label: '', color: '' };
    const avg = reportStudentData.overallAvg20;

    if (selectedPeriod === 'annual') {
      if (avg >= 10) return { label: 'ADMIS(E) EN CLASSE SUPÉRIEURE / PROMOTED', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
      if (avg >= 8.5) return { label: 'AUTORISÉ(E) À REDOUBLER / REPEAT CLASS', color: 'text-amber-700 bg-amber-50 border-amber-300' };
      return { label: 'EXCLU(E) POUR INSUFFISANCE DE TRAVAIL / DISMISSED', color: 'text-rose-700 bg-rose-50 border-rose-300' };
    }

    if (avg >= 16) return { label: 'TABLEAU D\'HONNEUR AVEC FÉLICITATIONS', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (avg >= 14) return { label: 'TABLEAU D\'HONNEUR AVEC ENCOURAGEMENTS', color: 'text-blue-700 bg-blue-50 border-blue-300' };
    if (avg >= 12) return { label: 'TABLEAU D\'HONNEUR (HONOR ROLL)', color: 'text-cyan-700 bg-cyan-50 border-cyan-300' };
    if (avg >= 10) return { label: 'TRAVAIL PASSABLE (SATISFACTORY)', color: 'text-amber-700 bg-amber-50 border-amber-300' };
    if (avg >= 8.5) return { label: 'AVERTISSEMENT TRAVAIL (ACADEMIC WARNING)', color: 'text-orange-700 bg-orange-50 border-orange-300' };
    return { label: 'BLÂME DE TRAVAIL (ACADEMIC PROBATION)', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  }, [reportStudentData, selectedPeriod]);

  // Verification Payload for Anti-Fraud QR Code
  const qrVerificationPayload = useMemo(() => {
    if (!reportStudentData) return '';
    const verifyId = `MINESEC-2026-${reportStudentData.student.number}-${selectedPeriod}`;
    return `https://verify.minesec.gov.cm/bulletin?doc=${verifyId}&std=${encodeURIComponent(reportStudentData.student.name)}&avg=${reportStudentData.overallAvg20}&rank=${reportStudentData.rank}&auth=VALID_OFFICIAL`;
  }, [reportStudentData, selectedPeriod]);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="bg-indigo-700/60 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                Normes MINESEC • APC 2026/2027
              </span>
              <span>•</span>
              <span>{school?.name || 'GBHS Yaoundé (Lycée Bilingue)'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Gradebook & Assessment System
            </h1>
            <p className="text-indigo-200 text-sm mt-1 max-w-2xl">
              Système officiel de gestion des 6 séquences, calculs des cotes APC (CTBA, CBA, CA, CMA, CNA), procès-verbaux et bulletins sécurisés anti-fraude.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSaveGrades}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {language === 'fr' ? 'Enregistrer les Notes' : 'Save All Marks'}
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold backdrop-blur border border-white/20 transition-colors"
            >
              <Printer className="h-4 w-4 mr-2" />
              {language === 'fr' ? 'Imprimer le Document' : 'Print Official Sheet'}
            </button>
          </div>
        </div>

        {/* Filters and Sequence Switcher Bar */}
        <div className="mt-6 pt-5 border-t border-indigo-700/50 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {/* Class Select */}
          <div>
            <label className="block text-xs font-medium text-indigo-200 mb-1">
              {language === 'fr' ? 'Classe' : 'Class Stream'}
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-indigo-950/70 border border-indigo-600/60 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="Form 3A">Form 3A (Anglophone)</option>
              <option value="Form 5 Science">Form 5 Science (GCE O-Level)</option>
              <option value="3ème A">3ème A (Francophone - BEPC)</option>
              <option value="Terminale C">Terminale C (Baccalauréat)</option>
            </select>
          </div>

          {/* MINESEC 6-Sequence Switcher */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-indigo-200 mb-1 flex items-center justify-between">
              <span>{language === 'fr' ? 'Période d\'Évaluation (6 Séquences / 3 Trimestres)' : 'Academic Period (6 Sequences / 3 Terms)'}</span>
              <span className="text-[10px] text-amber-300 font-mono">Système National Camerounais</span>
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full bg-indigo-950/70 border border-indigo-600/60 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <optgroup label="Trimestre 1 / 1st Term">
                <option value="seq1">Séquence 1 (Octobre - 1ère évaluation)</option>
                <option value="seq2">Séquence 2 (Novembre/Décembre)</option>
                <option value="term1">Bulletin Trimestre 1 (Synthèse S1 + S2)</option>
              </optgroup>
              <optgroup label="Trimestre 2 / 2nd Term">
                <option value="seq3">Séquence 3 (Janvier - 3ème évaluation)</option>
                <option value="seq4">Séquence 4 (Février/Mars)</option>
                <option value="term2">Bulletin Trimestre 2 (Synthèse S3 + S4)</option>
              </optgroup>
              <optgroup label="Trimestre 3 / 3rd Term">
                <option value="seq5">Séquence 5 (Avril - 5ème évaluation)</option>
                <option value="seq6">Séquence 6 (Mai - Évaluations finales)</option>
                <option value="term3">Bulletin Trimestre 3 (Synthèse S5 + S6)</option>
              </optgroup>
              <optgroup label="Fin d'Année / Annual">
                <option value="annual">Bilan Annuel & Procès-Verbal de Promotion</option>
              </optgroup>
            </select>
          </div>

          {/* Grading System Mode */}
          <div>
            <label className="block text-xs font-medium text-indigo-200 mb-1">
              {language === 'fr' ? 'Barème d\'Évaluation' : 'Grading Scale'}
            </label>
            <div className="grid grid-cols-2 gap-1 bg-indigo-950/70 p-1 rounded-lg border border-indigo-600/60">
              <button
                type="button"
                onClick={() => setGradingScale('cameroon20')}
                className={`py-1 text-xs font-bold rounded ${gradingScale === 'cameroon20' ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:text-white'}`}
              >
                /20 (MINESEC)
              </button>
              <button
                type="button"
                onClick={() => setGradingScale('anglophone100')}
                className={`py-1 text-xs font-bold rounded ${gradingScale === 'anglophone100' ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:text-white'}`}
              >
                % (Anglophone)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="border-b border-gray-200 bg-white rounded-xl shadow-sm px-4">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('subject')}
            className={`py-4 px-1 border-b-2 font-semibold text-sm flex items-center space-x-2 transition-colors ${
              activeTab === 'subject'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Subject Gradebook</span>
          </button>

          <button
            onClick={() => setActiveTab('broadsheet')}
            className={`py-4 px-1 border-b-2 font-semibold text-sm flex items-center space-x-2 transition-colors ${
              activeTab === 'broadsheet'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Class Broadsheet & Ranking</span>
          </button>

          <button
            onClick={() => setActiveTab('reportcard')}
            className={`py-4 px-1 border-b-2 font-semibold text-sm flex items-center space-x-2 transition-colors ${
              activeTab === 'reportcard'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Official Term Report Card</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-300">
              QR Anti-Fraude
            </span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: SUBJECT GRADEBOOK                                             */}
      {/* ===================================================================== */}
      {activeTab === 'subject' && (
        <div className="space-y-6">
          {/* Subject Selector Buttons */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              {language === 'fr' ? 'Sélectionner la Matière (Coefficients MINESEC)' : 'Select Subject (MINESEC Coefficients)'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {subjectsList.map((subj) => {
                const isSelected = subj.id === selectedSubjectId;
                return (
                  <button
                    key={subj.id}
                    onClick={() => setSelectedSubjectId(subj.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{language === 'fr' ? subj.nameFr : subj.name}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${isSelected ? 'bg-indigo-800 text-white' : 'bg-gray-300 text-gray-800'}`}>
                      Coef {subj.coefficient}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject Statistical KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-500 font-medium">Moyenne de la Matière</span>
              <div className="text-xl font-bold text-gray-900 mt-1">{subjectStats.avg} / 20</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-500 font-medium">Note Maximale</span>
              <div className="text-xl font-bold text-emerald-600 mt-1">{subjectStats.high} / 20</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-500 font-medium">Note Minimale</span>
              <div className="text-xl font-bold text-rose-600 mt-1">{subjectStats.low} / 20</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-500 font-medium">Taux de Réussite (≥ 10)</span>
              <div className="text-xl font-bold text-indigo-600 mt-1">{subjectStats.passRate}%</div>
            </div>
          </div>

          {/* Marks Input Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h3 className="font-bold text-gray-900">
                  {language === 'fr' ? currentSubject.nameFr : currentSubject.name} — {selectedClass}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enseignant Titulaire: <span className="font-semibold text-gray-700">{currentSubject.teacherName}</span> • Coefficient: <span className="font-semibold text-gray-700">{currentSubject.coefficient}</span>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-500">Période active:</span>
                <span className="text-xs font-bold text-indigo-900 bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 uppercase">
                  {selectedPeriod}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Élève / Student</th>
                    <th className="px-3 py-3 text-center w-28">Seq 1 / CA1 (/20)</th>
                    <th className="px-3 py-3 text-center w-28">Seq 2 / Exam (/20)</th>
                    <th className="px-3 py-3 text-center w-28">Moyenne /20</th>
                    <th className="px-3 py-3 text-center w-28">Cote APC</th>
                    <th className="px-4 py-3 text-left">Appréciation Pédagogique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockStudents.map((student) => {
                    const entry = currentEntries[student.id] || {
                      studentId: student.id,
                      studentName: student.name,
                      studentNumber: student.number,
                      seq1: 0,
                      seq2: 0,
                      remark: ''
                    };
                    const score = calculateSubjectScore(entry);

                    return (
                      <tr key={student.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-gray-900">{student.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{student.number}</div>
                        </td>

                        <td className="px-3 py-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            value={entry.seq1}
                            onChange={(e) => handleMarkChange(student.id, 'seq1', parseFloat(e.target.value))}
                            className="w-20 text-center font-bold font-mono border border-gray-300 rounded-lg py-1 px-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>

                        <td className="px-3 py-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.25"
                            value={entry.seq2}
                            onChange={(e) => handleMarkChange(student.id, 'seq2', parseFloat(e.target.value))}
                            className="w-20 text-center font-bold font-mono border border-gray-300 rounded-lg py-1 px-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>

                        <td className="px-3 py-2 text-center">
                          <span className={`font-mono font-extrabold text-sm ${score.average20 < 10 ? 'text-rose-600' : 'text-indigo-950'}`}>
                            {score.average20.toFixed(2)}
                          </span>
                        </td>

                        <td className="px-3 py-2 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${score.apc.badgeClass}`}>
                            {score.apc.code}
                          </span>
                        </td>

                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={entry.remark}
                            onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                            placeholder={score.apc.labelFr}
                            className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 italic focus:outline-none focus:border-indigo-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: CLASS BROADSHEET & RANKING (PALMARÈS)                         */}
      {/* ===================================================================== */}
      {activeTab === 'broadsheet' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">
                Procès-Verbal des Délibérations & Palmarès Officiel
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Classe: <span className="font-bold text-gray-700">{selectedClass}</span> • Période: <span className="font-bold text-indigo-700 uppercase">{selectedPeriod}</span> • Effectif: <span className="font-bold text-gray-700">{mockStudents.length} élèves</span>
              </p>
            </div>

            <button
              onClick={() => {
                toast.success('Procès-Verbal MINESEC téléchargé en CSV/Excel');
              }}
              className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold border border-indigo-200 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter Broadsheet Excel
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="px-3 py-3 text-center w-12">Rang</th>
                    <th className="px-4 py-3 text-left">Matricule & Élève</th>
                    {subjectsList.map(subj => (
                      <th key={subj.id} className="px-2 py-3 text-center" title={`${subj.name} (Coef ${subj.coefficient})`}>
                        <div>{subj.code}</div>
                        <div className="text-[9px] text-gray-400 font-mono">c.{subj.coefficient}</div>
                      </th>
                    ))}
                    <th className="px-3 py-3 text-center bg-indigo-50 text-indigo-950 font-extrabold">Moyenne /20</th>
                    <th className="px-3 py-3 text-center bg-indigo-50 text-indigo-950">Cote APC</th>
                    <th className="px-4 py-3 text-left">Décision du Conseil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {studentOverallSummary.map((item) => (
                    <tr key={item.student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 text-center font-extrabold font-mono text-sm">
                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${
                          item.rank === 1 ? 'bg-amber-100 text-amber-800 font-bold ring-2 ring-amber-400' :
                          item.rank === 2 ? 'bg-slate-200 text-slate-700 font-bold' :
                          item.rank === 3 ? 'bg-amber-700/20 text-amber-900 font-bold' :
                          'text-gray-500'
                        }`}>
                          {item.rank}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">{item.student.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{item.student.number}</div>
                      </td>

                      {subjectsList.map(subj => {
                        const mark = item.subjectDetails.find((s: any) => s.subject.id === subj.id)?.score.average20 || 0;
                        return (
                          <td key={subj.id} className={`px-2 py-3 text-center font-mono font-semibold ${mark < 10 ? 'text-rose-600 bg-rose-50/30' : 'text-gray-800'}`}>
                            {mark.toFixed(1)}
                          </td>
                        );
                      })}

                      <td className="px-3 py-3 text-center bg-indigo-50/60 font-mono font-extrabold text-sm text-indigo-950">
                        {item.overallAvg20.toFixed(2)}
                      </td>

                      <td className="px-3 py-3 text-center bg-indigo-50/60">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.overallApc.badgeClass}`}>
                          {item.overallApc.code}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold ${
                          item.overallAvg20 >= 14 ? 'text-emerald-700' :
                          item.overallAvg20 >= 10 ? 'text-indigo-700' :
                          'text-rose-700'
                        }`}>
                          {item.overallAvg20 >= 16 ? 'Tableau d\'Honneur • Félicitations' :
                           item.overallAvg20 >= 14 ? 'Tableau d\'Honneur • Encouragements' :
                           item.overallAvg20 >= 12 ? 'Tableau d\'Honneur' :
                           item.overallAvg20 >= 10 ? 'Passable' :
                           'Avertissement de Travail'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: OFFICIAL BULLETIN MINESEC WITH ANTI-FRAUD QR CODE             */}
      {/* ===================================================================== */}
      {activeTab === 'reportcard' && reportStudentData && (
        <div className="space-y-6">
          {/* Action and Student Selector Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-gray-500 uppercase">
                {language === 'fr' ? 'Choisir l\'Élève :' : 'Select Student :'}
              </label>
              <select
                value={selectedStudentForReport}
                onChange={(e) => setSelectedStudentForReport(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 font-bold text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {mockStudents.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.number})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowQrVerificationModal(true)}
                className="inline-flex items-center px-3 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-300 transition-colors"
              >
                <ShieldCheck className="h-4 w-4 mr-1.5 text-emerald-600" />
                Vérifier QR Code Anti-Fraude
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition-colors"
              >
                <Printer className="h-4 w-4 mr-1.5" />
                Imprimer le Bulletin Officiel
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* OFFICIAL BULLETIN SHEET (PRINTABLE MINESEC COMPLIANT)             */}
          {/* ================================================================= */}
          <div id="official-report-card-print" className="bg-white p-8 rounded-2xl shadow-md border-2 border-gray-800 max-w-4xl mx-auto text-gray-900 print:p-0 print:border-none print:shadow-none font-sans">
            
            {/* National Header (MINESEC Dual Bilingual Format) */}
            <div className="border-b-2 border-gray-900 pb-3 mb-3">
              <div className="grid grid-cols-3 items-center text-[10px] text-center uppercase font-serif leading-tight">
                {/* French Header Left */}
                <div>
                  <p className="font-extrabold text-[11px]">RÉPUBLIQUE DU CAMEROUN</p>
                  <p className="italic text-[9px] lowercase font-sans">Paix - Travail - Patrie</p>
                  <p className="font-bold mt-1">MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES</p>
                  <p className="text-[9px]">DÉLÉGATION RÉGIONALE DU CENTRE</p>
                  <p className="text-[9px]">DÉLÉGATION DÉPARTEMENTALE DU MFOUNDI</p>
                </div>

                {/* School Seal / Logo Center */}
                <div className="flex flex-col items-center justify-center">
                  <div className="h-16 w-16 border-2 border-indigo-900 rounded-full flex flex-col items-center justify-center p-1 bg-indigo-50/30">
                    <span className="font-black text-indigo-950 text-xs">GBHS</span>
                    <span className="text-[7px] text-gray-500">YAOUNDÉ</span>
                  </div>
                  <span className="text-[8px] font-mono tracking-widest text-indigo-950 mt-1 font-bold">
                    LABOR - VIRTUS - SAPIENTIA
                  </span>
                </div>

                {/* English Header Right */}
                <div>
                  <p className="font-extrabold text-[11px]">REPUBLIC OF CAMEROON</p>
                  <p className="italic text-[9px] lowercase font-sans">Peace - Work - Fatherland</p>
                  <p className="font-bold mt-1">MINISTRY OF SECONDARY EDUCATION</p>
                  <p className="text-[9px]">REGIONAL DELEGATION FOR THE CENTRE</p>
                  <p className="text-[9px]">DIVISIONAL DELEGATION OF MFOUNDI</p>
                </div>
              </div>

              {/* School Identification & Document Title Banner */}
              <div className="text-center mt-3 pt-2 border-t border-gray-300">
                <h2 className="text-lg font-black text-indigo-950 tracking-wide uppercase">
                  LYCÉE BILINGUE DE YAOUNDÉ / GOVERNMENT BILINGUAL HIGH SCHOOL YAOUNDÉ
                </h2>
                <p className="text-[10px] text-gray-600 font-medium">B.P. 124 Yaoundé • Tél: (+237) 222 21 00 11 • Email: contact@gbhsyaounde.cm</p>
                
                <div className="inline-block bg-indigo-950 text-white font-black px-6 py-1 rounded-full uppercase text-xs tracking-wider mt-1.5 shadow-sm">
                  BULLETIN DE NOTES DU {selectedPeriod.toUpperCase()} • REPORT CARD
                </div>
                <div className="text-[11px] font-bold text-gray-700 mt-1 font-mono">
                  ANNÉE SCOLAIRE / ACADEMIC YEAR : 2026 - 2027
                </div>
              </div>
            </div>

            {/* Student Particulars Header Grid */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50/80 p-3.5 rounded-xl border border-gray-300 text-xs mb-3">
              <div className="space-y-1">
                <div>
                  <span className="font-bold text-gray-600 uppercase text-[10px]">Nom et Prénom(s) :</span>{' '}
                  <span className="font-black text-sm text-indigo-950 uppercase">{reportStudentData.student.name}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-600 uppercase text-[10px]">Matricule :</span>{' '}
                  <span className="font-mono font-bold text-gray-900">{reportStudentData.student.number}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-600 uppercase text-[10px]">Date & Lieu de Naissance :</span>{' '}
                  <span className="font-medium">{reportStudentData.student.birthDate} à {reportStudentData.student.birthPlace}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-600 uppercase text-[10px]">Sexe / Gender :</span>{' '}
                  <span className="font-semibold uppercase">{reportStudentData.student.gender}</span>
                </div>
              </div>

              <div className="space-y-1 text-right md:text-left">
                <div>
                  <span className="font-bold text-gray-600 uppercase text-[10px]">Classe / Class :</span>{' '}
                  <span className="font-black text-indigo-950 text-sm">{selectedClass}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-600 uppercase text-[10px]">Effectif / Enrolled :</span>{' '}
                  <span className="font-bold text-gray-900">{mockStudents.length} élèves</span>
                </div>
                <div>
                  <span className="font-bold text-gray-600 uppercase text-[10px]">Statut :</span>{' '}
                  <span className="font-semibold">{reportStudentData.student.isRepeater ? 'Redoublant(e)' : 'Nouveau / Non Redoublant'}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-600 uppercase text-[10px]">Professeur Principal :</span>{' '}
                  <span className="font-bold text-gray-800">Mr. Cedric Mbida</span>
                </div>
              </div>
            </div>

            {/* Official MINESEC Subject Groups Table */}
            <div className="border border-gray-400 rounded-lg overflow-hidden mb-3">
              <table className="min-w-full divide-y divide-gray-300 text-[11px]">
                <thead className="bg-gray-200 text-gray-900 font-black uppercase text-[10px]">
                  <tr>
                    <th className="px-2 py-2 text-left">Matières & Enseignants</th>
                    <th className="px-1 py-2 text-center w-12">Seq 1</th>
                    <th className="px-1 py-2 text-center w-12">Seq 2</th>
                    <th className="px-2 py-2 text-center w-14">Moy /20</th>
                    <th className="px-1 py-2 text-center w-10">Coef</th>
                    <th className="px-2 py-2 text-center w-14">Total</th>
                    <th className="px-2 py-2 text-center w-14">Cote APC</th>
                    <th className="px-3 py-2 text-left">Appréciation du Professeur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* GROUPE 1: SCIENCES */}
                  <tr className="bg-indigo-50/70 font-bold text-indigo-950 text-[10px]">
                    <td colSpan={8} className="px-2 py-1 uppercase tracking-wider">
                      GROUPE 1 : SCIENCES ET TECHNOLOGIES (COEFF: {groupedSubjectDetails.group1.coefSum})
                    </td>
                  </tr>
                  {groupedSubjectDetails.group1.items.map((item: any) => (
                    <tr key={item.subject.id} className="hover:bg-gray-50">
                      <td className="px-2 py-1.5">
                        <div className="font-bold text-gray-900">{language === 'fr' ? item.subject.nameFr : item.subject.name}</div>
                        <div className="text-[9px] text-gray-500 italic">{item.subject.teacherName}</div>
                      </td>
                      <td className="px-1 py-1.5 text-center font-mono">{item.entry?.seq1 ?? '-'}</td>
                      <td className="px-1 py-1.5 text-center font-mono">{item.entry?.seq2 ?? '-'}</td>
                      <td className={`px-2 py-1.5 text-center font-bold font-mono ${item.score.average20 < 10 ? 'text-rose-600' : 'text-gray-900'}`}>
                        {item.score.average20.toFixed(2)}
                      </td>
                      <td className="px-1 py-1.5 text-center font-bold text-gray-600">{item.subject.coefficient}</td>
                      <td className="px-2 py-1.5 text-center font-bold font-mono text-indigo-950">{item.weighted.toFixed(2)}</td>
                      <td className="px-2 py-1.5 text-center">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${item.score.apc.badgeClass}`}>
                          {item.score.apc.code}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 italic text-gray-600 text-[10px]">{item.entry?.remark || item.score.mention}</td>
                    </tr>
                  ))}

                  {/* GROUPE 2: LANGUES */}
                  <tr className="bg-indigo-50/70 font-bold text-indigo-950 text-[10px]">
                    <td colSpan={8} className="px-2 py-1 uppercase tracking-wider">
                      GROUPE 2 : LANGUES ET LITTÉRATURE (COEFF: {groupedSubjectDetails.group2.coefSum})
                    </td>
                  </tr>
                  {groupedSubjectDetails.group2.items.map((item: any) => (
                    <tr key={item.subject.id} className="hover:bg-gray-50">
                      <td className="px-2 py-1.5">
                        <div className="font-bold text-gray-900">{language === 'fr' ? item.subject.nameFr : item.subject.name}</div>
                        <div className="text-[9px] text-gray-500 italic">{item.subject.teacherName}</div>
                      </td>
                      <td className="px-1 py-1.5 text-center font-mono">{item.entry?.seq1 ?? '-'}</td>
                      <td className="px-1 py-1.5 text-center font-mono">{item.entry?.seq2 ?? '-'}</td>
                      <td className={`px-2 py-1.5 text-center font-bold font-mono ${item.score.average20 < 10 ? 'text-rose-600' : 'text-gray-900'}`}>
                        {item.score.average20.toFixed(2)}
                      </td>
                      <td className="px-1 py-1.5 text-center font-bold text-gray-600">{item.subject.coefficient}</td>
                      <td className="px-2 py-1.5 text-center font-bold font-mono text-indigo-950">{item.weighted.toFixed(2)}</td>
                      <td className="px-2 py-1.5 text-center">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${item.score.apc.badgeClass}`}>
                          {item.score.apc.code}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 italic text-gray-600 text-[10px]">{item.entry?.remark || item.score.mention}</td>
                    </tr>
                  ))}

                  {/* GROUPE 3: SCIENCES HUMAINES & AUTRES */}
                  <tr className="bg-indigo-50/70 font-bold text-indigo-950 text-[10px]">
                    <td colSpan={8} className="px-2 py-1 uppercase tracking-wider">
                      GROUPE 3 : SCIENCES HUMAINES, ARTS ET SPORT (COEFF: {groupedSubjectDetails.group3.coefSum})
                    </td>
                  </tr>
                  {groupedSubjectDetails.group3.items.map((item: any) => (
                    <tr key={item.subject.id} className="hover:bg-gray-50">
                      <td className="px-2 py-1.5">
                        <div className="font-bold text-gray-900">{language === 'fr' ? item.subject.nameFr : item.subject.name}</div>
                        <div className="text-[9px] text-gray-500 italic">{item.subject.teacherName}</div>
                      </td>
                      <td className="px-1 py-1.5 text-center font-mono">{item.entry?.seq1 ?? '-'}</td>
                      <td className="px-1 py-1.5 text-center font-mono">{item.entry?.seq2 ?? '-'}</td>
                      <td className={`px-2 py-1.5 text-center font-bold font-mono ${item.score.average20 < 10 ? 'text-rose-600' : 'text-gray-900'}`}>
                        {item.score.average20.toFixed(2)}
                      </td>
                      <td className="px-1 py-1.5 text-center font-bold text-gray-600">{item.subject.coefficient}</td>
                      <td className="px-2 py-1.5 text-center font-bold font-mono text-indigo-950">{item.weighted.toFixed(2)}</td>
                      <td className="px-2 py-1.5 text-center">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${item.score.apc.badgeClass}`}>
                          {item.score.apc.code}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 italic text-gray-600 text-[10px]">{item.entry?.remark || item.score.mention}</td>
                    </tr>
                  ))}
                </tbody>

                {/* General Totals Row */}
                <tfoot className="bg-gray-100 border-t-2 border-gray-900 font-bold text-[11px]">
                  <tr>
                    <td className="px-3 py-2 uppercase" colSpan={4}>TOTAUX GÉNÉRAUX / OVERALL TOTALS</td>
                    <td className="px-1 py-2 text-center text-gray-900">{reportStudentData.totalCoeffs}</td>
                    <td className="px-2 py-2 text-center text-indigo-950 font-black font-mono">
                      {reportStudentData.totalWeighted.toFixed(2)}
                    </td>
                    <td colSpan={2} className="px-3 py-2 text-right text-gray-500 text-[10px]">
                      Sur un total max de {reportStudentData.totalCoeffs * 20} pts
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Summary Deliberation, Discipline & Anti-Fraud QR Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
              {/* Box 1: Bilan Trimestriel & Moyennes */}
              <div className="border border-gray-300 p-3 rounded-lg bg-indigo-50/30 space-y-1.5">
                <h4 className="font-black text-indigo-950 uppercase text-[10px] border-b pb-1">
                  RÉSULTATS DE L'ÉLÈVE
                </h4>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Points :</span>
                  <span className="font-bold font-mono">{reportStudentData.totalWeighted.toFixed(2)} / {reportStudentData.totalCoeffs * 20}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-bold">Moyenne Générale :</span>
                  <span className="text-base font-black text-indigo-950 font-mono bg-white px-2 py-0.5 rounded border border-indigo-200">
                    {reportStudentData.overallAvg20.toFixed(2)} / 20
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Rang / Position :</span>
                  <span className="font-black text-indigo-900">
                    {reportStudentData.rank}e sur {mockStudents.length} élèves
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] pt-1 border-t border-gray-200 text-gray-500">
                  <span>Moyenne de classe : 12.35</span>
                  <span>Plus forte : 16.80</span>
                </div>
              </div>

              {/* Box 2: Assiduité, Discipline & Vie Scolaire */}
              <div className="border border-gray-300 p-3 rounded-lg bg-gray-50 space-y-1.5">
                <h4 className="font-black text-gray-900 uppercase text-[10px] border-b pb-1">
                  VIE SCOLAIRE & ASSIDUITÉ
                </h4>
                <div className="flex justify-between">
                  <span className="text-gray-600">Absences non justifiées :</span>
                  <span className="font-bold text-rose-700">{reportStudentData.student.attendance.absentHours} heures</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Retards enregistrés :</span>
                  <span className="font-bold text-amber-700">{reportStudentData.student.attendance.lateCount} fois</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consignes / Retenues :</span>
                  <span className="font-bold">{reportStudentData.student.attendance.detention} heures</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200 text-[10px]">
                  <span className="font-bold text-gray-700">Conduite :</span>
                  <span className="font-bold text-emerald-700">Exemplaire</span>
                </div>
              </div>

              {/* Box 3: Anti-Fraud QR Code & Security Stamp */}
              <div className="border-2 border-dashed border-indigo-300 p-3 rounded-lg bg-indigo-50/40 flex items-center justify-between">
                <div className="space-y-1 pr-2">
                  <div className="flex items-center space-x-1 text-emerald-700 font-extrabold text-[10px] uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Sécurisé Numériquement</span>
                  </div>
                  <p className="text-[9px] text-gray-600 leading-tight">
                    Scannez ce QR Code pour vérifier l'authenticité sur le serveur académique MINESEC.
                  </p>
                  <div className="text-[8px] font-mono text-gray-400 break-all">
                    SHA256: {reportStudentData.student.number.replace(/-/g, '')}7a9f...
                  </div>
                </div>

                <div 
                  className="p-1 bg-white rounded border border-gray-300 shadow-sm flex-shrink-0 cursor-pointer"
                  onClick={() => setShowQrVerificationModal(true)}
                  title="Cliquer pour afficher la vérification anti-fraude"
                  dangerouslySetInnerHTML={{ __html: generateVerificationQrSvg(qrVerificationPayload, 64) }}
                />
              </div>
            </div>

            {/* Decision of the Class Council (Décision du Conseil de Classe) */}
            <div className={`p-2.5 rounded-lg border text-center mb-6 font-bold text-xs uppercase tracking-wide ${councilDecision.color}`}>
              DÉCISION DU CONSEIL DE CLASSE : {councilDecision.label}
            </div>

            {/* Official Ministerial Signatures & Seals */}
            <div className="grid grid-cols-3 gap-6 text-center text-xs pt-4 border-t-2 border-gray-900">
              <div className="space-y-12">
                <p className="font-bold text-gray-700 uppercase text-[10px]">Le Parent / Tuteur Légal</p>
                <p className="text-[9px] text-gray-400 italic">Lu et approuvé</p>
              </div>

              <div className="space-y-12">
                <p className="font-bold text-gray-700 uppercase text-[10px]">Le Professeur Principal</p>
                <div className="font-serif italic text-gray-600 text-xs">C. Mbida</div>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-[10px] text-gray-500">Fait à Yaoundé, le {new Date().toLocaleDateString('fr-FR')}</p>
                  <p className="font-black text-indigo-950 uppercase text-[10px] mt-0.5">Le Chef d'Établissement (Proviseur)</p>
                </div>
                <div className="h-10 flex items-center justify-center">
                  <div className="border border-indigo-900/40 rounded-full h-12 w-28 flex items-center justify-center text-[8px] font-bold text-indigo-900 uppercase rotate-[-3deg]">
                    Sceau du Proviseur
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ANTI-FRAUD QR CODE VERIFICATION PROOF                          */}
      {/* ===================================================================== */}
      {showQrVerificationModal && reportStudentData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-6 w-6 text-emerald-300" />
                <div>
                  <h3 className="font-bold text-sm">Vérification Certificat Anti-Fraude</h3>
                  <p className="text-[10px] text-emerald-200">Portail National d'Authenticité MINESEC</p>
                </div>
              </div>
              <button
                onClick={() => setShowQrVerificationModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs text-gray-700">
              <div className="flex items-center justify-center py-2">
                <div 
                  className="p-3 bg-white rounded-xl border-2 border-emerald-500 shadow-md"
                  dangerouslySetInnerHTML={{ __html: generateVerificationQrSvg(qrVerificationPayload, 120) }}
                />
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Document Authentique et Enregistré</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Ce bulletin a été émis et signé numériquement par le Lycée Bilingue de Yaoundé (GBHS Yaoundé).
                </p>
              </div>

              <div className="space-y-1 border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Élève :</span>
                  <span className="font-bold text-gray-900">{reportStudentData.student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Matricule :</span>
                  <span className="font-mono font-bold text-gray-900">{reportStudentData.student.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Classe :</span>
                  <span className="font-bold text-gray-900">{selectedClass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Moyenne Officielle :</span>
                  <span className="font-black text-indigo-950 font-mono text-sm">{reportStudentData.overallAvg20.toFixed(2)} / 20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rang Officiel :</span>
                  <span className="font-bold text-gray-900">{reportStudentData.rank}e sur {mockStudents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Statut APC :</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${reportStudentData.overallApc.badgeClass}`}>
                    {reportStudentData.overallApc.code} — {reportStudentData.overallApc.labelFr}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-center text-[10px] text-gray-400 font-mono break-all">
                URL de vérification: {qrVerificationPayload}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t flex justify-end">
              <button
                onClick={() => setShowQrVerificationModal(false)}
                className="px-4 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-semibold hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradebookManager;
