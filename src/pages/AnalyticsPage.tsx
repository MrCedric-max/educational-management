import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import toast from 'react-hot-toast';

const AnalyticsPage: React.FC = () => {
  const { logout, user, language } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'fr' ? 'Analyses et Rapports' : 'Analytics & Reports'}
              </h1>
              <p className="text-gray-600">
                {language === 'fr' 
                  ? 'Surveillez les performances des étudiants et analysez l\'efficacité des leçons'
                  : 'Monitor student performance and analyze lesson effectiveness'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default AnalyticsPage;
