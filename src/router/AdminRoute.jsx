import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
    const { currentUser, isAdmin, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser || !isAdmin) {
        return <Navigate to="/" replace />; // Redirect non-admins to home
    }

    return children;
};

export default AdminRoute;
