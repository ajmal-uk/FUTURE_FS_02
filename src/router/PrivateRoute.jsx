import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Simple loading state
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
