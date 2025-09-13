import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AnglophoneLessonPlanner from '../pages/AnglophoneLessonPlanner';
import FrancophoneLessonPlanner from '../pages/FrancophoneLessonPlanner';

const SystemAwareLessonPlanner: React.FC = () => {
  const { school } = useAuth();

  // Route to the appropriate lesson planner based on school system
  if (school?.system === 'francophone') {
    return <FrancophoneLessonPlanner />;
  }

  // Default to anglophone system
  return <AnglophoneLessonPlanner />;
};

export default SystemAwareLessonPlanner;





