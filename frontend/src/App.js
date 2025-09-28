import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Componants/Layout';
import Home from './Componants/Home';
import NotFound from './Componants/NotFound';
import Auth from './Componants/Auth';
import Dashboard from './UserComponant/Dashboard';
import CreateCapsule from './UserComponant/CreateCapsule';
import ProfileSettingsPage from './UserComponant/profile/ProfileSettingsPage';
import PublicProfilePage from './UserComponant/social/PublicProfilePage';
import ForgotPasswordPage from './Componants/Auth/ForgotPasswordPage';
import ResetPasswordPage from './Componants/Auth/ResetPasswordPage';
import AllRouteExecution from './Componants/AllRouteExecution';

function App() {
  return (
    <BrowserRouter>
      <AllRouteExecution>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="auth" element={<Auth />} />
            <Route path='/auth/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='auth/reset-password' element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="create" element={<CreateCapsule />} />
            <Route path='/profile' element={<ProfileSettingsPage />} />
            <Route path="/profile/:userId" element={<PublicProfilePage />} /> 
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AllRouteExecution>
    </BrowserRouter>
  )
}

export default App;
