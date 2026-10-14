import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  Layers,
  Printer,
  Save,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export interface SubjectAssessment {
  id: string;
  name: string;
  nameFr: string;
  code: string;
  coefficient: number;
  category: 'sciences' | 'languages' | 'humanities' | 'others';
}

export interface StudentGradeEntry {
  studentId: string;
  studentName: string;
  studentNumber: string;
  ca1: number; // Continuous Assessment 1 (out of 20)
  ca2: number; // Continuous Assessment 2 (out of 20)
  exam: number; // Final Exam (out of 20)
  remark: string;
}

const subjectsList: SubjectAssessment[] = [
  { id: 'math', name: 'Mathematics', nameFr: 'Mathématiques', code: 'MATH', coefficient: 4, category: 'sciences' },
  { id: 'eng', name: 'English Language', nameFr: 'Langue Anglaise', code: 'ENG', coefficient: 3, category: 'languages' },
  { id: 'fr', name: 'French Language', nameFr: 'Langue Française', code: 'FR', coefficient: 3, category: 'languages' },
  { id: 'phy', name: 'Physics & Chemistry', nameFr: 'Physique-Chimie', code: 'PHY', coefficient: 3, category: 'sciences' },
  { id: 'bio', name: 'Biology & Life Sciences', nameFr: 'SVT / Biologie', code: 'BIO', coefficient: 2, category: 'sciences' },
  { id: 'hist', name: 'History & Citizenship', nameFr: 'Histoire-ECM', code: 'HIST', coefficient: 2, category: 'humanities' },
  { id: 'geo', name: 'Geography', nameFr: 'Géographie', code: 'GEO', coefficient: 2, category: 'humanities' },
  { id: 'cs', name: 'Computer Science & ICT', nameFr: 'Informatique', code: 'ICT', coefficient: 2, category: 'sciences' },
  { id: 'pe', name: 'Physical Education & Sports', nameFr: 'EPS', code: 'EPS', coefficient: 1, category: 'others' }
];

const mockStudents = [
  { id: 's1', name: 'Emma Johnson', number: 'STU-2024-001', gender: 'female', attendance: { absent: 1, late: 2, total: 60 } },
  { id: 's2', name: 'Michael Brown', number: 'STU-2024-002', gender: 'male', attendance: { absent: 3, late: 1, total: 60 } },
  { id: 's3', name: 'Sophia Davis', number: 'STU-2024-003', gender: 'female', attendance: { absent: 0, late: 3, total: 60 } },
  { id: 's4', name: 'James Wilson', number: 'STU-2024-004', gender: 'male', attendance: { absent: 5, late: 0, total: 60 } },
  { id: 's5', name: 'Olivia Miller', number: 'STU-2024-005', gender: 'female', attendance: { absent: 0, late: 0, total: 60 } },
  { id: 's6', name: 'Lucas Ngu', number: 'STU-2024-006', gender: 'male', attendance: { absent: 2, late: 1, total: 60 } },
  { id: 's7', name: 'Chantal Biya', number: 'STU-2024-007', gender: 'female', attendance: { absent: 1, late: 0, total: 60 } },
  { id: 's8', name: 'Brendan Forchu', number: 'STU-2024-008', gender: 'male', attendance: { absent: 4, late: 2, total: 60 } }
];

export const GradebookManager: React.FC = () => {
  const { language, school } = useAuth();

  const [activeTab, setActiveTab] = useState<'subject' | 'broadsheet' | 'reportcard'>('subject');
  const [selectedClass, setSelectedClass] = useState<string>('Form 3A');
  const [selectedTerm, setSelectedTerm] = useState<'Term 1' | 'Term 2' | 'Term 3'>('Term 1');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
  const [gradingScale, setGradingScale] = useState<'cameroon20' | 'anglophone100'>('cameroon20');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<string>('s1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Storage key based on class, term, subject
  const currentSubject = subjectsList.find(s => s.id === selectedSubjectId) || subjectsList[0];

  // State of marks per student: { [subjectId]: StudentGradeEntry[] }
  const [gradesData, setGradesData] = useState<Record<string, Record<string, StudentGradeEntry>>>({});

  // Initialize marks
  useEffect(() => {
    const key = `ems_gradebook_${selectedClass}_${selectedTerm}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setGradesData(JSON.parse(stored));
        return;
      } catch (e) {
        console.error(e);
      }
    }

    // Default mock marks
    const initial: Record<string, Record<string, StudentGradeEntry>> = {};
    subjectsList.forEach((subj) => {
      initial[subj.id] = {};
      mockStudents.forEach((student, idx) => {
        const baseScore = 11 + ((idx * 2) % 8) + (subj.id === 'math' ? 1 : 0);
        const ca1 = Math.min(20, Math.max(8, baseScore - 1));
        const ca2 = Math.min(20, Math.max(9, baseScore));
        const exam = Math.min(20, Math.max(7, baseScore + 1));
        initial[subj.id][student.id] = {
          studentId: student.id,
          studentName: student.name,
          studentNumber: student.number,
          ca1,
          ca2,
          exam,
          remark: baseScore >= 16 ? 'Excellent effort' : baseScore >= 12 ? 'Good performance' : 'Can do better'
        };
      });
    });
    setGradesData(initial);
  }, [selectedClass, selectedTerm]);

  // Current subject entries
  const currentEntries = useMemo(() => {
    return gradesData[selectedSubjectId] || {};
  }, [gradesData, selectedSubjectId]);

  // Handle Mark Change
  const handleMarkChange = (studentId: string, field: 'ca1' | 'ca2' | 'exam', value: number) => {
    const clamped = isNaN(value) ? 0 : Math.min(20, Math.max(0, value));
    setGradesData(prev => {
      const subjectGrades = { ...(prev[selectedSubjectId] || {}) };
      const current = subjectGrades[studentId] || {
        studentId,
        studentName: mockStudents.find(s => s.id === studentId)?.name || '',
        studentNumber: mockStudents.find(s => s.id === studentId)?.number || '',
        ca1: 0,
        ca2: 0,
        exam: 0,
        remark: ''
      };
      subjectGrades[studentId] = {
        ...current,
        [field]: clamped
      };
      return {
        ...prev,
        [selectedSubjectId]: subjectGrades
      };
    });
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setGradesData(prev => {
      const subjectGrades = { ...(prev[selectedSubjectId] || {}) };
      const current = subjectGrades[studentId];
      if (current) {
        subjectGrades[studentId] = { ...current, remark };
      }
      return { ...prev, [selectedSubjectId]: subjectGrades };
    });
  };

  const handleSaveGrades = () => {
    const key = `ems_gradebook_${selectedClass}_${selectedTerm}`;
    localStorage.setItem(key, JSON.stringify(gradesData));
    toast.success(
      language === 'fr'
        ? 'Notes enregistrées avec succès!'
        : 'Grades successfully saved!'
    );
  };

  // Convert / Calculate subject score for student
  const calculateSubjectScore = (entry?: StudentGradeEntry) => {
    if (!entry) return { average20: 0, average100: 0, mention: 'N/A', letter: 'F' };
    const caAvg = (entry.ca1 + entry.ca2) / 2;
    // Standard Cameroon weighting: 40% Continuous Assessment, 60% Exam
    const total20 = Math.round((caAvg * 0.4 + entry.exam * 0.6) * 10) / 10;
    const total100 = Math.round((total20 / 20) * 100);

    let mention = 'Insuffisant';
    let letter = 'F';

    if (total20 >= 16) {
      mention = 'Très Bien';
      letter = 'A';
    } else if (total20 >= 14) {
      mention = 'Bien';
      letter = 'B';
    } else if (total20 >= 12) {
      mention = 'Assez Bien';
      letter = 'C+';
    } else if (total20 >= 10) {
      mention = 'Passable';
      letter = 'C';
    } else if (total20 >= 8) {
      mention = 'Médiocre';
      letter = 'D';
    } else {
      mention = 'Insuffisant';
      letter = 'F';
    }

    return { average20: total20, average100: total100, mention, letter };
  };

  // Subject Stats
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
  }, [currentEntries, mockStudents]);

  // Overall student summary for Broadsheet & Report Card
  const studentOverallSummary = useMemo(() => {
    return mockStudents.map(student => {
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

      return {
        student,
        subjectDetails,
        totalWeighted,
        totalCoeffs,
        overallAvg20,
        overallAvg100
      };
    }).sort((a, b) => b.overallAvg20 - a.overallAvg20)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [gradesData, mockStudents]);

  // Current student report card data
  const reportStudentData = useMemo(() => {
    return studentOverallSummary.find(s => s.student.id === selectedStudentForReport) || studentOverallSummary[0];
  }, [studentOverallSummary, selectedStudentForReport]);

  const handleExportBroadsheet = () => {
    const header = ['Rank', 'Matricule', 'Student Name', ...subjectsList.map(s => s.code), 'Moyenne /20', 'Moyenne %'];
    const rows = studentOverallSummary.map(s => [
      s.rank,
      `"${s.student.number}"`,
      `"${s.student.name}"`,
      ...s.subjectDetails.map(d => d.score.average20),
      s.overallAvg20,
      `${s.overallAvg100}%`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Palmares_${selectedClass}_${selectedTerm}.csv`;
    link.click();
    toast.success(language === 'fr' ? 'Palmarès exporté en CSV!' : 'Broadsheet exported as CSV!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="h-7 w-7 text-indigo-600" />
            {language === 'fr' ? 'Gestion des Notes & Bulletins' : 'Gradebook & Assessment System'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {language === 'fr'
              ? 'Évaluation continue, examens trimestriels, palmarès général et génération officielle des bulletins scolaires.'
              : 'Record continuous assessments, exams, track class rankings, and generate official term report cards.'}
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* System scale switcher */}
          <div className="inline-flex rounded-lg border border-gray-300 p-0.5 bg-gray-50 text-xs font-semibold">
            <button
              onClick={() => setGradingScale('cameroon20')}
              className={`px-3 py-1.5 rounded-md transition ${
                gradingScale === 'cameroon20' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Note sur 20 (Cameroun/Fr)
            </button>
            <button
              onClick={() => setGradingScale('anglophone100')}
              className={`px-3 py-1.5 rounded-md transition ${
                gradingScale === 'anglophone100' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Percentage % (Anglophone)
            </button>
          </div>

          <button
            onClick={handleSaveGrades}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {language === 'fr' ? 'Enregistrer les Notes' : 'Save Grades'}
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('subject')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'subject'
                ? 'border-indigo-500 text-indigo-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            {language === 'fr' ? 'Carnet par Matière' : 'Subject Gradebook'}
          </button>

          <button
            onClick={() => setActiveTab('broadsheet')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'broadsheet'
                ? 'border-indigo-500 text-indigo-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Layers className="h-4 w-4" />
            {language === 'fr' ? 'Palmarès Général (Broadsheet)' : 'Class Broadsheet & Ranking'}
          </button>

          <button
            onClick={() => setActiveTab('reportcard')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'reportcard'
                ? 'border-indigo-500 text-indigo-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4" />
            {language === 'fr' ? 'Bulletin Scolaire Officiel' : 'Official Term Report Card'}
          </button>
        </nav>
      </div>

      {/* Filter Selector Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
            {language === 'fr' ? 'Classe' : 'Class'}
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-medium py-2 px-3 border"
          >
            <option value="Form 3A">Form 3A (Secondary Anglophone)</option>
            <option value="3ème A">3ème A (Collège Francophone)</option>
            <option value="Form 4B">Form 4B (Secondary Anglophone)</option>
            <option value="Première C">Première C (Lycée Francophone)</option>
            <option value="Upper Sixth Arts">Upper Sixth Arts</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
            {language === 'fr' ? 'Trimestre / Session' : 'Academic Term'}
          </label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value as any)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-medium py-2 px-3 border"
          >
            <option value="Term 1">{language === 'fr' ? '1er Trimestre (Term 1)' : 'Term 1'}</option>
            <option value="Term 2">{language === 'fr' ? '2ème Trimestre (Term 2)' : 'Term 2'}</option>
            <option value="Term 3">{language === 'fr' ? '3ème Trimestre (Term 3)' : 'Term 3'}</option>
          </select>
        </div>

        {activeTab === 'subject' && (
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              {language === 'fr' ? 'Matière / Discipline' : 'Subject'}
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-semibold text-indigo-700 py-2 px-3 border bg-indigo-50/40"
            >
              {subjectsList.map(subj => (
                <option key={subj.id} value={subj.id}>
                  {subj.code} - {language === 'fr' ? subj.nameFr : subj.name} (Coeff: {subj.coefficient})
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === 'reportcard' && (
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              {language === 'fr' ? 'Sélectionner l\'Élève' : 'Select Student'}
            </label>
            <select
              value={selectedStudentForReport}
              onChange={(e) => setSelectedStudentForReport(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-semibold text-indigo-700 py-2 px-3 border"
            >
              {studentOverallSummary.map(item => (
                <option key={item.student.id} value={item.student.id}>
                  Rank #{item.rank} - {item.student.name} ({item.overallAvg20}/20)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: SUBJECT GRADEBOOK MATRIX */}
      {activeTab === 'subject' && (
        <div className="space-y-4">
          {/* Subject Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-500 font-medium">
                {language === 'fr' ? 'Moyenne de la Classe' : 'Class Average'}
              </span>
              <div className="text-2xl font-bold text-indigo-600 mt-1">
                {gradingScale === 'cameroon20' ? `${subjectStats.avg} / 20` : `${Math.round((subjectStats.avg / 20) * 100)}%`}
              </div>
            </div>

            <div className="bg-green-50/50 p-4 rounded-xl border border-green-200 shadow-sm">
              <span className="text-xs text-green-700 font-medium">
                {language === 'fr' ? 'Meilleure Note' : 'Highest Score'}
              </span>
              <div className="text-2xl font-bold text-green-800 mt-1">
                {gradingScale === 'cameroon20' ? `${subjectStats.high} / 20` : `${Math.round((subjectStats.high / 20) * 100)}%`}
              </div>
            </div>

            <div className="bg-red-50/50 p-4 rounded-xl border border-red-200 shadow-sm">
              <span className="text-xs text-red-700 font-medium">
                {language === 'fr' ? 'Note la Plus Basse' : 'Lowest Score'}
              </span>
              <div className="text-2xl font-bold text-red-800 mt-1">
                {gradingScale === 'cameroon20' ? `${subjectStats.low} / 20` : `${Math.round((subjectStats.low / 20) * 100)}%`}
              </div>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 shadow-sm">
              <span className="text-xs text-blue-700 font-medium">
                {language === 'fr' ? 'Taux de Réussite (≥ 10/20)' : 'Pass Rate (≥ 50%)'}
              </span>
              <div className="text-2xl font-bold text-blue-800 mt-1">
                {subjectStats.passRate}%
              </div>
            </div>
          </div>

          {/* Marks Entry Table */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm font-bold text-gray-800">
                {language === 'fr' ? currentSubject.nameFr : currentSubject.name} — {currentSubject.code} (Coeff: {currentSubject.coefficient})
              </div>
              <div className="text-xs text-gray-500">
                {language === 'fr' ? 'Formule: 40% Contrôle Continu (CC1+CC2) + 60% Composition' : 'Formula: 40% Continuous Assessment + 60% Exam'}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      {language === 'fr' ? 'Élève / Matricule' : 'Student / ID'}
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-28">
                      {language === 'fr' ? 'Éval 1 (/20)' : 'CA 1 (/20)'}
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-28">
                      {language === 'fr' ? 'Éval 2 (/20)' : 'CA 2 (/20)'}
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-28">
                      {language === 'fr' ? 'Compo/Exam (/20)' : 'Exam (/20)'}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                      {gradingScale === 'cameroon20' ? 'Moyenne /20' : 'Total % & Grade'}
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      {language === 'fr' ? 'Mention' : 'Status'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      {language === 'fr' ? 'Appréciation du Professeur' : 'Teacher Remark'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockStudents.map(student => {
                    const entry = currentEntries[student.id] || {
                      studentId: student.id,
                      studentName: student.name,
                      studentNumber: student.number,
                      ca1: 0,
                      ca2: 0,
                      exam: 0,
                      remark: ''
                    };
                    const score = calculateSubjectScore(entry);

                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        {/* Student Name */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">{student.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{student.number}</div>
                        </td>

                        {/* CA 1 */}
                        <td className="px-3 py-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={entry.ca1}
                            onChange={(e) => handleMarkChange(student.id, 'ca1', parseFloat(e.target.value))}
                            className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                          />
                        </td>

                        {/* CA 2 */}
                        <td className="px-3 py-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={entry.ca2}
                            onChange={(e) => handleMarkChange(student.id, 'ca2', parseFloat(e.target.value))}
                            className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                          />
                        </td>

                        {/* Exam */}
                        <td className="px-3 py-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={entry.exam}
                            onChange={(e) => handleMarkChange(student.id, 'exam', parseFloat(e.target.value))}
                            className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                          />
                        </td>

                        {/* Total Moyenne */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            score.average20 >= 14
                              ? 'bg-green-100 text-green-800'
                              : score.average20 >= 10
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {gradingScale === 'cameroon20' 
                              ? `${score.average20} / 20` 
                              : `${score.average100}% (${score.letter})`}
                          </span>
                        </td>

                        {/* Mention */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className="text-xs font-semibold text-gray-700">
                            {score.mention}
                          </span>
                        </td>

                        {/* Remark */}
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={entry.remark}
                            placeholder={language === 'fr' ? 'Appréciation...' : 'Enter feedback...'}
                            onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                            className="w-full text-xs border border-gray-200 rounded px-2.5 py-1 focus:border-indigo-400 focus:outline-none"
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

      {/* TAB 2: BROADSHEET (PALMARÈS) */}
      {activeTab === 'broadsheet' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">
              {language === 'fr' ? `Palmarès Général & Classement - ${selectedClass}` : `General Broadsheet & Class Ranking - ${selectedClass}`}
            </h3>
            <button
              onClick={handleExportBroadsheet}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
            >
              <Download className="h-3.5 w-3.5 mr-1 text-gray-500" />
              {language === 'fr' ? 'Exporter Palmarès CSV' : 'Export Broadsheet CSV'}
            </button>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-center font-bold text-gray-700 uppercase">Rang</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase">Élève</th>
                  {subjectsList.map(s => (
                    <th key={s.id} className="px-2 py-3 text-center font-bold text-gray-600 uppercase" title={s.name}>
                      <div>{s.code}</div>
                      <div className="text-[10px] text-gray-400 font-normal">c.{s.coefficient}</div>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center font-bold text-indigo-700 uppercase">Moyenne /20</th>
                  <th className="px-3 py-3 text-center font-bold text-indigo-700 uppercase">Moyenne %</th>
                  <th className="px-3 py-3 text-center font-bold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {studentOverallSummary.map(row => (
                  <tr key={row.student.id} className="hover:bg-gray-50/80">
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full font-bold text-xs ${
                        row.rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        row.rank === 2 ? 'bg-gray-200 text-gray-800' :
                        row.rank === 3 ? 'bg-amber-50 text-amber-900 border' :
                        'text-gray-600'
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-900">
                      <div>{row.student.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{row.student.number}</div>
                    </td>

                    {row.subjectDetails.map(detail => (
                      <td key={detail.subject.id} className="px-2 py-3 text-center whitespace-nowrap font-mono">
                        <span className={detail.score.average20 < 10 ? 'text-red-600 font-bold' : 'text-gray-800'}>
                          {detail.score.average20}
                        </span>
                      </td>
                    ))}

                    <td className="px-3 py-3 text-center whitespace-nowrap font-bold text-indigo-700 text-sm">
                      {row.overallAvg20}
                    </td>

                    <td className="px-3 py-3 text-center whitespace-nowrap font-semibold text-gray-700">
                      {row.overallAvg100}%
                    </td>

                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedStudentForReport(row.student.id);
                          setActiveTab('reportcard');
                        }}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold underline text-xs"
                      >
                        {language === 'fr' ? 'Bulletin' : 'Report Card'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: OFFICIAL REPORT CARD (BULLETIN DE NOTES) */}
      {activeTab === 'reportcard' && reportStudentData && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
            <div className="text-sm font-semibold text-gray-700">
              {language === 'fr' ? 'Aperçu prêt pour impression & export' : 'Printable Official Report Card Preview'}
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Printer className="h-4 w-4 mr-1.5" />
              {language === 'fr' ? 'Imprimer le Bulletin' : 'Print Report Card'}
            </button>
          </div>

          {/* OFFICIAL REPORT CARD SHEET (MINESEC FORMAT) */}
          <div className="bg-white p-8 rounded-2xl shadow border border-gray-300 max-w-4xl mx-auto text-gray-900 print:p-0 print:border-none print:shadow-none">
            {/* National Header */}
            <div className="border-b-2 border-gray-900 pb-4 mb-4">
              <div className="flex justify-between items-start text-[11px] font-serif">
                <div className="text-center w-5/12">
                  <p className="font-bold uppercase tracking-wider">RÉPUBLIQUE DU CAMEROUN</p>
                  <p className="italic text-[10px]">Paix - Travail - Patrie</p>
                  <p className="uppercase font-semibold mt-1">MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES</p>
                  <p className="text-[10px]">DÉLÉGATION RÉGIONALE DU CENTRE</p>
                </div>

                {/* School Seal / Logo Placeholder */}
                <div className="text-center flex flex-col items-center">
                  <div className="h-16 w-16 border-2 border-indigo-900 rounded-full flex items-center justify-center font-bold text-indigo-900 text-xs">
                    EM-SYS
                  </div>
                  <span className="text-[9px] font-mono mt-1">Devoir • Savoir • Réussir</span>
                </div>

                <div className="text-center w-5/12">
                  <p className="font-bold uppercase tracking-wider">REPUBLIC OF CAMEROON</p>
                  <p className="italic text-[10px]">Peace - Work - Fatherland</p>
                  <p className="uppercase font-semibold mt-1">MINISTRY OF SECONDARY EDUCATION</p>
                  <p className="text-[10px]">REGIONAL DELEGATION OF CENTRE</p>
                </div>
              </div>

              {/* School Name & Report Card Title */}
              <div className="text-center mt-3">
                <h2 className="text-xl font-extrabold uppercase tracking-wide text-indigo-950">
                  {school?.name || 'COLLEGE BILINGUE D\'EXCELLENCE / BILINGUAL HIGH SCHOOL'}
                </h2>
                <div className="inline-block bg-indigo-900 text-white font-bold px-6 py-1 rounded-full uppercase text-xs tracking-widest mt-1">
                  {language === 'fr' ? `BULLETIN DE NOTES DU ${selectedTerm.toUpperCase()}` : `OFFICIAL REPORT CARD - ${selectedTerm.toUpperCase()}`}
                </div>
                <p className="text-xs font-semibold text-gray-600 mt-1">Année Scolaire / Academic Year: 2024 - 2025</p>
              </div>
            </div>

            {/* Student & Class Information Box */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs mb-4">
              <div className="space-y-1">
                <div><span className="font-bold text-gray-600">Nom & Prénom(s) / Full Name:</span> <span className="font-extrabold text-sm text-gray-900 uppercase">{reportStudentData.student.name}</span></div>
                <div><span className="font-bold text-gray-600">Matricule / Student ID:</span> <span className="font-mono font-bold">{reportStudentData.student.number}</span></div>
                <div><span className="font-bold text-gray-600">Sexe / Gender:</span> <span className="capitalize">{reportStudentData.student.gender}</span></div>
              </div>
              <div className="space-y-1">
                <div><span className="font-bold text-gray-600">Classe / Class:</span> <span className="font-bold text-sm text-indigo-900">{selectedClass}</span></div>
                <div><span className="font-bold text-gray-600">Effectif de la classe / Enrolled:</span> <span className="font-bold">{mockStudents.length} élèves</span></div>
                <div><span className="font-bold text-gray-600">Professeur Principal / Class Master:</span> <span>Mr. Cedric Mbida</span></div>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
              <table className="min-w-full divide-y divide-gray-300 text-xs">
                <thead className="bg-gray-100 text-gray-800">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold">Matière / Subject</th>
                    <th className="px-2 py-2 text-center font-bold">CC (/20)</th>
                    <th className="px-2 py-2 text-center font-bold">Compo (/20)</th>
                    <th className="px-2 py-2 text-center font-bold">Moy /20</th>
                    <th className="px-2 py-2 text-center font-bold">Coeff</th>
                    <th className="px-2 py-2 text-center font-bold">Total Pondéré</th>
                    <th className="px-3 py-2 text-left font-bold">Appréciation du Professeur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportStudentData.subjectDetails.map((item: any) => (
                    <tr key={item.subject.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-semibold text-gray-900">
                        {language === 'fr' ? item.subject.nameFr : item.subject.name}
                      </td>
                      <td className="px-2 py-2 text-center font-mono">
                        {item.entry ? Math.round(((item.entry.ca1 + item.entry.ca2) / 2) * 10) / 10 : '-'}
                      </td>
                      <td className="px-2 py-2 text-center font-mono">
                        {item.entry ? item.entry.exam : '-'}
                      </td>
                      <td className={`px-2 py-2 text-center font-bold font-mono ${item.score.average20 < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {item.score.average20}
                      </td>
                      <td className="px-2 py-2 text-center font-bold text-gray-600">
                        {item.subject.coefficient}
                      </td>
                      <td className="px-2 py-2 text-center font-bold font-mono text-indigo-900">
                        {Math.round(item.weighted * 10) / 10}
                      </td>
                      <td className="px-3 py-2 italic text-gray-600 text-[11px]">
                        {item.entry?.remark || item.score.mention}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Total Row */}
                <tfoot className="bg-gray-50 border-t-2 border-gray-400 font-bold">
                  <tr>
                    <td className="px-3 py-2 uppercase" colSpan={4}>TOTAUX / TOTALS</td>
                    <td className="px-2 py-2 text-center">{reportStudentData.totalCoeffs}</td>
                    <td className="px-2 py-2 text-center text-indigo-950 font-bold">
                      {Math.round(reportStudentData.totalWeighted * 10) / 10}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Performance Summary Metrics & Academic Standing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border border-gray-200 p-4 rounded-xl bg-indigo-50/40 text-xs space-y-2">
                <h4 className="font-bold text-indigo-950 uppercase text-xs border-b pb-1">
                  {language === 'fr' ? 'Bilan Trimestriel de l\'Élève' : 'Term Performance Summary'}
                </h4>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-semibold">Moyenne Générale / Overall Average:</span>
                  <span className="font-extrabold text-indigo-900 text-sm">{reportStudentData.overallAvg20} / 20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-semibold">Rang de l'élève / Position in Class:</span>
                  <span className="font-bold text-indigo-900">{reportStudentData.rank}e sur {mockStudents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-semibold">Moyenne de la classe / Class Average:</span>
                  <span>12.45 / 20</span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-500">
                  <span>Plus forte moyenne: 16.80</span>
                  <span>Plus faible moyenne: 07.20</span>
                </div>
              </div>

              {/* Attendance & Discipline */}
              <div className="border border-gray-200 p-4 rounded-xl bg-gray-50 text-xs space-y-2">
                <h4 className="font-bold text-gray-800 uppercase text-xs border-b pb-1">
                  {language === 'fr' ? 'Assiduité & Discipline' : 'Attendance & Conduct'}
                </h4>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Jours de Cours:</span>
                  <span className="font-bold">{reportStudentData.student.attendance.total} jours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Absences justifiées/non-justifiées:</span>
                  <span className="font-bold text-red-600">{reportStudentData.student.attendance.absent} jour(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Retards enregistrés:</span>
                  <span className="font-bold text-yellow-700">{reportStudentData.student.attendance.late} fois</span>
                </div>
                <div className="flex justify-between pt-1 border-t">
                  <span className="font-bold text-gray-700">Distinction / Sanction:</span>
                  <span className="font-bold text-green-700">
                    {reportStudentData.overallAvg20 >= 14 ? 'Tableau d\'Honneur' : reportStudentData.overallAvg20 >= 12 ? 'Encouragements' : 'Avertissement Travail'}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Signatures & Remarks */}
            <div className="grid grid-cols-3 gap-3 border border-gray-300 rounded-xl p-4 text-xs mt-4">
              <div className="text-center h-28 flex flex-col justify-between border-r pr-2">
                <span className="font-bold uppercase text-gray-700">Le Professeur Principal</span>
                <p className="italic text-[11px] text-gray-600">
                  {reportStudentData.overallAvg20 >= 12 ? 'Très bon trimestre, continuez ainsi.' : 'Des efforts supplémentaires sont requis.'}
                </p>
                <div className="border-t border-dashed pt-1 text-[10px] text-gray-400">Signature</div>
              </div>

              <div className="text-center h-28 flex flex-col justify-between border-r pr-2">
                <span className="font-bold uppercase text-gray-700">Avis des Parents</span>
                <p className="text-[10px] text-gray-400">Vu et pris connaissance le: ...../...../2024</p>
                <div className="border-t border-dashed pt-1 text-[10px] text-gray-400">Signature du Parent</div>
              </div>

              <div className="text-center h-28 flex flex-col justify-between">
                <span className="font-bold uppercase text-indigo-950">Le Principal / Proviseur</span>
                <div className="h-8 flex items-center justify-center">
                  <span className="text-[10px] text-indigo-800 font-mono">[Sceau Officiel de l'Établissement]</span>
                </div>
                <div className="border-t border-dashed pt-1 text-[10px] text-gray-400">Cachet & Signature</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradebookManager;
