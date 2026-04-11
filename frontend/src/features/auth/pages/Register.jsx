import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Mail, Lock, Phone, User, Store } from 'lucide-react';
import { register } from '../service/auth.api.js';
import { setLoading, setUser, setError } from '../state/auth.slice.js';
import registerBg from '../../../assets/images/bg-register.jpg';
import SocialLogin from '../components/SocialLogin';

const Register = () => {
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [fullname, setFullname] = useState('');
    const [password, setPassword] = useState('');
    const [isSeller, setIsSeller] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const data = await register({ email, contact, password, fullname, isSeller });
            dispatch(setUser(data));
            // Assuming data contains user info or token, proceed to home or login
            navigate('/login');
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
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container reverse">
                <motion.div 
                    className="auth-form-section"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 className="auth-title" variants={itemVariants}>
                        Create Account
                    </motion.h1>

                    {error && (
                        <motion.div variants={itemVariants} style={{ color: 'var(--color-danger)', marginBottom: '1rem', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
                            {error}
                        </motion.div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        
                        <motion.div className="form-group" variants={itemVariants}>
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <User className="icon" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Enter your full name" 
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    required
                                />
                            </div>
                        </motion.div>

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
                            <label>Phone no</label>
                            <div className="input-wrapper">
                                <Phone className="icon" size={20} />
                                <input 
                                    type="tel" 
                                    placeholder="Enter your phone no" 
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
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

                        <motion.div className="form-group" variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '-0.5rem'}}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: 'mc-content'}}>
                                <input 
                                    type="checkbox" 
                                    id="seller-checkbox"
                                    checked={isSeller}
                                    onChange={(e) => setIsSeller(e.target.checked)}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                                />
                            </div>
                            <label htmlFor="seller-checkbox" style={{ position: 'static', background: 'transparent', padding: 0, margin: 0, cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Register as a Seller
                                <Store size={16} />
                            </label>
                        </motion.div>

                        <motion.button 
                            type="submit" 
                            className="auth-btn"
                            variants={itemVariants}
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </motion.button>
                    </form>

                    <SocialLogin variants={itemVariants} />

                    <motion.div className="auth-redirect" variants={itemVariants}>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </motion.div>
                </motion.div>

                <motion.div 
                    className="auth-image-section"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <img src={registerBg} alt="Register Illustration" />
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
