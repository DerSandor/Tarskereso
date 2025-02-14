import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./authContext"; // ✅ A context külön fájlban van

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = sessionStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 PropTypes validáció
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
