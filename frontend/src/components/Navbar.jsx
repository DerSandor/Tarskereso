import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile } from "../api";
import { AuthContext } from "../authContext"; 

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext); 
  const token = localStorage.getItem("access_token"); // 🔥 localStorage-ról olvassuk

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    getProfile(token)
      .then(response => setUser(response.data))
      .catch(error => {
        console.error("Profil betöltési hiba:", error);
        if (error.response?.status === 401) {
          setUser(null);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      });
  }, [token, navigate, setUser]); // 🔥 Figyelünk a változásokra!

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    setUser(null);
    navigate("/login");
  };

  return (
    <nav style={navStyle}>
      <h1 style={titleStyle}>ConnectMate</h1>
      <div style={linkContainerStyle}>
        {user ? (
          <>
            <Link to="/profile" style={linkStyle}>Profilom</Link>
            <Link to="/profile/edit" style={linkStyle}>Profil szerkesztése</Link>
            <Link to="/search" style={linkStyle}>Keresés</Link>
            <Link to="/messages" style={linkStyle}>Üzenetek</Link>
            <Link to="/swipe" style={linkStyle}>Profilok böngészése</Link>
            <button onClick={handleLogout} style={buttonStyle}>Kijelentkezés</button>
            {user.profile_picture && (
              <img src={user.profile_picture} alt="Profil kép" style={profilePicStyle} />
            )}
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Bejelentkezés</Link>
            <Link to="/register" style={linkStyle}>Regisztráció</Link>
          </>
        )}
      </div>
    </nav>
  );
};
const navStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", backgroundColor: "#f8f9fa", borderBottom: "1px solid #ddd" };
const titleStyle = { margin: 0, fontSize: "24px", color: "#333" };
const linkContainerStyle = { display: "flex", alignItems: "center" };
const linkStyle = { marginRight: "15px", textDecoration: "none", color: "#007bff", fontSize: "18px" };
const buttonStyle = { backgroundColor: "#dc3545", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer", fontSize: "16px", marginRight: "15px" };
const profilePicStyle = { width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid #007bff" };

export default Navbar;
