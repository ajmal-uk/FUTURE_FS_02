import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { currentUser, userProfile, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Check if user is banned
    if (userProfile?.isBanned) {
        return <Navigate to="/banned" replace />;
    }

    return children;
};

export default PrivateRoute;
