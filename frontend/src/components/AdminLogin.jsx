import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShoppingBag } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "../styles/AdminLogin.css";
import { useNavigate } from "react-router-dom";
import { useAdminLoginMutation } from "../app/api/adminAPI";

const AdminLogin = () => {
  const notifyerror = (msg) => {
    toast.dismiss();
    toast.error(msg);
  };
  const notifysuccess = (msg) => {
    toast.dismiss();
    toast.success(msg);
  };
    const [adminLogin] = useAdminLoginMutation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const credentials = {
            email,
            password,
        };
        console.log("Admin Login Credentials: ", credentials);
        adminLogin(credentials)
            .unwrap()
            .then((res) => {
                setIsLoading(false);
                localStorage.setItem("adminToken", res?.admin?.token);
                window.location.href = "/admin/dashboard";
            })
            .catch((err) => {
                setIsLoading(false);
                console.error("Login Error: ", err);
            });
    };

  return (
    <div className="admin-login-container">
        <ToastContainer position="bottom-left" limit={1}/>
      <div className="admin-login-card">
        <div className="admin-login-left">
          <div className="login-brand">
            <ShoppingBag className="brand-icon" />
            <h1>TPOP</h1>
          </div>
          <div className="login-welcome">
            <h2>Welcome back</h2>
            <p>Login to manage your store, orders, and products</p>
          </div>
        </div>

        <div className="admin-login-right">
          <div className="login-header">
            <h2>Admin Login</h2>
            <p>Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <Mail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="password-icon" />
                  ) : (
                    <Eye className="password-icon" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className={`login-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>© {new Date().getFullYear()} TPOP Admin. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
