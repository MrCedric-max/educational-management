import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  Search,
  Download,
  Printer,
  Send,
  History,
  Save,
  CheckCheck,
  UserX
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export interface StudentAttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  gender: 'male' | 'female';
  status: 'present' | 'absent' | 'late' | 'excused';
  timeIn?: string;
  reason?: string;
  parentName: string;
  parentPhone: string;
  attendanceHistory?: { date: string; status: 'present' | 'absent' | 'late' | 'excused' }[];
}

interface ClassOption {
  id: string;
  name: string;
  level: string;
  system: 'anglophone' | 'francophone';
}

const mockClasses: ClassOption[] = [
  { id: 'class_1', name: 'Form 3A', level: 'Secondary Form 3', system: 'anglophone' },
  { id: 'class_2', name: '3ème A', level: 'Collège 3ème', system: 'francophone' },
  { id: 'class_3', name: 'Form 4B', level: 'Secondary Form 4', system: 'anglophone' },
  { id: 'class_4', name: 'Première C', level: 'Lycée Première', system: 'francophone' },
  { id: 'class_5', name: 'Upper Sixth Arts', level: 'High School U6', system: 'anglophone' }
];

const initialStudentsByClass: Record<string, StudentAttendanceRecord[]> = {
  class_1: [
    { id: 'att_1', studentId: 's1', studentName: 'Emma Johnson', studentNumber: 'STU-2024-001', gender: 'female', status: 'present', parentName: 'Robert Johnson', parentPhone: '+237 671 234 567' },
    { id: 'att_2', studentId: 's2', studentName: 'Michael Brown', studentNumber: 'STU-2024-002', gender: 'male', status: 'present', parentName: 'David Brown', parentPhone: '+237 677 889 900' },
    { id: 'att_3', studentId: 's3', studentName: 'Sophia Davis', studentNumber: 'STU-2024-003', gender: 'female', status: 'late', timeIn: '08:15', reason: 'Heavy traffic at Carrefour Obili', parentName: 'Grace Davis', parentPhone: '+237 675 112 233' },
    { id: 'att_4', studentId: 's4', studentName: 'James Wilson', studentNumber: 'STU-2024-004', gender: 'male', status: 'absent', reason: 'Flu / Sick leave', parentName: 'Peter Wilson', parentPhone: '+237 699 445 566' },
    { id: 'att_5', studentId: 's5', studentName: 'Olivia Miller', studentNumber: 'STU-2024-005', gender: 'female', status: 'present', parentName: 'Catherine Miller', parentPhone: '+237 680 990 011' },
    { id: 'att_6', studentId: 's6', studentName: 'Lucas Ngu', studentNumber: 'STU-2024-006', gender: 'male', status: 'present', parentName: 'Paul Ngu', parentPhone: '+237 674 332 211' },
    { id: 'att_7', studentId: 's7', studentName: 'Chantal Biya', studentNumber: 'STU-2024-007', gender: 'female', status: 'excused', reason: 'School choir competition', parentName: 'Marie Biya', parentPhone: '+237 691 554 433' },
    { id: 'att_8', studentId: 's8', studentName: 'Brendan Forchu', studentNumber: 'STU-2024-008', gender: 'male', status: 'present', parentName: 'Stephen Forchu', parentPhone: '+237 678 123 456' }
  ],
  class_2: [
    { id: 'att_9', studentId: 's9', studentName: 'Jean-Pierre Kamga', studentNumber: 'STU-2024-009', gender: 'male', status: 'present', parentName: 'Alain Kamga', parentPhone: '+237 699 112 233' },
    { id: 'att_10', studentId: 's10', studentName: 'Amina Oumarou', studentNumber: 'STU-2024-010', gender: 'female', status: 'present', parentName: 'Hamidou Oumarou', parentPhone: '+237 698 223 344' },
    { id: 'att_11', studentId: 's11', studentName: 'Marc Essomba', studentNumber: 'STU-2024-011', gender: 'male', status: 'absent', reason: 'Rendez-vous médical', parentName: 'Madeleine Essomba', parentPhone: '+237 697 334 455' },
    { id: 'att_12', studentId: 's12', studentName: 'Sandrine Mbarga', studentNumber: 'STU-2024-012', gender: 'female', status: 'present', parentName: 'Joseph Mbarga', parentPhone: '+237 696 445 566' },
    { id: 'att_13', studentId: 's13', studentName: 'Cédric Talla', studentNumber: 'STU-2024-013', gender: 'male', status: 'late', timeIn: '08:10', reason: 'Pluie torrentielle', parentName: 'Béatrice Talla', parentPhone: '+237 695 556 677' }
  ],
  class_3: [
    { id: 'att_14', studentId: 's14', studentName: 'Liam Garcia', studentNumber: 'STU-2024-014', gender: 'male', status: 'present', parentName: 'Carlos Garcia', parentPhone: '+237 677 111 222' },
    { id: 'att_15', studentId: 's15', studentName: 'Ava Martinez', studentNumber: 'STU-2024-015', gender: 'female', status: 'present', parentName: 'Elena Martinez', parentPhone: '+237 678 222 333' },
    { id: 'att_16', studentId: 's16', studentName: 'Noah Rodriguez', studentNumber: 'STU-2024-016', gender: 'male', status: 'present', parentName: 'Daniel Rodriguez', parentPhone: '+237 679 333 444' }
  ],
  class_4: [
    { id: 'att_17', studentId: 's17', studentName: 'Christelle Onana', studentNumber: 'STU-2024-017', gender: 'female', status: 'present', parentName: 'André Onana', parentPhone: '+237 690 123 456' },
    { id: 'att_18', studentId: 's18', studentName: 'Brice Fopoussi', studentNumber: 'STU-2024-018', gender: 'male', status: 'present', parentName: 'Jeanne Fopoussi', parentPhone: '+237 691 234 567' }
  ],
  class_5: [
    { id: 'att_19', studentId: 's19', studentName: 'Dorothy Tamba', studentNumber: 'STU-2024-019', gender: 'female', status: 'present', parentName: 'Elias Tamba', parentPhone: '+237 670 998 877' },
    { id: 'att_20', studentId: 's20', studentName: 'George Ndive', studentNumber: 'STU-2024-020', gender: 'male', status: 'present', parentName: 'Hannah Ndive', parentPhone: '+237 671 887 766' }
  ]
};

export const AttendanceManager: React.FC = () => {
  const { language } = useAuth();
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedClassId, setSelectedClassId] = useState<string>('class_1');
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent' | 'late' | 'excused'>('all');
  const [records, setRecords] = useState<StudentAttendanceRecord[]>([]);
  const [selectedStudentHistory, setSelectedStudentHistory] = useState<StudentAttendanceRecord | null>(null);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTargetStudent, setAlertTargetStudent] = useState<StudentAttendanceRecord | null>(null);
  const [alertChannel, setAlertChannel] = useState<'sms' | 'whatsapp' | 'email'>('sms');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Load records from localStorage or fallback
  useEffect(() => {
    const storageKey = `ems_attendance_${selectedClassId}_${selectedDate}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
        setHasUnsavedChanges(false);
        return;
      } catch (e) {
        console.error('Error parsing stored attendance', e);
      }
    }

    const defaultStudents = initialStudentsByClass[selectedClassId] || initialStudentsByClass['class_1'];
    // Generate slight variation if date is different
    const mapped = defaultStudents.map(student => ({
      ...student,
      attendanceHistory: [
        { date: '2024-10-10', status: 'present' as const },
        { date: '2024-10-11', status: 'present' as const },
        { date: '2024-10-12', status: student.studentId === 's4' ? 'absent' as const : 'present' as const },
        { date: '2024-10-13', status: student.studentId === 's3' ? 'late' as const : 'present' as const },
        { date: '2024-10-14', status: student.status }
      ]
    }));
    setRecords(mapped);
    setHasUnsavedChanges(false);
  }, [selectedClassId, selectedDate]);

  const currentClass = mockClasses.find(c => c.id === selectedClassId) || mockClasses[0];

  // Stats calculation
  const stats = useMemo(() => {
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    const excused = records.filter(r => r.status === 'excused').length;
    const presentPercentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { total, present, absent, late, excused, presentPercentage };
  }, [records]);

  // Filtered list
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.studentNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  // Handlers
  const handleStatusChange = (studentId: string, newStatus: 'present' | 'absent' | 'late' | 'excused') => {
    setRecords(prev => prev.map(rec => {
      if (rec.studentId === studentId) {
        return {
          ...rec,
          status: newStatus,
          timeIn: newStatus === 'late' ? (rec.timeIn || '08:15') : undefined
        };
      }
      return rec;
    }));
    setHasUnsavedChanges(true);
  };

  const handleReasonChange = (studentId: string, reason: string) => {
    setRecords(prev => prev.map(rec => {
      if (rec.studentId === studentId) {
        return { ...rec, reason };
      }
      return rec;
    }));
    setHasUnsavedChanges(true);
  };

  const handleMarkAll = (status: 'present' | 'absent') => {
    setRecords(prev => prev.map(rec => ({
      ...rec,
      status,
      timeIn: undefined
    })));
    setHasUnsavedChanges(true);
    toast.success(
      language === 'fr' 
        ? `Tous les élèves marqués comme ${status === 'present' ? 'présents' : 'absents'}`
        : `All students marked as ${status}`
    );
  };

  const handleSaveAttendance = () => {
    const storageKey = `ems_attendance_${selectedClassId}_${selectedDate}`;
    localStorage.setItem(storageKey, JSON.stringify(records));
    setHasUnsavedChanges(false);
    toast.success(language === 'fr' ? 'Présences enregistrées avec succès!' : 'Attendance saved successfully!');
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Full Name', 'Status', 'Time In', 'Reason', 'Parent Contact'];
    const rows = records.map(r => [
      `"${r.studentNumber}"`,
      `"${r.studentName}"`,
      `"${r.status}"`,
      `"${r.timeIn || '-'}"`,
      `"${r.reason || '-'}"`,
      `"${r.parentName} (${r.parentPhone})"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${currentClass.name}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(language === 'fr' ? 'Export CSV téléchargé!' : 'CSV export downloaded!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTriggerParentAlert = (student: StudentAttendanceRecord) => {
    setAlertTargetStudent(student);
    setShowAlertModal(true);
  };

  const handleSendNotification = () => {
    if (!alertTargetStudent) return;
    toast.success(
      language === 'fr'
        ? `Alerte ${alertChannel.toUpperCase()} envoyée à ${alertTargetStudent.parentName} (${alertTargetStudent.parentPhone})`
        : `${alertChannel.toUpperCase()} alert sent to ${alertTargetStudent.parentName} (${alertTargetStudent.parentPhone})`
    );
    setShowAlertModal(false);
    setAlertTargetStudent(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-7 w-7 text-blue-600" />
            {language === 'fr' ? 'Gestion des Présences Scolaires' : 'Student Attendance Management'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {language === 'fr'
              ? 'Enregistrez, surveillez et notifiez la présence quotidienne des élèves pour votre établissement.'
              : 'Track daily attendance, record absences and lates, and communicate instantly with parents.'}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-1.5 text-gray-500" />
            {language === 'fr' ? 'Exporter CSV' : 'Export CSV'}
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Printer className="h-4 w-4 mr-1.5 text-gray-500" />
            {language === 'fr' ? 'Imprimer' : 'Print'}
          </button>
          <button
            onClick={handleSaveAttendance}
            className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              hasUnsavedChanges ? 'bg-amber-600 hover:bg-amber-700 ring-2 ring-amber-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Save className="h-4 w-4 mr-1.5" />
            {hasUnsavedChanges
              ? (language === 'fr' ? 'Enregistrer *' : 'Save Changes *')
              : (language === 'fr' ? 'Enregistré' : 'Saved')}
          </button>
        </div>
      </div>

      {/* Class & Date Selector Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
            {language === 'fr' ? 'Classe / Niveau' : 'Class / Grade'}
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm font-medium py-2 px-3 border"
          >
            {mockClasses.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.level} - {c.system === 'anglophone' ? 'Anglophone' : 'Francophone'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
            {language === 'fr' ? 'Date de Présence' : 'Attendance Date'}
          </label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 border"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-5">
          <button
            onClick={() => handleMarkAll('present')}
            className="inline-flex items-center px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-xs font-semibold transition"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            {language === 'fr' ? 'Tous Présents' : 'Mark All Present'}
          </button>
          <button
            onClick={() => handleMarkAll('absent')}
            className="inline-flex items-center px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-semibold transition"
          >
            <UserX className="h-4 w-4 mr-1" />
            {language === 'fr' ? 'Tous Absents' : 'Mark All Absent'}
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>{language === 'fr' ? 'Taux de Présence' : 'Attendance Rate'}</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{stats.presentPercentage}%</span>
            <span className="text-xs text-gray-500">/ {stats.total} total</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${
                stats.presentPercentage >= 90 ? 'bg-green-500' : stats.presentPercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${stats.presentPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-green-50/50 p-4 rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-between text-green-700 text-xs font-medium">
            <span>{language === 'fr' ? 'Présents' : 'Present'}</span>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-green-800">{stats.present}</div>
          <p className="text-xs text-green-600 mt-1">{language === 'fr' ? 'À l\'heure' : 'On time'}</p>
        </div>

        <div className="bg-red-50/50 p-4 rounded-xl border border-red-200 shadow-sm">
          <div className="flex items-center justify-between text-red-700 text-xs font-medium">
            <span>{language === 'fr' ? 'Absents' : 'Absent'}</span>
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-red-800">{stats.absent}</div>
          <p className="text-xs text-red-600 mt-1">{language === 'fr' ? 'Non justifié' : 'Unexcused'}</p>
        </div>

        <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-200 shadow-sm">
          <div className="flex items-center justify-between text-yellow-700 text-xs font-medium">
            <span>{language === 'fr' ? 'En Retard' : 'Late'}</span>
            <Clock className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-yellow-800">{stats.late}</div>
          <p className="text-xs text-yellow-600 mt-1">{language === 'fr' ? 'Après 08:00' : 'Arrived late'}</p>
        </div>

        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between text-blue-700 text-xs font-medium">
            <span>{language === 'fr' ? 'Dispensés / Excusés' : 'Excused'}</span>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-800">{stats.excused}</div>
          <p className="text-xs text-blue-600 mt-1">{language === 'fr' ? 'Justificatif validé' : 'Authorized leave'}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={language === 'fr' ? 'Rechercher élève par nom ou matricule...' : 'Search student by name or ID...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {(['all', 'present', 'absent', 'late', 'excused'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-xs font-medium rounded-full capitalize whitespace-nowrap transition ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' 
                ? (language === 'fr' ? 'Tous' : 'All') 
                : status === 'present'
                ? (language === 'fr' ? 'Présents' : 'Present')
                : status === 'absent'
                ? (language === 'fr' ? 'Absents' : 'Absent')
                : status === 'late'
                ? (language === 'fr' ? 'Retards' : 'Late')
                : (language === 'fr' ? 'Excusés' : 'Excused')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Student Attendance Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === 'fr' ? 'Élève / Matricule' : 'Student / ID'}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === 'fr' ? 'Statut de Présence' : 'Attendance Status'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === 'fr' ? 'Motif / Remarque' : 'Reason / Note'}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === 'fr' ? 'Actions & Alertes' : 'Actions & Alerts'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 text-sm">
                    {language === 'fr' ? 'Aucun élève trouvé.' : 'No students found matching your criteria.'}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  return (
                    <tr key={record.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Student Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                            record.gender === 'female' ? 'bg-pink-500' : 'bg-blue-600'
                          }`}>
                            {record.studentName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">{record.studentName}</div>
                            <div className="text-xs text-gray-500 font-mono">{record.studentNumber}</div>
                          </div>
                        </div>
                      </td>

                      {/* Status Selector Buttons */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 shadow-inner">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(record.studentId, 'present')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                              record.status === 'present'
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-green-600 hover:bg-white'
                            }`}
                          >
                            {language === 'fr' ? 'Présent' : 'Present'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(record.studentId, 'absent')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                              record.status === 'absent'
                                ? 'bg-red-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-red-600 hover:bg-white'
                            }`}
                          >
                            {language === 'fr' ? 'Absent' : 'Absent'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(record.studentId, 'late')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                              record.status === 'late'
                                ? 'bg-yellow-500 text-white shadow-sm'
                                : 'text-gray-600 hover:text-yellow-600 hover:bg-white'
                            }`}
                          >
                            {language === 'fr' ? 'Retard' : 'Late'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(record.studentId, 'excused')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                              record.status === 'excused'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-blue-600 hover:bg-white'
                            }`}
                          >
                            {language === 'fr' ? 'Excusé' : 'Excused'}
                          </button>
                        </div>
                      </td>

                      {/* Reason / Note input */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 max-w-xs">
                          {record.status === 'late' && (
                            <input
                              type="time"
                              value={record.timeIn || '08:15'}
                              onChange={(e) => {
                                setRecords(prev => prev.map(r => r.studentId === record.studentId ? { ...r, timeIn: e.target.value } : r));
                                setHasUnsavedChanges(true);
                              }}
                              className="text-xs border border-gray-300 rounded px-1.5 py-1 w-20"
                            />
                          )}
                          <input
                            type="text"
                            placeholder={
                              record.status === 'absent' || record.status === 'late' || record.status === 'excused'
                                ? (language === 'fr' ? 'Ajouter un motif...' : 'Specify reason...')
                                : (language === 'fr' ? 'Remarque optionnelle' : 'Optional note')
                            }
                            value={record.reason || ''}
                            onChange={(e) => handleReasonChange(record.studentId, e.target.value)}
                            className="text-xs border border-gray-200 rounded px-2.5 py-1 w-full focus:outline-none focus:border-blue-400"
                          />
                        </div>
                      </td>

                      {/* Action buttons: Alert parent & History */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-2">
                        {(record.status === 'absent' || record.status === 'late') && (
                          <button
                            type="button"
                            onClick={() => handleTriggerParentAlert(record)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition"
                            title={language === 'fr' ? 'Alerter les parents' : 'Alert Parents'}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            {language === 'fr' ? 'Alerter' : 'Alert'}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedStudentHistory(record)}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition"
                          title={language === 'fr' ? 'Voir l\'historique' : 'View History'}
                        >
                          <History className="h-3 w-3 mr-1 text-gray-500" />
                          {language === 'fr' ? 'Historique' : 'History'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Attendance History Drawer / Modal */}
      {selectedStudentHistory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedStudentHistory.studentName}</h3>
                <p className="text-xs text-gray-500 font-mono">{selectedStudentHistory.studentNumber} • {currentClass.name}</p>
              </div>
              <button
                onClick={() => setSelectedStudentHistory(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800">
                <span className="font-semibold">{language === 'fr' ? 'Parent Contact :' : 'Parent Contact:'}</span>{' '}
                {selectedStudentHistory.parentName} ({selectedStudentHistory.parentPhone})
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  {language === 'fr' ? 'Présences des 5 Derniers Jours' : 'Recent 5-Day Attendance Track'}
                </h4>
                <div className="space-y-2">
                  {selectedStudentHistory.attendanceHistory?.map((h, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-gray-50 border text-xs">
                      <span className="font-medium text-gray-700">{h.date}</span>
                      <span className={`px-2 py-0.5 rounded font-semibold capitalize ${
                        h.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : h.status === 'absent'
                          ? 'bg-red-100 text-red-800'
                          : h.status === 'late'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {h.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedStudentHistory(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
              >
                {language === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parent Alert Modal */}
      {showAlertModal && alertTargetStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  {language === 'fr' ? 'Notifier le Parent d\'Élève' : 'Send Absence Notification'}
                </h3>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-800">
                {language === 'fr'
                  ? `Une notification instantanée sera transmise au parent de ${alertTargetStudent.studentName}.`
                  : `An instant notification will be dispatched to ${alertTargetStudent.studentName}'s parent/guardian.`}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Destinataire' : 'Recipient'}
                </label>
                <div className="text-sm font-semibold text-gray-900">
                  {alertTargetStudent.parentName} ({alertTargetStudent.parentPhone})
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Canal d\'envoi' : 'Communication Channel'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['sms', 'whatsapp', 'email'] as const).map(ch => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setAlertChannel(ch)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border capitalize transition ${
                        alertChannel === ch
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Aperçu du Message' : 'Message Preview'}
                </label>
                <div className="p-3 bg-gray-50 border rounded-lg text-xs text-gray-700 font-mono">
                  {language === 'fr'
                    ? `[Collège/Lycée] Bonjour M./Mme ${alertTargetStudent.parentName}, nous vous informons que votre enfant ${alertTargetStudent.studentName} (${currentClass.name}) est marqué(e) ${alertTargetStudent.status.toUpperCase()} ce ${selectedDate}. Contact: 237-670000000.`
                    : `[School Admin] Dear ${alertTargetStudent.parentName}, please be informed that your child ${alertTargetStudent.studentName} (${currentClass.name}) has been marked ${alertTargetStudent.status.toUpperCase()} on ${selectedDate}. Reason: ${alertTargetStudent.reason || 'Unspecified'}.`}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAlertModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={handleSendNotification}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Send className="h-4 w-4" />
                {language === 'fr' ? 'Envoyer l\'alerte' : 'Send Alert'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManager;
