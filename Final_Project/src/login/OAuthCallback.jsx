import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setAuthSession } from "../Api/client";
import "./login.css";

export default function OAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorMessage = params.get("error");
    const token = params.get("token");
    const userPayload = params.get("user");

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    if (!token || !userPayload) {
      setError("GitHub login failed. Please try again.");
      return;
    }

    try {
      const user = JSON.parse(userPayload);
      setAuthSession({ token, user });
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Could not read GitHub login data. Please try again.");
    }
  }, [location.search, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">GitHub Sign In</h1>
        <p className="auth-subtitle">
          {error || "Finishing your GitHub login..."}
        </p>

        {error && (
          <Link className="primary-btn" to="/login">
            Back to Login <span>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
