import React from 'react';
import { motion } from 'framer-motion';

const SocialLogin = ({ variants }) => {    
    // In actual implementation, these functions would redirect to OAuth endpoints
    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:3000/api/auth"}/google`;
    };
    
    const handleGithubLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:3000/api/auth"}/github`;
    };

    return (
        <>
            <motion.div className="auth-divider" variants={variants}>
                <span>- or -</span>
            </motion.div>

            <motion.div className="social-login" variants={variants}>
                <div className="social-icon-wrapper" onClick={handleGoogleLogin} title="Login with Google">
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.5181H37.4438C36.8369 31.4163 35.2038 33.9244 32.8084 35.5878V41.3418H40.4851C44.978 37.1652 47.532 31.1895 47.532 24.5528Z" fill="#4285F4"/>
                        <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.4888 41.3444L32.8122 35.5904C30.6066 37.1006 27.7951 38.0022 24.48 38.0022C18.0691 38.0022 12.6358 33.6125 10.7067 27.7554H2.76695V33.9112C6.9114 42.4283 15.2285 48.0016 24.48 48.0016Z" fill="#34A853"/>
                        <path d="M10.705 27.751C10.1996 26.2307 9.9192 24.621 9.9192 22.9995C9.9192 21.3781 10.1996 19.7683 10.705 18.2481V12.0924H2.7651C1.0378 15.5401 0 19.1691 0 22.9995C0 26.83 1.0378 30.4589 2.7651 33.9067L10.705 27.751Z" fill="#FBBC05"/>
                        <path d="M24.48 8.00155C28.0017 8.00155 31.1578 9.2435 33.6429 11.6669L40.6723 4.54472C36.3861 0.447551 30.9272 0 24.48 0C15.2285 0 6.9114 5.57333 2.76695 14.1009L10.7067 20.2567C12.6358 14.3996 18.0691 8.00155 24.48 8.00155Z" fill="#EA4335"/>
                    </svg>
                </div>
                <div className="social-icon-wrapper" onClick={handleGithubLogin} title="Login with GitHub">
                    {/* Using GitHub icon style instead of FB since user mentioned GitHub */}
                    <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                    </svg>
                </div>
            </motion.div>
        </>
    );
};

export default SocialLogin;
