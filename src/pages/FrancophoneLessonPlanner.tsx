import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Download,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// import { useCameroonianEducation } from '../contexts/CameroonianEducationContext';
import { toast } from 'react-hot-toast';
import { lessonService, LessonPlan as ApiLessonPlan } from '../services/lessonService';

// Francophone-specific interfaces based on the templates
interface FrancophoneEtape {
  id: string;
  etape: string;
  opi: string;
  activitesEnseignant: string;
  activitesEleve: string;
  materiel: string;
  duree: string;
  modeRegroupement: string;
}

interface FrancophonePlanLecon {
  id: string;
  centreInteret: string;
  domaine: string;
  niveau: string;
  discipline: string;
  sousDiscipline: string;
  titre: string;
  duree: string;
  effectif: string;
  competenceVisee: string;
  competenceDevelopper: string;
  opo: string;
  opr: string;
  etapes: FrancophoneEtape[];
}

// Template types based on the provided documents
type TemplateType = 'mathematiques' | 'francais-lecture' | 'francais-langue';

const FrancophoneLessonPlanner: React.FC = () => {
  const { language } = useAuth();
  // Note: getSubjects and getClassDisplayName are available but not used in this component
  // const { getSubjects, getClassDisplayName } = useCameroonianEducation();
  
  // State management
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('mathematiques');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [planLecon, setPlanLecon] = useState<FrancophonePlanLecon>({
    id: '',
    centreInteret: '',
    domaine: 'Les connaissances fondamentales',
    niveau: '',
    discipline: '',
    sousDiscipline: '',
    titre: '',
    duree: '45 minutes',
    effectif: '',
    competenceVisee: '',
    competenceDevelopper: '',
    opo: '',
    opr: '',
    etapes: []
  });

  // Template configurations based on your documents
  const templateConfigs = {
    mathematiques: {
      title: 'Mathématiques',
      discipline: 'Mathématiques',
      sousDiscipline: '',
      duree: '45 minutes',
      competenceVisee: 'Utiliser les notions de base en mathématiques',
      etapes: [
        'Révision',
        'Introduction et motivation',
        'Découverte',
        'Analyse',
        'Confrontation',
        'Consolidation',
        'Synthèse',
        'Évaluation'
      ]
    },
    'francais-lecture': {
      title: 'Français - Lecture',
      discipline: 'Français',
      sousDiscipline: 'Lecture',
      duree: '30 minutes x 8',
      competenceVisee: 'Développer les compétences en lecture',
      etapes: [
        'Révision',
        'Mise en situation ou phase globale',
        'Évaluation',
        'Phase analytique',
        'Synthétique',
        'Combinatoire I',
        'Discrimination auditive',
        'Discrimination visuelle',
        'Combinatoire II',
        'Formation des phrases simples',
        'Écriture',
        'Épeler les mots'
      ]
    },
    'francais-langue': {
      title: 'Français - Langue',
      discipline: 'Français',
      sousDiscipline: 'Initiation à l\'étude de la langue',
      duree: '45 minutes',
      competenceVisee: 'Maîtriser les notions de grammaire, vocabulaire et orthographe',
      etapes: [
        'Éveil',
        'Révision',
        'Introduction et motivation',
        'Découverte',
        'Analyse',
        'Synthèse',
        'Évaluation'
      ]
    }
  };

  // Initialize plan with selected template
  const initializeTemplate = (template: TemplateType) => {
    const config = templateConfigs[template];
    setPlanLecon(prev => ({
      ...prev,
      discipline: config.discipline,
      sousDiscipline: config.sousDiscipline,
      duree: config.duree,
      competenceVisee: config.competenceVisee,
      etapes: config.etapes.map((etape, index) => ({
        id: `etape-${index}`,
        etape,
        opi: '',
        activitesEnseignant: '',
        activitesEleve: '',
        materiel: '',
        duree: '',
        modeRegroupement: ''
      }))
    }));
  };

  // Handle template change
  const handleTemplateChange = (template: TemplateType) => {
    setSelectedTemplate(template);
    initializeTemplate(template);
  };

  // Update plan field
  const updatePlanField = (field: keyof FrancophonePlanLecon, value: string) => {
    setPlanLecon(prev => ({ ...prev, [field]: value }));
  };

  // Update etape
  const updateEtape = (etapeId: string, field: keyof FrancophoneEtape, value: string) => {
    setPlanLecon(prev => ({
      ...prev,
      etapes: prev.etapes.map(etape =>
        etape.id === etapeId ? { ...etape, [field]: value } : etape
      )
    }));
  };

  // Add new etape
  const addEtape = () => {
    const newEtape: FrancophoneEtape = {
      id: `etape-${Date.now()}`,
      etape: '',
      opi: '',
      activitesEnseignant: '',
      activitesEleve: '',
      materiel: '',
      duree: '',
      modeRegroupement: ''
    };
    setPlanLecon(prev => ({
      ...prev,
      etapes: [...prev.etapes, newEtape]
    }));
  };

  // Remove etape
  const removeEtape = (etapeId: string) => {
    setPlanLecon(prev => ({
      ...prev,
      etapes: prev.etapes.filter(etape => etape.id !== etapeId)
    }));
  };

  // Save plan
  const savePlan = async () => {
    if (!planLecon.titre || !planLecon.discipline || !planLecon.niveau) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Convert Francophone plan to API format
      const apiData = {
        title: planLecon.titre,
        subject: planLecon.discipline,
        class: planLecon.niveau,
        date: new Date().toISOString().split('T')[0],
        duration: planLecon.duree || '45',
        learningTheme: planLecon.centreInteret,
        domain: planLecon.domaine,
        entryBehaviour: planLecon.opo || '',
        objectives: [planLecon.competenceVisee, planLecon.competenceDevelopper].filter(Boolean).map((obj, index) => ({
          id: `obj_${index}`,
          description: obj,
          completed: false,
          selected: false
        })),
        materials: [],
        activities: [],
        stages: planLecon.etapes.map(etape => ({
          id: etape.id,
          stage: etape.etape,
          content: etape.opi || '',
          facilitatingActivities: etape.activitesEnseignant || '',
          learningActivities: etape.activitesEleve || '',
          resources: etape.materiel || ''
        })),
        assessmentMethod: '',
        references: '',
        system: 'francophone' as const
      };
      
      if (planLecon.id) {
        // Update existing lesson plan
        await lessonService.updateLessonPlan(planLecon.id, apiData);
      } else {
        // Create new lesson plan
        const savedLesson = await lessonService.createLessonPlan(apiData);
        setPlanLecon(prev => ({ ...prev, id: savedLesson.id }));
      }
      
    } catch (error) {
      console.error('Error saving lesson plan:', error);
      toast.error('Erreur lors de la sauvegarde du plan de leçon');
    } finally {
      setIsSaving(false);
    }
  };

  // Export plan
  const exportPlan = () => {
    const dataStr = JSON.stringify(planLecon, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plan-lecon-${planLecon.titre || 'sans-titre'}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'fr' ? 'Planificateur de Leçons - Système Francophone' : 'Lesson Planner - Francophone System'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'fr' ? 'Créez des plans de leçons conformes au système éducatif francophone camerounais' : 'Create lesson plans compliant with the Cameroonian francophone education system'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={savePlan}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? (language === 'fr' ? 'Sauvegarde...' : 'Saving...') : (language === 'fr' ? 'Sauvegarder' : 'Save')}
              </button>
              <button
                onClick={exportPlan}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                {language === 'fr' ? 'Exporter' : 'Export'}
              </button>
            </div>
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'fr' ? 'Sélection du Modèle' : 'Template Selection'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(templateConfigs).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleTemplateChange(key as TemplateType)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedTemplate === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">{config.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{config.discipline}</p>
                  <p className="text-xs text-gray-500 mt-1">{config.duree}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'fr' ? 'Informations de Base' : 'Basic Information'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Centre d\'intérêt' : 'Center of Interest'} *
              </label>
              <input
                type="text"
                value={planLecon.centreInteret}
                onChange={(e) => updatePlanField('centreInteret', e.target.value)}
                placeholder={language === 'fr' ? 'Entrez le centre d\'intérêt' : 'Enter center of interest'}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Domaine' : 'Domain'} *
              </label>
              <input
                type="text"
                value={planLecon.domaine}
                onChange={(e) => updatePlanField('domaine', e.target.value)}
                placeholder={language === 'fr' ? 'Entrez le domaine' : 'Enter domain'}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Niveau' : 'Level'} *
              </label>
              <select
                value={planLecon.niveau}
                onChange={(e) => updatePlanField('niveau', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title={language === 'fr' ? 'Sélectionnez le niveau' : 'Select level'}
              >
                <option value="">{language === 'fr' ? 'Sélectionnez le niveau' : 'Select level'}</option>
                <option value="CP">CP</option>
                <option value="CE1">CE1</option>
                <option value="CE2">CE2</option>
                <option value="CM1">CM1</option>
                <option value="CM2">CM2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Discipline' : 'Discipline'} *
              </label>
              <input
                type="text"
                value={planLecon.discipline}
                onChange={(e) => updatePlanField('discipline', e.target.value)}
                placeholder={language === 'fr' ? 'Entrez la discipline' : 'Enter discipline'}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Sous-discipline' : 'Sub-discipline'}
              </label>
              <input
                type="text"
                value={planLecon.sousDiscipline}
                onChange={(e) => updatePlanField('sousDiscipline', e.target.value)}
                placeholder={language === 'fr' ? 'Entrez la sous-discipline' : 'Enter sub-discipline'}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Titre' : 'Title'} *
              </label>
              <input
                type="text"
                value={planLecon.titre}
                onChange={(e) => updatePlanField('titre', e.target.value)}
                placeholder={language === 'fr' ? 'Entrez le titre' : 'Enter title'}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Durée' : 'Duration'} *
              </label>
              <input
                type="text"
                value={planLecon.duree}
                onChange={(e) => updatePlanField('duree', e.target.value)}
                placeholder={language === 'fr' ? 'Entrez la durée' : 'Enter duration'}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Effectif' : 'Class Size'} *
              </label>
              <input
                type="number"
                value={planLecon.effectif}
                onChange={(e) => updatePlanField('effectif', e.target.value)}
                placeholder={language === 'fr' ? 'Entrez l\'effectif' : 'Enter class size'}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Competencies and Objectives */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'fr' ? 'Compétences et Objectifs' : 'Competencies and Objectives'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Compétence visée' : 'Target Competency'} *
              </label>
              <textarea
                value={planLecon.competenceVisee}
                onChange={(e) => updatePlanField('competenceVisee', e.target.value)}
                placeholder={language === 'fr' ? 'Entrez la compétence visée' : 'Enter target competency'}
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Compétence à faire développer' : 'Competency to Develop'}
              </label>
              <textarea
                value={planLecon.competenceDevelopper}
                onChange={(e) => updatePlanField('competenceDevelopper', e.target.value)}
                placeholder={language === 'fr' ? 'Entrez la compétence à développer' : 'Enter competency to develop'}
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'O.P.O. (Objectif Pédagogique Opérationnel)' : 'O.P.O. (Operational Pedagogical Objective)'} *
              </label>
              <textarea
                value={planLecon.opo}
                onChange={(e) => updatePlanField('opo', e.target.value)}
                placeholder={language === 'fr' ? 'Entrez l\'O.P.O.' : 'Enter O.P.O.'}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'O.P.R. (Objectif Pédagogique de Référence)' : 'O.P.R. (Reference Pedagogical Objective)'}
              </label>
              <textarea
                value={planLecon.opr}
                onChange={(e) => updatePlanField('opr', e.target.value)}
                placeholder={language === 'fr' ? 'Entrez l\'O.P.R.' : 'Enter O.P.R.'}
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Lesson Progression */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'fr' ? 'Progression de la Leçon' : 'Lesson Progression'}
            </h2>
            <button
              onClick={addEtape}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              {language === 'fr' ? 'Ajouter une étape' : 'Add Step'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                    {language === 'fr' ? 'Étapes' : 'Steps'}
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                    OPI
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                    {language === 'fr' ? 'Activités de l\'enseignant' : 'Teacher Activities'}
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                    {language === 'fr' ? 'Activités de l\'élève' : 'Student Activities'}
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                    {language === 'fr' ? 'Matériel' : 'Materials'}
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                    {language === 'fr' ? 'Durée' : 'Duration'}
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                    {language === 'fr' ? 'Mode de regroupement' : 'Grouping Mode'}
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                    {language === 'fr' ? 'Actions' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {planLecon.etapes.map((etape) => (
                  <tr key={etape.id}>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="text"
                        value={etape.etape}
                        onChange={(e) => updateEtape(etape.id, 'etape', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === 'fr' ? 'Nom de l\'étape' : 'Step name'}
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="text"
                        value={etape.opi}
                        onChange={(e) => updateEtape(etape.id, 'opi', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder="OPI"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <textarea
                        value={etape.activitesEnseignant}
                        onChange={(e) => updateEtape(etape.id, 'activitesEnseignant', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder={language === 'fr' ? 'Activités enseignant' : 'Teacher activities'}
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <textarea
                        value={etape.activitesEleve}
                        onChange={(e) => updateEtape(etape.id, 'activitesEleve', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder={language === 'fr' ? 'Activités élève' : 'Student activities'}
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="text"
                        value={etape.materiel}
                        onChange={(e) => updateEtape(etape.id, 'materiel', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === 'fr' ? 'Matériel' : 'Materials'}
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="text"
                        value={etape.duree}
                        onChange={(e) => updateEtape(etape.id, 'duree', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === 'fr' ? 'Durée' : 'Duration'}
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="text"
                        value={etape.modeRegroupement}
                        onChange={(e) => updateEtape(etape.id, 'modeRegroupement', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder={language === 'fr' ? 'Regroupement' : 'Grouping'}
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <button
                        onClick={() => removeEtape(etape.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title={language === 'fr' ? 'Supprimer cette étape' : 'Remove this step'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'fr' ? 'Résumé du Plan' : 'Plan Summary'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">{language === 'fr' ? 'Titre:' : 'Title:'}</span>
              <span className="ml-2 text-gray-600">{planLecon.titre || language === 'fr' ? 'Non défini' : 'Not defined'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">{language === 'fr' ? 'Discipline:' : 'Discipline:'}</span>
              <span className="ml-2 text-gray-600">{planLecon.discipline || language === 'fr' ? 'Non définie' : 'Not defined'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">{language === 'fr' ? 'Niveau:' : 'Level:'}</span>
              <span className="ml-2 text-gray-600">{planLecon.niveau || language === 'fr' ? 'Non défini' : 'Not defined'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">{language === 'fr' ? 'Durée:' : 'Duration:'}</span>
              <span className="ml-2 text-gray-600">{planLecon.duree || language === 'fr' ? 'Non définie' : 'Not defined'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">{language === 'fr' ? 'Nombre d\'étapes:' : 'Number of steps:'}</span>
              <span className="ml-2 text-gray-600">{planLecon.etapes.length}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">{language === 'fr' ? 'Effectif:' : 'Class size:'}</span>
              <span className="ml-2 text-gray-600">{planLecon.effectif || language === 'fr' ? 'Non défini' : 'Not defined'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrancophoneLessonPlanner;