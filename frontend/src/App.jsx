import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import ResetPasswordRequest from "./components/ResetPasswordRequest";
import ResetPasswordConfirm from "./components/ResetPasswordConfirm";
import SearchUsers from "./components/SearchUsers";
import Messaging from "./components/Messaging";
import Navbar from "./components/Navbar";
import SwipeProfiles from './components/SwipeProfiles';  // 🔥 Hozzáadjuk a SwipeProfiles komponenst
import AuthProvider from "./authContext.jsx"; // ✅ Most már a jó fájlt importáljuk!
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <AuthProvider> {/* 🔥 Az egész appot körbeveszi az AuthProvider */}
      <Router>
        <Navbar />
        <div className="app-container">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/change-password" element={<ChangePassword />} />
            <Route path="/reset-password" element={<ResetPasswordRequest />} />
            <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirm />} />
            <Route path="/search" element={<SearchUsers />} />
            <Route path="/messages" element={<Messaging />} />
            <Route path="/swipe" element={<SwipeProfiles />} />  {/* 🔥 Hozzáadjuk az útvonalat */}
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
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
