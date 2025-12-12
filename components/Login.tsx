import React from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-earth-100 dark:bg-discord-darkest transition-colors duration-200">
      <div className="bg-white dark:bg-discord-dark p-8 md:p-12 rounded-2xl shadow-2xl max-w-md w-full text-center border border-earth-200 dark:border-discord-darker">
        <div className="mb-8">
            <div className="w-16 h-16 bg-earth-500 dark:bg-indigo-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <i className="fas fa-brain text-white text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-earth-900 dark:text-white mb-2">Welcome to DEVAURA</h1>
            <p className="text-gray-500 dark:text-gray-400">Your Adaptive CS Tutor</p>
        </div>

        <div className="space-y-4">
            <button 
                onClick={onLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 dark:border-gray-600 dark:bg-discord-light text-gray-700 dark:text-white py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-discord-darker transition-colors font-semibold"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
            </button>
            <button 
                onClick={onLogin}
                className="w-full flex items-center justify-center gap-3 bg-[#24292e] text-white py-3 px-4 rounded-xl hover:opacity-90 transition-opacity font-semibold"
            >
                <i className="fab fa-github text-xl"></i>
                Continue with GitHub
            </button>
        </div>

        <p className="mt-8 text-xs text-gray-400">
            By continuing, you agree to the Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;