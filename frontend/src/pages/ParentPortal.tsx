import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Download, Bell, 
  Target, CheckCircle, Clock, 
  FileText, Send, Calendar, ArrowRightLeft, Sparkles,
  Award, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserSwitcherModal from '../components/UserSwitcherModal';

interface Student {
  id: string;
  name: string;
  class: string;
  matricule: string;
  avatar?: string;
}

interface QuizResult {
  id: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  date: string;
  subject: string;
  competenceStatus: string;
}

interface Message {
  id: string;
  from: 'teacher' | 'parent';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'general' | 'urgent' | 'event';
}

interface SubjectReport {
  subject: string;
  coefficient: number;
  seq1: number;
  seq2: number;
  grade: string;
  competence: string;
  teacher: string;
  comments: string;
}

const ParentPortal: React.FC = () => {
  const { user, school, language } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'progress' | 'reports' | 'messages' | 'announcements' | 'tips'>('progress');
  const [showUserSwitcherModal, setShowUserSwitcherModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const currentStudent: Student = {
    id: 's-101',
    name: 'Samuel Mbia',
    class: 'Form 3A (Bilingue)',
    matricule: 'CMR-2024-0489'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mockQuizResults: QuizResult[] = [
    { id: '1', quizTitle: 'Équations & Factorisation', score: 17, maxScore: 20, date: '12 Oct 2026', subject: 'Mathématiques', competenceStatus: 'CTBA (Très Bien Acquis)' },
    { id: '2', quizTitle: 'Mechanics & Newton Laws', score: 15, maxScore: 20, date: '08 Oct 2026', subject: 'Physics', competenceStatus: 'CBA (Bien Acquis)' },
    { id: '3', quizTitle: 'Grammar: Direct & Indirect Speech', score: 16, maxScore: 20, date: '04 Oct 2026', subject: 'English Language', competenceStatus: 'CBA (Bien Acquis)' },
    { id: '4', quizTitle: 'Histoire: La Colonisation et la Résistance', score: 14, maxScore: 20, date: '28 Sep 2026', subject: 'Histoire-Géo', competenceStatus: 'CBA (Bien Acquis)' }
  ];

  const subjectReports: SubjectReport[] = [
    { subject: 'Mathematics', coefficient: 4, seq1: 15.5, seq2: 16.0, grade: 'A', competence: 'CTBA', teacher: 'M. Ndongo', comments: 'Excellente rigueur et raisonnement solide.' },
    { subject: 'Physics & Chemistry', coefficient: 3, seq1: 14.0, seq2: 15.0, grade: 'B+', competence: 'CBA', teacher: 'Mme. Eyenga', comments: 'Bonne participation aux séances de travaux dirigés.' },
    { subject: 'English Language', coefficient: 4, seq1: 16.0, seq2: 15.5, grade: 'A', competence: 'CTBA', teacher: 'Mr. Tabi', comments: 'Très à l\'aise en expression écrite et orale.' },
    { subject: 'Français', coefficient: 3, seq1: 13.5, seq2: 14.0, grade: 'B', competence: 'CBA', teacher: 'M. Kamga', comments: 'Travail sérieux et régulier.' },
    { subject: 'Computer Science (ICT)', coefficient: 2, seq1: 17.0, seq2: 16.5, grade: 'A+', competence: 'CTBA', teacher: 'M. Cedric', comments: 'Très motivé, excellents résultats pratiques.' },
    { subject: 'Biology / SVTEEHB', coefficient: 2, seq1: 13.0, seq2: 13.5, grade: 'B', competence: 'CA', teacher: 'Mme. Biya', comments: 'Résultats satisfaisants, consolider le vocabulaire scientifique.' }
  ];

  const [messagesList, setMessagesList] = useState<Message[]>([
    { id: '1', from: 'teacher', senderName: 'M. Ndongo (Prof. Principal Math)', content: 'Bonjour Mme Mbia. Samuel montre d\'excellentes aptitudes en mathématiques pour cette 2ème séquence.', timestamp: '12 Octobre 2026 à 14:20', read: true },
    { id: '2', from: 'parent', senderName: user?.fullName || 'Parent', content: 'Merci beaucoup Monsieur. Nous l\'encourageons à maintenir ses efforts pour les épreuves trimestrielles.', timestamp: '12 Octobre 2026 à 15:05', read: true },
    { id: '3', from: 'teacher', senderName: 'Surveillant Général (GBHS Yaoundé)', content: 'Rappel : Réunion de l\'Association des Parents d\'Élèves (APE) ce samedi à 09h30 au foyer de l\'établissement.', timestamp: '10 Octobre 2026 à 11:00', read: false }
  ]);

  const mockAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'Calendrier des Évaluations de la Séquence 2',
      content: 'Les compositions de la 2ème séquence se tiendront du lundi 20 au vendredi 24 Octobre 2026. Veuillez vous assurer que les cahiers de textes et révisions sont à jour.',
      date: '10 Octobre 2026',
      type: 'urgent'
    },
    {
      id: '2',
      title: 'Campagne de Santé Scolaire & Visites Médicales',
      content: 'L\'équipe médicale MINESEC passera dans les classes du 1er cycle le jeudi 23 Octobre pour le contrôle de la vision et de la croissance.',
      date: '06 Octobre 2026',
      type: 'event'
    },
    {
      id: '3',
      title: 'Frais de Scolarité & Modalités APE Trimestre 1',
      content: 'Les reçus de paiement Orange Money / MTN Mobile Money sont téléchargeables directement auprès de l\'intendance scolaire.',
      date: '01 Octobre 2026',
      type: 'general'
    }
  ];

  const sendMessage = () => {
    if (newMessage.trim()) {
      const msg: Message = {
        id: Date.now().toString(),
        from: 'parent',
        senderName: user?.fullName || 'Parent',
        content: newMessage.trim(),
        timestamp: 'À l\'instant',
        read: true
      };
      setMessagesList([...messagesList, msg]);
      setNewMessage('');
      toast.success(language === 'en' ? 'Message sent to school administration!' : 'Message transmis à l\'équipe pédagogique !');
    }
  };

  const downloadReportCard = () => {
    toast.success(language === 'en' ? 'Downloading official MINESEC Report Card (PDF)...' : 'Téléchargement du Bulletin Officiel MINESEC (PDF)...');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Parent Portal Executive Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-blue-800/40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white/20">
              {currentStudent.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center space-x-2 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <span className="bg-blue-800/70 px-2.5 py-0.5 rounded-full border border-blue-600/40">
                  Espace Parent d'Élève
                </span>
                <span>•</span>
                <span>Matricule : {currentStudent.matricule}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Dossier de {currentStudent.name}
              </h1>
              <p className="text-blue-100/80 text-xs md:text-sm mt-0.5">
                Classe : <span className="font-bold text-white">{currentStudent.class}</span> • Établissement : <span className="font-bold text-white">{school?.name || 'GBHS Yaoundé'}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={downloadReportCard}
              className="inline-flex items-center px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-colors"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Bulletin (PDF)
            </button>
            <button
              onClick={() => navigate('/timetable')}
              className="inline-flex items-center px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition-colors"
            >
              <Calendar className="h-4 w-4 mr-1.5" />
              Emploi du Temps
            </button>
            <button
              onClick={() => navigate('/parent-quiz')}
              className="inline-flex items-center px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
            >
              <Target className="h-4 w-4 mr-1.5" />
              Quiz d'Entraînement
            </button>
            <button
              onClick={() => setShowUserSwitcherModal(true)}
              className="inline-flex items-center px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors backdrop-blur"
            >
              <ArrowRightLeft className="h-4 w-4 mr-1.5 text-blue-300" />
              Changer d'Utilisateur
            </button>
          </div>
        </div>

        {/* Status Line */}
        <div className="mt-5 pt-4 border-t border-blue-800/60 flex flex-wrap items-center justify-between text-xs text-blue-200">
          <div className="flex items-center space-x-2 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Trimestre 1 • Année Scolaire 2026/2027 • Statut d'Assiduité : Régulier</span>
          </div>
          <div className="flex items-center space-x-2 font-mono text-[11px] text-blue-300 mt-2 md:mt-0">
            <Clock className="h-3.5 w-3.5 text-blue-400" />
            <span>{currentTime.toLocaleDateString('fr-FR')} {currentTime.toLocaleTimeString('fr-FR')}</span>
          </div>
        </div>
      </div>

      {/* 4 High-Density KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Moyenne Générale</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-gray-900 font-mono">14.92 / 20</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 pt-2 border-t border-gray-100 flex justify-between font-medium">
            <span>Rang : <strong className="text-blue-700">4e / 48 élèves</strong></span>
            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold text-[10px]">Tableau d'Honneur</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assiduité Scolaire</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-600 font-mono">96.5%</span>
            <span className="text-xs text-gray-500">présence</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 pt-2 border-t border-gray-100 flex justify-between font-medium">
            <span>0 absence injustifiée</span>
            <span className="text-amber-600 font-semibold">1 retard excusé</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Compétences APC</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-indigo-900 font-mono">CBA</span>
            <span className="text-xs text-indigo-600 font-semibold">(Compétences Bien Acquises)</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 pt-2 border-t border-gray-100 font-medium">
            <span>6/6 matières au-dessus de la moyenne</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Discipline & Conduite</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-purple-900">Très Bien</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 pt-2 border-t border-gray-100 flex justify-between font-medium">
            <span>Avertissements : <strong>0</strong></span>
            <span>Retenues : <strong>0</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('progress')}
            className={`py-3 px-5 text-xs font-bold whitespace-nowrap border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'progress'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Target className="h-4 w-4" />
            <span>Synthèse & Évaluations</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-5 text-xs font-bold whitespace-nowrap border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'reports'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Bulletin Séquentiel MINESEC</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-3 px-5 text-xs font-bold whitespace-nowrap border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'messages'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Messagerie Enseignants</span>
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`py-3 px-5 text-xs font-bold whitespace-nowrap border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'announcements'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Vie Scolaire & Annonces</span>
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: ACADEMIC PROGRESS & QUIZZES */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Tests */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center justify-between">
                    <span>Derniers Contrôles & Interrogations Écrites</span>
                    <span className="text-xs font-normal text-gray-500">Séquences 1 & 2</span>
                  </h3>
                  <div className="space-y-2.5">
                    {mockQuizResults.map((result) => (
                      <div key={result.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-gray-900">{result.quizTitle}</p>
                          <p className="text-[11px] text-gray-500">{result.subject} • {result.date}</p>
                          <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                            {result.competenceStatus}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black font-mono text-gray-900">{result.score} / {result.maxScore}</span>
                          <p className="text-[10px] text-emerald-600 font-semibold">{Math.round((result.score / result.maxScore) * 100)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic Highlights & Advice */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900">Appréciation Pédagogique Globale</h3>
                  <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
                    <div className="flex items-start space-x-3">
                      <Sparkles className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-indigo-950">Avis du Conseil Pédagogique</h4>
                        <p className="text-xs text-indigo-900 mt-1 leading-relaxed">
                          Élève assidu, consciencieux et méthodique. Progrès continus en sciences et en expression bilingue. Encourager la prise de parole en classe pour consolider le leadership.
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-indigo-200/60 flex items-center justify-between text-xs font-semibold text-indigo-900">
                      <span>Décision : Encouragements du Conseil</span>
                      <button
                        onClick={() => navigate('/gradebook')}
                        className="text-indigo-600 hover:text-indigo-800 font-bold underline text-xs"
                      >
                        Consulter le carnet complet
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-950">Prochaine Échéance : Séquence 2</h4>
                      <p className="text-xs text-amber-900 mt-0.5">
                        Arrêt des notes prévu le 28 Octobre 2026. Les bulletins de Séquence 2 seront téléchargeables dès le 2 Novembre.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OFFICIAL REPORT CARD (BULLETIN MINESEC) */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Bulletin Officiel Séquence 1 & 2 - Trimestre 1</h3>
                  <p className="text-xs text-gray-500">Conforme au modèle officiel du Ministère des Enseignements Secondaires (MINESEC)</p>
                </div>
                <button
                  onClick={downloadReportCard}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Imprimer le Bulletin (PDF)</span>
                </button>
              </div>

              {/* Table of Marks and APC Competencies */}
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Discipline</th>
                      <th className="py-3 px-3 text-center">Coef</th>
                      <th className="py-3 px-3 text-center">Séquence 1 (/20)</th>
                      <th className="py-3 px-3 text-center">Séquence 2 (/20)</th>
                      <th className="py-3 px-3 text-center">Cote APC</th>
                      <th className="py-3 px-4">Professeur & Observations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subjectReports.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/60">
                        <td className="py-3 px-4 font-bold text-gray-900">{sub.subject}</td>
                        <td className="py-3 px-3 text-center font-mono font-semibold">{sub.coefficient}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-indigo-950">{sub.seq1.toFixed(1)}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-indigo-950">{sub.seq2.toFixed(1)}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            {sub.competence}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          <span className="font-semibold text-gray-800">{sub.teacher}: </span>
                          <span>{sub.comments}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TEACHER & SCHOOL MESSAGING */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {messagesList.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl border ${
                      msg.from === 'parent'
                        ? 'bg-blue-50/70 border-blue-200 ml-4 md:ml-12'
                        : 'bg-white border-gray-200 mr-4 md:mr-12 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-extrabold text-gray-900">{msg.senderName}</span>
                      <span className="text-[11px] text-gray-400 font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{msg.content}</p>
                  </div>
                ))}
              </div>

              {/* Message Composer */}
              <div className="pt-2">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <h4 className="text-xs font-bold text-gray-900">Écrire au Professeur Principal ou à l'Administration</h4>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Posez une question sur le travail, l'assiduité ou demandez un rendez-vous..."
                    className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center space-x-1.5"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Envoyer le Message</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SCHOOL LIFE & ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-3">
              {mockAnnouncements.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/60 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-extrabold text-gray-900">{item.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.type === 'urgent' ? 'bg-red-100 text-red-800' :
                      item.type === 'event' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.type === 'urgent' ? 'Important' : item.type === 'event' ? 'Événement' : 'Général'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.content}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-mono">{item.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <UserSwitcherModal
        isOpen={showUserSwitcherModal}
        onClose={() => setShowUserSwitcherModal(false)}
      />
    </div>
  );
};

export default ParentPortal;
