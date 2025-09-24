import { useQuery } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchAdminProfile } from "../api/auth.Api";
import Spinner from "./Spinner";
import { setAuthStatus, setCredentials } from "../features/authSlice";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  const {
    data: admin,
    isLoading,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: fetchAdminProfile,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(setAuthStatus("loading"));
    } else if (isSuccess && admin) {
      dispatch(setCredentials({ admin }));
      dispatch(setAuthStatus("succeeded"));
    } else if (error) {
      dispatch(setAuthStatus("failed"));
    }
  }, [isLoading, isSuccess, error, admin, dispatch]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  if (status === "failed") {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && status === "succeeded") {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
