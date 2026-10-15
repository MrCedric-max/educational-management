import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Clock, Award, 
  CheckSquare, ArrowRightLeft, ChevronRight, HelpCircle, 
  TrendingUp, Sparkles, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserSwitcherModal from '../components/UserSwitcherModal';

export const TeacherDashboard: React.FC = () => {
  const { user, school } = useAuth();
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showUserSwitcherModal, setShowUserSwitcherModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Assigned classes for the teacher
  const assignedClasses = [
    { id: 'c1', name: 'Form 3A', subject: 'Mathematics', coefficient: 4, studentsCount: 28, room: 'Salle 14', avgScore: 14.2 },
    { id: 'c2', name: 'Form 5 Science', subject: 'Physics & Chemistry', coefficient: 3, studentsCount: 30, room: 'Labo Sciences 2', avgScore: 13.5 },
    { id: 'c3', name: '3ème A (Francophone)', subject: 'Mathématiques', coefficient: 4, studentsCount: 26, room: 'Salle 08', avgScore: 12.9 }
  ];

  // Today's schedule periods
  const todaySchedule = [
    { time: '08:00 - 10:00', class: 'Form 3A', subject: 'Mathematics (Equations du 2nd degré)', room: 'Salle 14', status: 'current' },
    { time: '10:15 - 11:45', class: 'Form 5 Science', subject: 'Physics (Cinématique & Dynamique)', room: 'Labo 2', status: 'upcoming' },
    { time: '14:00 - 15:30', class: '3ème A', subject: 'Mathématiques (Géométrie vectorielle)', room: 'Salle 08', status: 'upcoming' }
  ];

  // Recent Quizzes and Assessments
  const recentAssessments = [
    { id: 'q1', title: 'Contrôle Continu Séquence 2 - Algèbre', class: 'Form 3A', date: '12 Octobre 2026', total: 28, marked: 28, passRate: 85 },
    { id: 'q2', title: 'Quiz Lois de Newton & Énergie', class: 'Form 5 Science', date: '08 Octobre 2026', total: 30, marked: 30, passRate: 78 },
    { id: 'q3', title: 'Évaluation Formative - Nombres Réels', class: '3ème A', date: '04 Octobre 2026', total: 26, marked: 26, passRate: 92 }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Teacher Command Center Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-emerald-800/40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="bg-emerald-700/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Espace Enseignant • Professeur Titulaire
              </span>
              <span>•</span>
              <span>{school?.name || 'GBHS Yaoundé'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Bonjour, {user?.fullName || 'John Doe'}
            </h1>
            <p className="text-emerald-100/90 text-sm mt-1 max-w-2xl">
              Tableau de bord pédagogique : appel en classe, planification des leçons, saisie des séquences et cotes APC.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/attendance')}
              className="inline-flex items-center px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-colors"
            >
              <CheckSquare className="h-4 w-4 mr-1.5" />
              Faire l'Appel
            </button>
            <button
              onClick={() => navigate('/gradebook')}
              className="inline-flex items-center px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition-colors"
            >
              <Award className="h-4 w-4 mr-1.5" />
              Notes & APC
            </button>
            <button
              onClick={() => navigate('/lesson-planner')}
              className="inline-flex items-center px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
            >
              <BookOpen className="h-4 w-4 mr-1.5" />
              Planifier Cours
            </button>
            <button
              onClick={() => setShowUserSwitcherModal(true)}
              className="inline-flex items-center px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors backdrop-blur"
            >
              <ArrowRightLeft className="h-4 w-4 mr-1.5 text-emerald-300" />
              Changer d'Utilisateur
            </button>
          </div>
        </div>

        {/* Date and Status Bar */}
        <div className="mt-5 pt-4 border-t border-emerald-700/50 flex flex-wrap items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center space-x-2 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Trimestre 1 • Séquence 2 active (Évaluations en cours)</span>
          </div>
          <div className="flex items-center space-x-2 font-mono text-[11px] text-emerald-300 mt-2 md:mt-0">
            <Clock className="h-3.5 w-3.5 text-emerald-400" />
            <span>{currentDateTime.toLocaleDateString('fr-FR')} {currentDateTime.toLocaleTimeString('fr-FR')}</span>
          </div>
        </div>
      </div>

      {/* High-Density KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mes Classes</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-gray-900">{assignedClasses.length}</span>
            <span className="text-xs text-gray-500">divisions attribuées</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 pt-2 border-t border-gray-100 flex justify-between font-medium">
            <span>Form 3A</span>
            <span>Form 5</span>
            <span>3ème A</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Élèves Suivis</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-gray-900">84</span>
            <span className="text-xs text-emerald-600 font-semibold">Élèves inscrits</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 pt-2 border-t border-gray-100 font-medium">
            <span>Présents aujourd'hui : <strong className="text-emerald-700">81 (96.4%)</strong></span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fiches Pédagogiques</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-gray-900">8</span>
            <span className="text-xs text-indigo-600 font-semibold">Plans de cours validés</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 pt-2 border-t border-gray-100 font-medium">
            <span>Alignés APC MINESEC : <strong>100%</strong></span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Moyenne Générale</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-indigo-950 font-mono">13.85 / 20</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 pt-2 border-t border-gray-100 flex items-center justify-between font-medium">
            <span>Statut APC :</span>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-blue-300">
              CBA (Bien Acquise)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Assigned Classes Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Teaching Schedule (Emploi du Temps du Jour) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Mon Emploi du Temps d'Aujourd'hui</h2>
              <p className="text-xs text-gray-500">Séances d'enseignement et travaux pratiques programmés</p>
            </div>
            <button
              onClick={() => navigate('/timetable')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              Semaine complète <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {todaySchedule.map((slot, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all ${
                  slot.status === 'current'
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400'
                    : 'bg-gray-50/70 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl text-xs font-bold font-mono ${
                    slot.status === 'current' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {slot.time}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm text-gray-900">{slot.class}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs font-semibold text-indigo-900">{slot.room}</span>
                      {slot.status === 'current' && (
                        <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full animate-pulse">
                          En cours
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{slot.subject}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => navigate('/attendance')}
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-lg text-xs font-bold shadow-sm transition-colors"
                  >
                    Faire l'Appel
                  </button>
                  <button
                    onClick={() => navigate('/gradebook')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                  >
                    Saisir Notes
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Shortcut Ribbon */}
          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-indigo-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-indigo-950">Saisie des Notes de Séquence 2 Ouverte</p>
                <p className="text-[11px] text-indigo-700">Calcul automatique des cotes APC (CTBA, CBA, CA, CMA, CNA) et moyennes pondérées</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/gradebook')}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              Ouvrir le Carnet de Notes
            </button>
          </div>
        </div>

        {/* Assigned Classes Quick Snapshot */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Mes Classes Titulaires</h2>
              <p className="text-xs text-gray-500">Matières et coefficients</p>
            </div>
            <button
              onClick={() => navigate('/gradebook')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Palmarès
            </button>
          </div>

          <div className="space-y-3">
            {assignedClasses.map((cls) => (
              <div 
                key={cls.id} 
                onClick={() => navigate('/gradebook')}
                className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-indigo-50/40 hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-900 group-hover:text-indigo-950">{cls.name}</h3>
                    <p className="text-[11px] text-gray-500">{cls.subject} • Coef {cls.coefficient}</p>
                  </div>
                  <span className="font-mono font-bold text-xs text-indigo-950 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {cls.avgScore} / 20
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-gray-100 flex justify-between text-[11px] text-gray-500">
                  <span>Effectif : <strong>{cls.studentsCount} élèves</strong></span>
                  <span>{cls.room}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/quiz')}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1"
            >
              <HelpCircle className="h-4 w-4 mr-1 text-gray-600" />
              <span>Créer un Quiz ou Devoir en Ligne</span>
            </button>
          </div>
        </div>
      </div>

      <UserSwitcherModal
        isOpen={showUserSwitcherModal}
        onClose={() => setShowUserSwitcherModal(false)}
      />
    </div>
  );
};

export default TeacherDashboard;
