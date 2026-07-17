import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import QuickAddPage from './pages/QuickAddPage';
import CsvImportPage from './pages/CsvImportPage';

/**
 * Multi-page showcase router. "/" is the real front door (HomePage) — it stakes
 * out the app's core differentiator before any feature demo, so it renders
 * directly rather than redirecting. Unknown paths fall back to it.
 * All pages share the same Layout (global header + shared footer).
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/quick-add" element={<QuickAddPage />} />
        <Route path="/csv-import" element={<CsvImportPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
