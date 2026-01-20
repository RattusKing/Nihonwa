import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import { initDB } from './utils/db';
import Layout from './components/Layout';
import LevelSelector from './components/LevelSelector';
import Dashboard from './pages/Dashboard';
import VocabularyNew from './pages/VocabularyNew';
import Kanji from './pages/Kanji';
import Grammar from './pages/Grammar';
import Reading from './pages/Reading';
import ImmersionZone from './pages/ImmersionZone';
import ContentReader from './pages/ContentReader';
import ContentManager from './pages/ContentManager';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

function App() {
  const { user, showLevelSelector, setShowLevelSelector } = useStore();

  useEffect(() => {
    // If user exists, don't show level selector
    if (user) {
      setShowLevelSelector(false);
    }
  }, [user, setShowLevelSelector]);

  useEffect(() => {
    // Initialize IndexedDB, seed sample content, and load vocabulary
    const initialize = async () => {
      await initDB();
      const { seedSampleContent } = await import('./data/sampleContent');
      await seedSampleContent();
      const { loadAllVocabulary } = await import('./data/vocabulary/vocabularyLoader');
      await loadAllVocabulary();
    };
    initialize().catch(console.error);
  }, []);

  return (
    <>
      {!user || showLevelSelector ? (
        <LevelSelector />
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vocabulary" element={<VocabularyNew />} />
            <Route path="/kanji" element={<Kanji />} />
            <Route path="/grammar" element={<Grammar />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/immersion" element={<ImmersionZone />} />
            <Route path="/content/:id" element={<ContentReader />} />
            <Route path="/content-manager" element={<ContentManager />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}

export default App;
