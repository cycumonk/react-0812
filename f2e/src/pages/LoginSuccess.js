import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // 用來獲取路由狀態

function LoginSuccessPage() {
    const location = useLocation();
    const { username } = location.state || { username: "Unknown User" };
    const navigate = useNavigate();

    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="col-md-6 col-lg-4">
                <div className="card shadow-lg border-0 rounded-4">
                    <div className="card-header bg-success text-white text-center rounded-top">
                        <h3 className="mb-0">Login Success</h3>
                    </div>
                    <div className="card-body text-center">
                        <h4 className="mb-4 text-primary">Welcome back, <strong>{username}</strong>!</h4>
                        <p className="lead mb-4 text-muted">You have successfully logged in.</p>
                        <button
                            className="btn btn-primary w-100 rounded-3"
                            onClick={() => navigate('/')} // 使用 React Router navigate 返回首頁
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginSuccessPage;
