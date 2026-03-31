import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-12 shadow-2xl border border-slate-200/50 backdrop-blur-sm">
        <div className="w-32 h-32 mx-auto mb-8 p-6 bg-gradient-to-br from-orange-100 to-sky-100 rounded-3xl flex items-center justify-center shadow-xl">
          <Home className="w-20 h-20 text-slate-500" />
        </div>
        
        <h1 className="text-6xl font-black bg-gradient-to-r from-slate-900 via-orange-500 to-sky-500 bg-clip-text text-transparent mb-4 font-heading">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Page Not Found</h2>
        
        <p className="text-slate-600 mb-12 leading-relaxed max-w-sm mx-auto">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-sky-500 hover:from-sky-500 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-orange-500/50 hover:-translate-y-1 transition-all duration-300 text-lg"
        >
          <ArrowLeft size={20} />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}

