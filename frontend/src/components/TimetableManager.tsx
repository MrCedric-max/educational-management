import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Trash2,
  Edit,
  Printer,
  Download,
  AlertTriangle,
  BookOpen,
  User,
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TimetableSlot } from '../types/database';

interface PeriodDefinition {
  periodNumber: number;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  label?: string;
}

const PERIOD_SCHEDULE: PeriodDefinition[] = [
  { periodNumber: 1, startTime: '07:30', endTime: '08:25' },
  { periodNumber: 2, startTime: '08:25', endTime: '09:20' },
  { periodNumber: 3, startTime: '09:20', endTime: '10:15' },
  { periodNumber: 0, startTime: '10:15', endTime: '10:45', isBreak: true, label: 'Morning Break / Récréation' },
  { periodNumber: 4, startTime: '10:45', endTime: '11:40' },
  { periodNumber: 5, startTime: '11:40', endTime: '12:35' },
  { periodNumber: 0, startTime: '12:35', endTime: '13:20', isBreak: true, label: 'Lunch Break / Pause Déjeuner' },
  { periodNumber: 6, startTime: '13:20', endTime: '14:15' },
  { periodNumber: 7, startTime: '14:15', endTime: '15:10' }
];

const DAYS = [
  { id: 1, name: 'Monday', nameFr: 'Lundi' },
  { id: 2, name: 'Tuesday', nameFr: 'Mardi' },
  { id: 3, name: 'Wednesday', nameFr: 'Mercredi' },
  { id: 4, name: 'Thursday', nameFr: 'Jeudi' },
  { id: 5, name: 'Friday', nameFr: 'Vendredi' }
];

const mockClasses = [
  { id: 'class_1', name: 'Form 3A', system: 'anglophone' as const },
  { id: 'class_2', name: '3ème A', system: 'francophone' as const },
  { id: 'class_3', name: 'Form 4B', system: 'anglophone' as const },
  { id: 'class_4', name: 'Première C', system: 'francophone' as const }
];

const mockTeachers = [
  { id: 't1', name: 'Mr. Cedric Mbida', subject: 'Mathematics' },
  { id: 't2', name: 'Mrs. Marie Martin', subject: 'French Language' },
  { id: 't3', name: 'Mr. John Doe', subject: 'Physics' },
  { id: 't4', name: 'Dr. Sarah Smith', subject: 'Biology' },
  { id: 't5', name: 'Mr. Paul Ngu', subject: 'History & Civics' },
  { id: 't6', name: 'Ms. Clara Fon', subject: 'English Language' },
  { id: 't7', name: 'Mr. Eric Tagne', subject: 'Computer Science' }
];

const initialSlots: TimetableSlot[] = [
  // Monday Form 3A
  { id: 's1', classId: 'class_1', className: 'Form 3A', subjectId: 'math', subjectName: 'Mathematics', teacherId: 't1', teacherName: 'Mr. Cedric Mbida', dayOfWeek: 1, periodNumber: 1, startTime: '07:30', endTime: '08:25', room: 'Room 101', system: 'anglophone', color: 'blue' },
  { id: 's2', classId: 'class_1', className: 'Form 3A', subjectId: 'math', subjectName: 'Mathematics', teacherId: 't1', teacherName: 'Mr. Cedric Mbida', dayOfWeek: 1, periodNumber: 2, startTime: '08:25', endTime: '09:20', room: 'Room 101', system: 'anglophone', color: 'blue' },
  { id: 's3', classId: 'class_1', className: 'Form 3A', subjectId: 'eng', subjectName: 'English Language', teacherId: 't6', teacherName: 'Ms. Clara Fon', dayOfWeek: 1, periodNumber: 3, startTime: '09:20', endTime: '10:15', room: 'Room 101', system: 'anglophone', color: 'emerald' },
  { id: 's4', classId: 'class_1', className: 'Form 3A', subjectId: 'phy', subjectName: 'Physics', teacherId: 't3', teacherName: 'Mr. John Doe', dayOfWeek: 1, periodNumber: 4, startTime: '10:45', endTime: '11:40', room: 'Lab 1', system: 'anglophone', color: 'purple' },
  { id: 's5', classId: 'class_1', className: 'Form 3A', subjectId: 'cs', subjectName: 'Computer Science', teacherId: 't7', teacherName: 'Mr. Eric Tagne', dayOfWeek: 1, periodNumber: 5, startTime: '11:40', endTime: '12:35', room: 'IT Lab', system: 'anglophone', color: 'amber' },
  { id: 's6', classId: 'class_1', className: 'Form 3A', subjectId: 'hist', subjectName: 'History & Civics', teacherId: 't5', teacherName: 'Mr. Paul Ngu', dayOfWeek: 1, periodNumber: 6, startTime: '13:20', endTime: '14:15', room: 'Room 101', system: 'anglophone', color: 'rose' },

  // Tuesday Form 3A
  { id: 's7', classId: 'class_1', className: 'Form 3A', subjectId: 'fr', subjectName: 'French Language', teacherId: 't2', teacherName: 'Mrs. Marie Martin', dayOfWeek: 2, periodNumber: 1, startTime: '07:30', endTime: '08:25', room: 'Room 101', system: 'anglophone', color: 'emerald' },
  { id: 's8', classId: 'class_1', className: 'Form 3A', subjectId: 'bio', subjectName: 'Biology', teacherId: 't4', teacherName: 'Dr. Sarah Smith', dayOfWeek: 2, periodNumber: 2, startTime: '08:25', endTime: '09:20', room: 'Biology Lab', system: 'anglophone', color: 'teal' },
  { id: 's9', classId: 'class_1', className: 'Form 3A', subjectId: 'math', subjectName: 'Mathematics', teacherId: 't1', teacherName: 'Mr. Cedric Mbida', dayOfWeek: 2, periodNumber: 3, startTime: '09:20', endTime: '10:15', room: 'Room 101', system: 'anglophone', color: 'blue' },
  { id: 's10', classId: 'class_1', className: 'Form 3A', subjectId: 'eng', subjectName: 'English Language', teacherId: 't6', teacherName: 'Ms. Clara Fon', dayOfWeek: 2, periodNumber: 4, startTime: '10:45', endTime: '11:40', room: 'Room 101', system: 'anglophone', color: 'emerald' },

  // Wednesday Form 3A
  { id: 's11', classId: 'class_1', className: 'Form 3A', subjectId: 'phy', subjectName: 'Physics', teacherId: 't3', teacherName: 'Mr. John Doe', dayOfWeek: 3, periodNumber: 1, startTime: '07:30', endTime: '08:25', room: 'Lab 1', system: 'anglophone', color: 'purple' },
  { id: 's12', classId: 'class_1', className: 'Form 3A', subjectId: 'bio', subjectName: 'Biology', teacherId: 't4', teacherName: 'Dr. Sarah Smith', dayOfWeek: 3, periodNumber: 2, startTime: '08:25', endTime: '09:20', room: 'Biology Lab', system: 'anglophone', color: 'teal' },
  { id: 's13', classId: 'class_1', className: 'Form 3A', subjectId: 'fr', subjectName: 'French Language', teacherId: 't2', teacherName: 'Mrs. Marie Martin', dayOfWeek: 3, periodNumber: 3, startTime: '09:20', endTime: '10:15', room: 'Room 101', system: 'anglophone', color: 'emerald' },

  // Thursday Form 3A
  { id: 's14', classId: 'class_1', className: 'Form 3A', subjectId: 'math', subjectName: 'Mathematics', teacherId: 't1', teacherName: 'Mr. Cedric Mbida', dayOfWeek: 4, periodNumber: 1, startTime: '07:30', endTime: '08:25', room: 'Room 101', system: 'anglophone', color: 'blue' },
  { id: 's15', classId: 'class_1', className: 'Form 3A', subjectId: 'cs', subjectName: 'Computer Science', teacherId: 't7', teacherName: 'Mr. Eric Tagne', dayOfWeek: 4, periodNumber: 2, startTime: '08:25', endTime: '09:20', room: 'IT Lab', system: 'anglophone', color: 'amber' },

  // Friday Form 3A
  { id: 's16', classId: 'class_1', className: 'Form 3A', subjectId: 'eng', subjectName: 'English Language', teacherId: 't6', teacherName: 'Ms. Clara Fon', dayOfWeek: 5, periodNumber: 1, startTime: '07:30', endTime: '08:25', room: 'Room 101', system: 'anglophone', color: 'emerald' },
  { id: 's17', classId: 'class_1', className: 'Form 3A', subjectId: 'hist', subjectName: 'History & Civics', teacherId: 't5', teacherName: 'Mr. Paul Ngu', dayOfWeek: 5, periodNumber: 2, startTime: '08:25', endTime: '09:20', room: 'Room 101', system: 'anglophone', color: 'rose' }
];

export const TimetableManager: React.FC = () => {
  const { language } = useAuth();
  const navigate = useNavigate();

  const [viewType, setViewType] = useState<'class' | 'teacher'>('class');
  const [selectedClassId, setSelectedClassId] = useState<string>('class_1');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('t1');
  const [allSlots, setAllSlots] = useState<TimetableSlot[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

  // New slot form state
  const [formDay, setFormDay] = useState<number>(1);
  const [formPeriod, setFormPeriod] = useState<number>(1);
  const [formSubject, setFormSubject] = useState<string>('Mathematics');
  const [formTeacherId, setFormTeacherId] = useState<string>('t1');
  const [formRoom, setFormRoom] = useState<string>('Room 101');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('ems_timetables');
    if (saved) {
      try {
        setAllSlots(JSON.parse(saved));
        return;
      } catch (e) {
        console.error(e);
      }
    }
    setAllSlots(initialSlots);
  }, []);

  const saveSlots = (newSlots: TimetableSlot[]) => {
    setAllSlots(newSlots);
    localStorage.setItem('ems_timetables', JSON.stringify(newSlots));
  };

  const currentClass = mockClasses.find(c => c.id === selectedClassId) || mockClasses[0];
  const currentTeacher = mockTeachers.find(t => t.id === selectedTeacherId) || mockTeachers[0];

  // Filter slots for currently active view
  const activeSlots = useMemo(() => {
    if (viewType === 'class') {
      return allSlots.filter(s => s.classId === selectedClassId);
    } else {
      return allSlots.filter(s => s.teacherId === selectedTeacherId);
    }
  }, [allSlots, viewType, selectedClassId, selectedTeacherId]);

  // Conflict Checker
  const checkConflicts = (day: number, period: number, teacherId: string, room: string, currentSlotId?: string) => {
    const conflictTeacher = allSlots.find(s => 
      s.id !== currentSlotId &&
      s.dayOfWeek === day &&
      s.periodNumber === period &&
      s.teacherId === teacherId
    );
    if (conflictTeacher) {
      return language === 'fr'
        ? `Attention: L'enseignant ${conflictTeacher.teacherName} a déjà un cours avec ${conflictTeacher.className || 'une autre classe'} à cette période!`
        : `Warning: Teacher ${conflictTeacher.teacherName} is already scheduled with ${conflictTeacher.className || 'another class'} during this period!`;
    }

    const conflictRoom = allSlots.find(s =>
      s.id !== currentSlotId &&
      s.dayOfWeek === day &&
      s.periodNumber === period &&
      s.room.toLowerCase().trim() === room.toLowerCase().trim()
    );
    if (conflictRoom) {
      return language === 'fr'
        ? `Attention: La salle "${room}" est déjà occupée par ${conflictRoom.className || 'une classe'}!`
        : `Warning: Room "${room}" is already booked by ${conflictRoom.className || 'a class'}!`;
    }

    return null;
  };

  const handleOpenAddModal = (day: number, period: number) => {
    setEditingSlot(null);
    setFormDay(day);
    setFormPeriod(period);
    setFormSubject('Mathematics');
    setFormTeacherId('t1');
    setFormRoom('Room 101');
    setConflictWarning(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setFormDay(slot.dayOfWeek);
    setFormPeriod(slot.periodNumber);
    setFormSubject(slot.subjectName);
    setFormTeacherId(slot.teacherId);
    setFormRoom(slot.room);
    setConflictWarning(null);
    setModalOpen(true);
  };

  const handleSaveModal = () => {
    const warning = checkConflicts(formDay, formPeriod, formTeacherId, formRoom, editingSlot?.id);
    if (warning) {
      setConflictWarning(warning);
      return;
    }

    const teacher = mockTeachers.find(t => t.id === formTeacherId) || mockTeachers[0];
    const periodDef = PERIOD_SCHEDULE.find(p => p.periodNumber === formPeriod);
    const startTime = periodDef?.startTime || '07:30';
    const endTime = periodDef?.endTime || '08:25';

    // Color by subject
    let color = 'blue';
    const subLow = formSubject.toLowerCase();
    if (subLow.includes('french') || subLow.includes('english') || subLow.includes('lang')) color = 'emerald';
    else if (subLow.includes('physic') || subLow.includes('chem')) color = 'purple';
    else if (subLow.includes('bio')) color = 'teal';
    else if (subLow.includes('hist') || subLow.includes('geo')) color = 'rose';
    else if (subLow.includes('comp') || subLow.includes('ict')) color = 'amber';

    if (editingSlot) {
      const updated = allSlots.map(s => {
        if (s.id === editingSlot.id) {
          return {
            ...s,
            dayOfWeek: formDay as any,
            periodNumber: formPeriod,
            startTime,
            endTime,
            subjectName: formSubject,
            teacherId: formTeacherId,
            teacherName: teacher.name,
            room: formRoom,
            color
          };
        }
        return s;
      });
      saveSlots(updated);
      toast.success(language === 'fr' ? 'Créneau mis à jour' : 'Period updated');
    } else {
      const newSlot: TimetableSlot = {
        id: 'slot_' + Date.now(),
        classId: selectedClassId,
        className: currentClass.name,
        subjectId: formSubject.toLowerCase().replace(/\s+/g, '-'),
        subjectName: formSubject,
        teacherId: formTeacherId,
        teacherName: teacher.name,
        dayOfWeek: formDay as any,
        periodNumber: formPeriod,
        startTime,
        endTime,
        room: formRoom,
        system: currentClass.system,
        color
      };
      saveSlots([...allSlots, newSlot]);
      toast.success(language === 'fr' ? 'Nouveau créneau ajouté' : 'New period added');
    }

    setModalOpen(false);
  };

  const handleDeleteSlot = (slotId: string) => {
    saveSlots(allSlots.filter(s => s.id !== slotId));
    toast.success(language === 'fr' ? 'Créneau supprimé' : 'Period removed');
  };

  // Export Timetable to iCal (.ics) format
  const handleExportICal = () => {
    const calendarEvents = activeSlots.map(slot => {
      return [
        'BEGIN:VEVENT',
        `SUMMARY:${slot.subjectName} - ${slot.className || currentClass.name}`,
        `DESCRIPTION:Teacher: ${slot.teacherName} | Room: ${slot.room}`,
        `LOCATION:${slot.room}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      ].join('\r\n');
    }).join('\r\n');

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Cameroon Educational Management System//Timetable//EN',
      'CALSCALE:GREGORIAN',
      calendarEvents,
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Timetable_${viewType === 'class' ? currentClass.name : currentTeacher.name}.ics`;
    link.click();
    toast.success(
      language === 'fr'
        ? 'Export calendrier (iCal / Google Calendar) téléchargé!'
        : 'Calendar export (.ics) downloaded! Ready to import into Google Calendar.'
    );
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100';
      case 'purple':
        return 'bg-purple-50 border-purple-300 text-purple-900 hover:bg-purple-100';
      case 'teal':
        return 'bg-teal-50 border-teal-300 text-teal-900 hover:bg-teal-100';
      case 'rose':
        return 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100';
      case 'amber':
        return 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100';
      case 'blue':
      default:
        return 'bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-7 w-7 text-blue-600" />
            {language === 'fr' ? 'Emploi du Temps Scolaire' : 'Class Timetable & Scheduling'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {language === 'fr'
              ? 'Organisez les créneaux horaires, évitez les conflits de salles/profs et synchronisez avec vos cours.'
              : 'Manage weekly schedules, detect room & teacher conflicts, and export to Google Calendar.'}
          </p>
        </div>

        {/* Global Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportICal}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-1.5 text-gray-500" />
            {language === 'fr' ? 'Sync Calendrier (.ics)' : 'Export to Google Calendar'}
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Printer className="h-4 w-4 mr-1.5 text-gray-500" />
            {language === 'fr' ? 'Imprimer' : 'Print'}
          </button>
        </div>
      </div>

      {/* View Switcher & Selection Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Toggle Mode */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
            {language === 'fr' ? 'Mode d\'Affichage' : 'Schedule View Mode'}
          </label>
          <div className="inline-flex rounded-lg border border-gray-300 p-0.5 bg-gray-50 w-full">
            <button
              onClick={() => setViewType('class')}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition ${
                viewType === 'class' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {language === 'fr' ? 'Par Classe' : 'By Class'}
            </button>
            <button
              onClick={() => setViewType('teacher')}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition ${
                viewType === 'teacher' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {language === 'fr' ? 'Par Enseignant' : 'By Teacher'}
            </button>
          </div>
        </div>

        {/* Class or Teacher Select */}
        <div className="md:col-span-2">
          {viewType === 'class' ? (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                {language === 'fr' ? 'Sélectionner la Classe' : 'Select Class'}
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm font-medium py-2 px-3 border"
              >
                {mockClasses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.system === 'anglophone' ? 'Anglophone System' : 'Système Francophone'})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                {language === 'fr' ? 'Sélectionner l\'Enseignant' : 'Select Teacher'}
              </label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm font-medium py-2 px-3 border"
              >
                {mockTeachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.subject}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            {viewType === 'class' 
              ? `${currentClass.name} — Weekly Schedule (07:30 - 15:10)` 
              : `${currentTeacher.name} (${currentTeacher.subject}) — Weekly Teaching Hours`}
          </div>
          <span className="text-xs text-gray-500">
            {language === 'fr' ? 'Cliquez sur + pour ajouter un cours' : 'Click + on any slot to add a class'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100/70 border-b">
                <th className="p-3 text-xs font-bold text-gray-600 uppercase w-28 text-center border-r">
                  {language === 'fr' ? 'Horaire' : 'Period / Time'}
                </th>
                {DAYS.map(day => (
                  <th key={day.id} className="p-3 text-xs font-bold text-gray-700 uppercase border-r text-center w-1/5">
                    {language === 'fr' ? day.nameFr : day.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIOD_SCHEDULE.map((period, pIdx) => {
                if (period.isBreak) {
                  return (
                    <tr key={`break_${pIdx}`} className="bg-amber-50/70 border-b">
                      <td className="p-2 text-center text-xs font-bold text-amber-800 border-r">
                        {period.startTime} - {period.endTime}
                      </td>
                      <td colSpan={5} className="p-2 text-center text-xs font-bold text-amber-800 tracking-wider">
                        ☕ {period.label}
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={`period_${period.periodNumber}`} className="border-b hover:bg-gray-50/50">
                    {/* Period header */}
                    <td className="p-3 text-center border-r bg-gray-50/40">
                      <div className="font-bold text-xs text-gray-800">
                        P{period.periodNumber}
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                        {period.startTime} - {period.endTime}
                      </div>
                    </td>

                    {/* 5 Day Cells */}
                    {DAYS.map(day => {
                      const slot = activeSlots.find(
                        s => s.dayOfWeek === day.id && s.periodNumber === period.periodNumber
                      );

                      return (
                        <td key={day.id} className="p-2 border-r align-top relative min-h-[90px] h-24">
                          {slot ? (
                            <div className={`h-full p-2.5 rounded-lg border flex flex-col justify-between transition group shadow-sm ${getColorClasses(slot.color)}`}>
                              <div>
                                <div className="font-bold text-xs truncate">
                                  {slot.subjectName}
                                </div>
                                <div className="text-[11px] flex items-center gap-1 mt-1 opacity-80">
                                  <User className="h-3 w-3" />
                                  <span className="truncate">
                                    {viewType === 'class' ? slot.teacherName : (slot.className || currentClass.name)}
                                  </span>
                                </div>
                                <div className="text-[10px] flex items-center gap-1 mt-0.5 opacity-70">
                                  <MapPin className="h-3 w-3" />
                                  <span>{slot.room}</span>
                                </div>
                              </div>

                              {/* Card Action footer */}
                              <div className="flex items-center justify-between pt-1 border-t border-black/10 mt-1">
                                <button
                                  onClick={() => navigate('/lesson-planner')}
                                  className="text-[10px] font-semibold flex items-center gap-0.5 text-blue-700 hover:underline"
                                  title={language === 'fr' ? 'Créer la fiche de cours' : 'Plan Lesson'}
                                >
                                  <BookOpen className="h-3 w-3" />
                                  {language === 'fr' ? 'Fiche' : 'Plan'}
                                </button>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                  <button
                                    onClick={() => handleOpenEditModal(slot)}
                                    className="p-1 hover:bg-black/10 rounded"
                                    title="Edit"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSlot(slot.id)}
                                    className="p-1 hover:bg-black/10 rounded text-red-600"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => handleOpenAddModal(day.id, period.periodNumber)}
                              className="h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition text-gray-400 hover:text-blue-600"
                              title={language === 'fr' ? 'Ajouter un cours' : 'Add class slot'}
                            >
                              <Plus className="h-4 w-4" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Slot Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingSlot
                  ? (language === 'fr' ? 'Modifier le Créneau' : 'Edit Class Slot')
                  : (language === 'fr' ? 'Nouveau Créneau Horaire' : 'Add Class Slot')}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {conflictWarning && (
              <div className="mb-4 bg-red-50 border border-red-200 p-3 rounded-lg flex items-start gap-2 text-xs text-red-700">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>{conflictWarning}</div>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {language === 'fr' ? 'Jour' : 'Day of Week'}
                  </label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(parseInt(e.target.value))}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2"
                  >
                    {DAYS.map(d => (
                      <option key={d.id} value={d.id}>
                        {language === 'fr' ? d.nameFr : d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {language === 'fr' ? 'Période' : 'Period'}
                  </label>
                  <select
                    value={formPeriod}
                    onChange={(e) => setFormPeriod(parseInt(e.target.value))}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2"
                  >
                    {PERIOD_SCHEDULE.filter(p => !p.isBreak).map(p => (
                      <option key={p.periodNumber} value={p.periodNumber}>
                        P{p.periodNumber} ({p.startTime} - {p.endTime})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Matière / Discipline' : 'Subject'}
                </label>
                <input
                  type="text"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2"
                  placeholder="e.g. Mathematics, French, Biology..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Enseignant Responsable' : 'Assigned Teacher'}
                </label>
                <select
                  value={formTeacherId}
                  onChange={(e) => setFormTeacherId(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2"
                >
                  {mockTeachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {language === 'fr' ? 'Salle de Classe / Laboratoire' : 'Room / Laboratory'}
                </label>
                <input
                  type="text"
                  value={formRoom}
                  onChange={(e) => setFormRoom(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2"
                  placeholder="e.g. Room 101, Lab 2, IT Room"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm"
              >
                {language === 'fr' ? 'Enregistrer' : 'Save Slot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableManager;
