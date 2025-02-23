import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import ResetPasswordRequest from "./components/ResetPasswordRequest";
import ResetPasswordConfirm from "./components/ResetPasswordConfirm";
import Messaging from "./components/Messaging";
import Navbar from "./components/Navbar";
import SwipeProfiles from './components/SwipeProfiles';
import AuthProvider from "./authContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewProfile from './components/ViewProfile';
import LandingPage from "./components/LandingPage";
import { useAuth } from './authContext.jsx';

// Külön komponens a tartalom kezelésére
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-fatal-dark via-fatal-dark to-black">
      {isAuthenticated && !isAuthPage && <Navbar />}
      <div className={isAuthenticated && !isAuthPage ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/reset-password" element={<ResetPasswordRequest />} />
          <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirm />} />
          <Route path="/messages" element={<Messaging />} />
          <Route path="/swipe" element={<SwipeProfiles />} />
          <Route path="/messages/:matchId" element={<Messaging />} />
          <Route path="/profile/:userId" element={<ViewProfile />} />
        </Routes>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
