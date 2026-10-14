import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, Shield, School, BookOpen, Users, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSwitcherModal: React.FC<UserSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { user, availableUsers, switchUser, language } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelectUser = (targetUserId: string, role: UserRole, fullName: string) => {
    switchUser(targetUserId);
    onClose();

    toast.success(
      language === 'fr'
        ? `Profil activé: ${fullName} (${role.replace('_', ' ')})`
        : `Switched to: ${fullName} (${role.replace('_', ' ')})`
    );

    // Route to appropriate dedicated portal
    if (role === 'super_admin') navigate('/');
    else if (role === 'school_admin') navigate('/school-admin-overview');
    else if (role === 'teacher') navigate('/teacher-dashboard');
    else if (role === 'parent') navigate('/parent-portal');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return {
          icon: Shield,
          color: 'bg-red-500/10 text-red-500 border-red-500/30',
          bg: 'bg-red-500',
          desc: 'Network oversight, feature flags, global curriculum'
        };
      case 'school_admin':
        return {
          icon: School,
          color: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
          bg: 'bg-blue-500',
          desc: 'School operations, staff, classes, MINESEC reports'
        };
      case 'teacher':
        return {
          icon: BookOpen,
          color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
          bg: 'bg-emerald-500',
          desc: 'Lesson planning, roll call, 6-sequence APC gradebook'
        };
      case 'parent':
        return {
          icon: Users,
          color: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
          bg: 'bg-amber-500',
          desc: 'Child academic progress, report cards, class timetable'
        };
      default:
        return {
          icon: Users,
          color: 'bg-gray-500/10 text-gray-500 border-gray-500/30',
          bg: 'bg-gray-500',
          desc: 'Standard account'
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              {language === 'fr' ? 'Changer d\'Utilisateur' : 'Switch User Account'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {language === 'fr' 
                ? 'Sélectionnez un profil pour tester les accès stricts' 
                : 'Select an account to preview its strictly isolated scope'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Account Cards */}
        <div className="p-4 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {availableUsers.map((u) => {
            const isCurrent = user?.id === u.id;
            const badge = getRoleBadge(u.role);
            const RoleIcon = badge.icon;

            return (
              <div
                key={u.id}
                onClick={() => handleSelectUser(u.id, u.role, u.fullName)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                    : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${badge.bg} flex-shrink-0 shadow`}>
                    <RoleIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-bold text-white truncate">{u.fullName}</p>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${badge.color}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{u.email}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{badge.desc}</p>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-2">
                  {isCurrent ? (
                    <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg">
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Actif
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                      title="Switch to this account"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Fermer / Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSwitcherModal;
