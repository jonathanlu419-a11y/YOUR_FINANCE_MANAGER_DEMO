import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import QuickAddPage from './pages/QuickAddPage';
import CsvImportPage from './pages/CsvImportPage';

/**
 * Multi-page showcase router. "/" redirects to the flagship Quick Add showcase
 * (see README/commit note for why redirect rather than a separate landing page).
 * All pages share the same Layout (global header + shared footer).
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/quick-add" replace />} />
        <Route path="/quick-add" element={<QuickAddPage />} />
        <Route path="/csv-import" element={<CsvImportPage />} />
        <Route path="*" element={<Navigate to="/quick-add" replace />} />
      </Route>
    </Routes>
  );
}
