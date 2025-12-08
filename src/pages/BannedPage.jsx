import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const BannedPage = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="auth-container">
            <div className="auth-card banned-card">
                <div className="banned-icon">🚫</div>
                <h1>Account Suspended</h1>
                <p className="banned-message">
                    Your account has been suspended and you cannot access the store at this time.
                </p>

                <div className="banned-help">
                    <h3>Need Help?</h3>
                    <p>If you believe this is a mistake or would like to appeal, please contact our support team:</p>
                    <a
                        href="mailto:ajmaluk.me@gmail.com"
                        className="contact-link"
                    >
                        📧 ajmaluk.me@gmail.com
                    </a>
                </div>

                <button onClick={handleLogout} className="btn-primary btn-logout">
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default BannedPage;
