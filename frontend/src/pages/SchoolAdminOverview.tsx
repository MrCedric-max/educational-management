import React, { useState, useEffect } from 'react';
import { 
  Users, School, GraduationCap, TrendingUp, 
  ArrowRightLeft, Award, CheckSquare, Clock, ShieldCheck, 
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserSwitcherModal from '../components/UserSwitcherModal';

const SchoolAdminOverview: React.FC = () => {
  const { school } = useAuth();
  const navigate = useNavigate();
  
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showUserSwitcherModal, setShowUserSwitcherModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Cameroonian secondary school statistics (GBHS Yaoundé)
  const stats = {
    totalStudents: school?.totalStudents || 240,
    girlsCount: 128,
    boysCount: 112,
    totalTeachers: school?.totalTeachers || 12,
    totalClasses: school?.totalClasses || 12,
    attendanceRate: 95.8,
    unexcusedAbsenceHours: 24,
    disciplineIncidents: 3,
    activeSequence: 'Séquence 2 (Novembre - Décembre)',
    activeTerm: 'Trimestre 1'
  };

  const sequenceTimeline = [
    { name: 'Séquence 1', period: 'Octobre', status: 'completed', completion: 100 },
    { name: 'Séquence 2', period: 'Nov - Déc', status: 'current', completion: 65 },
    { name: 'Trimestre 1 (PV)', period: 'Décembre', status: 'upcoming', completion: 0 },
    { name: 'Séquence 3', period: 'Janvier', status: 'upcoming', completion: 0 },
    { name: 'Séquence 4', period: 'Fév - Mars', status: 'upcoming', completion: 0 },
    { name: 'Trimestre 2 (PV)', period: 'Mars', status: 'upcoming', completion: 0 }
  ];

  const recentIncidents = [
    { id: 1, student: 'James Wilson', class: 'Form 3A', type: 'Absence non justifiée (4h)', time: 'Aujourd\'hui 09:30', badge: 'bg-rose-100 text-rose-800' },
    { id: 2, student: 'Michael Brown', class: 'Form 5 Science', type: 'Retard répété (3x)', time: 'Hier 07:45', badge: 'bg-amber-100 text-amber-800' },
    { id: 3, student: 'Emma Johnson', class: 'Form 3A', type: 'Tableau d\'Honneur S1 (16.73)', time: 'Hier 14:00', badge: 'bg-emerald-100 text-emerald-800' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Principal Official Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-800/40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="bg-indigo-700/60 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Direction de l'Établissement • Proviseur
              </span>
              <span>•</span>
              <span>Année Scolaire 2026/2027</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              {school?.name || 'GBHS Yaoundé (Lycée Bilingue)'}
            </h1>
            <p className="text-indigo-200 text-sm mt-1 max-w-2xl">
              Tableau de bord de gouvernance administrative, suivi de l'assiduité, gestion des 6 séquences et délibérations MINESEC.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/gradebook')}
              className="inline-flex items-center px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-colors"
            >
              <Award className="h-4 w-4 mr-1.5" />
              Notes & Bulletins
            </button>
            <button
              onClick={() => navigate('/classes')}
              className="inline-flex items-center px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition-colors"
            >
              <School className="h-4 w-4 mr-1.5" />
              Classes & Séries
            </button>
            <button
              onClick={() => navigate('/school-admin-users')}
              className="inline-flex items-center px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
            >
              <Users className="h-4 w-4 mr-1.5" />
              Personnel
            </button>
            <button
              onClick={() => setShowUserSwitcherModal(true)}
              className="inline-flex items-center px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors backdrop-blur"
            >
              <ArrowRightLeft className="h-4 w-4 mr-1.5 text-indigo-300" />
              Changer d'Utilisateur
            </button>
          </div>
        </div>

        {/* Real-time status sub-strip */}
        <div className="mt-5 pt-4 border-t border-indigo-700/50 flex flex-wrap items-center justify-between text-xs text-indigo-200">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-emerald-300 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              Établissement Ouvert & Opérationnel
            </span>
            <span>•</span>
            <span>Période Active : <strong className="text-white font-mono">{stats.activeSequence}</strong></span>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[11px] text-indigo-300 mt-2 md:mt-0">
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
            <span>{currentDateTime.toLocaleDateString('fr-FR')} {currentDateTime.toLocaleTimeString('fr-FR')}</span>
          </div>
        </div>
      </div>

      {/* High-Density KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Effectif Élèves</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-gray-900">{stats.totalStudents}</span>
            <span className="text-xs text-gray-500">inscrits</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex justify-between pt-2 border-t border-gray-100 font-medium">
            <span>Filles : <strong className="text-gray-700">{stats.girlsCount}</strong></span>
            <span>Garçons : <strong className="text-gray-700">{stats.boysCount}</strong></span>
          </div>
        </div>

        {/* Teachers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Corps Enseignant</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-gray-900">{stats.totalTeachers}</span>
            <span className="text-xs text-emerald-600 font-semibold">Professeurs Actifs</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex justify-between pt-2 border-t border-gray-100 font-medium">
            <span>Présents : <strong className="text-emerald-700">12 / 12</strong></span>
            <span>Ratio : <strong className="text-gray-700">1:20</strong></span>
          </div>
        </div>

        {/* Classes */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Divisions & Classes</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <School className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-gray-900">{stats.totalClasses}</span>
            <span className="text-xs text-purple-600 font-semibold">Salles de Cours</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex justify-between pt-2 border-t border-gray-100 font-medium">
            <span>Système Anglophone : <strong>6</strong></span>
            <span>Francophone : <strong>6</strong></span>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Taux d'Assiduité</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-gray-900">{stats.attendanceRate}%</span>
            <span className="text-xs text-emerald-600 font-semibold">+0.6% ce mois</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex justify-between pt-2 border-t border-gray-100 font-medium">
            <span>Absences non justifiées : <strong className="text-rose-600">{stats.unexcusedAbsenceHours}h</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sequence Progress & Recent Life of School */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sequence Progression Timeline (MINESEC 6 Séquences) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Rythme Académique & 6 Séquences MINESEC</h2>
              <p className="text-xs text-gray-500">Progression des évaluations semestrielles et délibérations officielles</p>
            </div>
            <button
              onClick={() => navigate('/gradebook')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              Consulter Palmarès <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sequenceTimeline.map((seq, i) => (
              <div 
                key={i} 
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  seq.status === 'completed' ? 'bg-emerald-50/60 border-emerald-200' :
                  seq.status === 'current' ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-400' :
                  'bg-gray-50 border-gray-200 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className={seq.status === 'current' ? 'text-indigo-950 font-black' : 'text-gray-900'}>{seq.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    seq.status === 'completed' ? 'bg-emerald-200 text-emerald-900' :
                    seq.status === 'current' ? 'bg-indigo-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {seq.status === 'completed' ? 'Validé' : seq.status === 'current' ? 'Actif' : 'À venir'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">{seq.period}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full ${seq.status === 'completed' ? 'bg-emerald-500' : seq.status === 'current' ? 'bg-indigo-600' : 'bg-transparent'}`} 
                    style={{ width: `${seq.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick links banner */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-8 w-8 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900">Génération des Bulletins Sécurisés avec QR Code</p>
                <p className="text-[11px] text-gray-500">Conforme aux standards de sécurité numérique MINESEC 2026</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/gradebook')}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              Émettre les Bulletins
            </button>
          </div>
        </div>

        {/* Vie Scolaire & Discipline Activity Feed */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Vie Scolaire & Discipline</h2>
              <p className="text-xs text-gray-500">Derniers faits marquants</p>
            </div>
            <button
              onClick={() => navigate('/attendance')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Détails
            </button>
          </div>

          <div className="space-y-3">
            {recentIncidents.map((inc) => (
              <div key={inc.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-900">{inc.student}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{inc.class}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inc.badge}`}>
                    {inc.type}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{inc.time}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/attendance')}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1"
            >
              <CheckSquare className="h-4 w-4 mr-1 text-gray-600" />
              <span>Ouvrir le Registre d'Appel Général</span>
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

export default SchoolAdminOverview;
