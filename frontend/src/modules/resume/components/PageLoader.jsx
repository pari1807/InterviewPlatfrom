import React, { useState, useEffect } from 'react';

const PageLoader = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // 600ms load transition
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-md flex flex-col items-center justify-center z-[9999] animate-in fade-in duration-300">
        <div className="relative flex flex-col items-center">
          {/* Outer rotating ring */}
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-green-600 animate-spin"></div>
          {/* Inner pulsing circle */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-green-500 rounded-full animate-ping opacity-75"></div>
          <p className="mt-6 text-sm font-bold text-slate-800 uppercase tracking-widest animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PageLoader;
