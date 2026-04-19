import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { login } from "../service/auth.api.js";
import { setLoading, setUser, setError } from "../state/auth.slice.js";
import loginBg from "../../../assets/images/bg-login.jpg";
import SocialLogin from "../../../components/ui/SocialLogin.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const data = await login({ email, password });
      dispatch(setUser(data));
      
      const userRole = data?.user?.role || data?.role;
      if (userRole === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      dispatch(setError(err.response?.data?.message || err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div
          className="auth-form-section"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="auth-title" variants={itemVariants}>
            Welcome Back!!
          </motion.h1>

          {error && (
            <motion.div
              variants={itemVariants}
              style={{
                color: "var(--color-danger)",
                marginBottom: "1rem",
                fontSize: "0.9rem",
                fontFamily: "var(--font-body)",
              }}
            >
              {error}
            </motion.div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <motion.div className="form-group" variants={itemVariants}>
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="icon" size={20} />
                <input
                  type="email"
                  placeholder="email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.div className="form-group" variants={itemVariants}>
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="icon" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  maxLength={25}
                  pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,25}$"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div className="forgot-password" variants={itemVariants}>
              <span>Forgot Password?</span>
            </motion.div>

            <motion.button
              type="submit"
              className="auth-btn"
              variants={itemVariants}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          <SocialLogin variants={itemVariants} />

          <motion.div className="auth-redirect" variants={itemVariants}>
            Don't have an account? <Link to="/register">Sign up</Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="auth-image-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img src={loginBg} alt="Login Illustration" />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
