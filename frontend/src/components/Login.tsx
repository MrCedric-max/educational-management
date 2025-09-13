import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, School, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const { login, isLoading, language, setLanguage } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = await login(formData.email, formData.password, language);
    if (success) {
      toast.success('Login successful!');
      // The App.tsx routing logic will handle redirecting to the appropriate dashboard
    } else {
      toast.error('Invalid email or password');
    }
  };

  const demoAccounts = [
    { role: 'Super Admin', email: 'superadmin@system.com', password: 'demo123', description: 'Manage all schools and system-wide settings' },
    { role: 'School Admin', email: 'admin@stmarys.edu', password: 'demo123', description: 'Manage users and classes for St. Mary\'s School' },
    { role: 'Teacher', email: 'john.doe@stmarys.edu', password: 'demo123', description: 'Create lessons, quizzes, and track student progress' },
    { role: 'Parent', email: 'parent@example.com', password: 'demo123', description: 'Monitor child\'s progress and take practice quizzes' }
  ];

  const fillDemoAccount = async (email: string, password: string) => {
    setFormData({ email, password });
    // Auto-login with the selected language
    const success = await login(email, password, language);
    if (success) {
      toast.success('Login successful!');
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <School className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              {language === 'en' ? 'Educational Management System' : 'Système de Gestion Éducative'}
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            {language === 'en' 
              ? 'Comprehensive platform for managing schools, students, and educational content'
              : 'Plateforme complète pour gérer les écoles, les étudiants et le contenu éducatif'
            }
          </p>
          <div className="mt-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'fr')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Sign In' : 'Se Connecter'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Email Address' : 'Adresse Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'en' ? 'Enter your email' : 'Entrez votre email'}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Password' : 'Mot de Passe'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'en' ? 'Enter your password' : 'Entrez votre mot de passe'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading 
                  ? (language === 'en' ? 'Signing In...' : 'Connexion...') 
                  : (language === 'en' ? 'Sign In' : 'Se Connecter')
                }
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Demo password for all accounts: <span className="font-mono bg-gray-100 px-2 py-1 rounded">demo123</span>
              </p>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Demo Accounts' : 'Comptes de Démonstration'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'en' 
                ? 'Click on any account below to auto-fill the login form and explore different user roles:'
                : 'Cliquez sur n\'importe quel compte ci-dessous pour remplir automatiquement le formulaire de connexion et explorer différents rôles d\'utilisateur:'
              }
            </p>
            
            <div className="space-y-4">
              {demoAccounts.map((account, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => fillDemoAccount(account.email, account.password)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          account.role === 'Super Admin' ? 'bg-red-100 text-red-600' :
                          account.role === 'School Admin' ? 'bg-orange-100 text-orange-600' :
                          account.role === 'Teacher' ? 'bg-blue-100 text-blue-600' :
                          account.role === 'Student' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          <User className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">{account.role}</h4>
                        <p className="text-xs text-gray-500">{account.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-blue-600 font-medium">Click to use</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{account.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">System Features</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Multi-school management (Super Admin)</li>
                <li>• User and class management (School Admin)</li>
                <li>• Lesson planning and quiz creation (Teacher)</li>
                <li>• Parent communication portal</li>
                <li>• Progress tracking and analytics (All roles)</li>
                <li>• Dynamic class naming (Anglophone/Francophone)</li>
                <li>• Age-appropriate quiz generation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

