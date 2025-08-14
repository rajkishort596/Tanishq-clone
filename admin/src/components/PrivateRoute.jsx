import { useQuery } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchAdminProfile } from "../api/auth.Api";
import Spinner from "./Spinner";
import { setCredentials } from "../features/authSlice";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { admin, isAuthenticated } = useSelector((state) => state.auth);

  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: fetchAdminProfile,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Set Redux when query succeeds
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setCredentials({ admin: data }));
    }
  }, [isSuccess, data, dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated || isSuccess) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
