import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CoursePage, MapPage } from './pages/CoursePage';
import { LessonPage } from './pages/LessonPage';
import { ExamPage } from './pages/ExamPage';
import { PracticePage } from './pages/PracticePage';
import { MockIntro, MockResults, MockRun } from './pages/MockPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { GlossaryPage, ServicesPage } from './pages/ReferencePages';
import { NotesPage, ReviewPage } from './pages/NotesReview';
import { ReadinessPage } from './pages/ReadinessPage';
import { SourcesPage } from './pages/SourcesPage';
import { SettingsPage } from './pages/SettingsPage';
import { SearchPage } from './pages/SearchPage';
import { NotFound } from './pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="exam" element={<ExamPage />} />
        <Route path="learn" element={<CoursePage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="lesson/:lessonId" element={<LessonPage />} />
        <Route path="practice" element={<PracticePage />} />
        <Route path="mock" element={<MockIntro />} />
        <Route path="mock/run" element={<MockRun />} />
        <Route path="mock/results/:resultId" element={<MockResults />} />
        <Route path="flashcards" element={<FlashcardsPage />} />
        <Route path="glossary" element={<GlossaryPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="readiness" element={<ReadinessPage />} />
        <Route path="sources" element={<SourcesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
