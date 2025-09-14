import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated && status === "succeeded") {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default PrivateRoute;
