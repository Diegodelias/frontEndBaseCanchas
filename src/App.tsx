import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlaysProvider } from './context/PlaysContext';
import { LandingPage } from './pages/LandingPage';
import { LiveCamerasPage } from './pages/LiveCamerasPage';
import { LivePlayerPage } from './pages/LivePlayerPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlayerPage } from './pages/PlayerPage';
import { ProfilePage } from './pages/ProfilePage';
import { SearchPage } from './pages/SearchPage';
import { ROUTES } from './routes/paths';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlaysProvider>
          <Routes>
            <Route path={ROUTES.HOME} element={<LandingPage />} />
            <Route path={ROUTES.SEARCH} element={<SearchPage />} />
            <Route path={ROUTES.LIVE} element={<LiveCamerasPage />} />
            <Route path={ROUTES.LIVE_STREAM} element={<LivePlayerPage />} />
            <Route path={ROUTES.MATCH} element={<PlayerPage mode="match" />} />
            <Route path={ROUTES.PLAY} element={<PlayerPage mode="play" />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PlaysProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
