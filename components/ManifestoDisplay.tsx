import React from 'react';

interface ManifestoDisplayProps {
  urduText: string;
  englishTranslation: string;
}

const ManifestoDisplay: React.FC<ManifestoDisplayProps> = ({ urduText, englishTranslation }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-800"></div>
        <div className="p-8 md:p-12">
            <h2 className="text-sm font-bold tracking-widest text-emerald-600 uppercase mb-6 text-center">My Manifesto &middot; میرا منشور</h2>
            
            <div className="space-y-8">
                {/* Urdu Text */}
                <div 
                    className="font-urdu text-2xl md:text-4xl text-slate-800 leading-loose text-center py-4"
                    dir="rtl"
                >
                    {urduText}
                </div>

                <div className="flex justify-center">
                    <div className="w-16 h-1 bg-slate-100 rounded-full"></div>
                </div>

                {/* English Translation */}
                <div className="text-center max-w-3xl mx-auto">
                    <p className="text-slate-500 font-light italic text-lg leading-relaxed">
                        "{englishTranslation}"
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ManifestoDisplay;