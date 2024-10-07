import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import isAuthUser from "./isAuthuser";
import Loader from "./Loader";

const PublicRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      const authStatus = await isAuthUser();
      console.log("authStatus", authStatus.isAuthenticated);
      setIsAuthenticated(authStatus.isAuthenticated);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    authenticate();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PublicRoute;
