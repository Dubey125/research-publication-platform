import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AimsScopePage from './pages/AimsScopePage';
import EditorialBoardPage from './pages/EditorialBoardPage';
import AuthorGuidelinesPage from './pages/AuthorGuidelinesPage';
import PublicationEthicsPage from './pages/PublicationEthicsPage';
import PeerReviewPolicyPage from './pages/PeerReviewPolicyPage';
import PoliciesPage from './pages/PoliciesPage';
import LicensingPage from './pages/LicensingPage';
import CopyrightFormPage from './pages/CopyrightFormPage';
import CurrentIssuePage from './pages/CurrentIssuePage';
import ArchivesPage from './pages/ArchivesPage';
import ContactPage from './pages/ContactPage';
import SubmitManuscriptPage from './pages/SubmitManuscriptPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/aims-scope" element={<AimsScopePage />} />
      <Route path="/editorial-board" element={<EditorialBoardPage />} />
      <Route path="/author-guidelines" element={<AuthorGuidelinesPage />} />
      <Route path="/publication-ethics" element={<PublicationEthicsPage />} />
      <Route path="/peer-review-policy" element={<PeerReviewPolicyPage />} />
      <Route path="/policies" element={<PoliciesPage />} />
      <Route path="/licensing" element={<LicensingPage />} />
      <Route path="/copyright-form" element={<CopyrightFormPage />} />
      <Route path="/current-issue" element={<CurrentIssuePage />} />
      <Route path="/archives" element={<ArchivesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/submit-manuscript" element={<SubmitManuscriptPage />} />
      <Route path="/submit-paper" element={<SubmitManuscriptPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route path="/404" element={<NotFoundPage />} />
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes>
);

export default App;
