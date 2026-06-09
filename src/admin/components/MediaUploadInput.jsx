import React, { useRef, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

export default function MediaUploadInput({ label, name, value: propValue, defaultValue, onChange, error }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || propValue || '');
  
  const isControlled = propValue !== undefined;
  const value = isControlled ? propValue : internalValue;

  // value is the URL of the image, e.g., '/uploads/image.jpg'
  
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success && data.url) {
        if (!isControlled) setInternalValue(data.url);
        if (onChange) onChange(data.url); // Pass the uploaded URL up
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
      // On error, clear the file input
      event.target.value = '';
    } finally {
      setUploading(false);
      // DO NOT clear event.target.value on success! We want the file to remain in the input for native form submission.
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!isControlled) setInternalValue('');
    if (onChange) onChange('');
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      
      {/* Hidden input to tell backend if the image was explicitly removed */}
      <input type="hidden" name={`remove_${name}`} value={!value ? 'true' : 'false'} />
      {/* The actual file input that will be captured by FormData */}
      <input 
        type="file" 
        name={name}
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all hover:bg-slate-50 ${
          error ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center text-sky-600">
            <UploadCloud className="mb-2 h-8 w-8 animate-bounce" />
            <span className="text-sm font-bold">Uploading...</span>
          </div>
        ) : value ? (
          <>
            <img 
              src={value.startsWith('http') ? value : `http://localhost:5000${value}`} 
              alt="Preview" 
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => { e.target.src = value; }} // Fallback if API URL changes
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity hover:opacity-100 flex items-center justify-center">
              <span className="text-sm font-bold text-white drop-shadow-md">Click to replace</span>
            </div>
            <button 
              type="button" 
              onClick={handleRemove}
              className="absolute right-2 top-2 rounded-full bg-rose-500 p-1.5 text-white shadow hover:bg-rose-600 z-10"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <ImageIcon className="mb-2 h-10 w-10 text-slate-300" />
            <span className="text-sm font-semibold">Click to upload image</span>
            <span className="text-xs">PNG, JPG, WebP up to 5MB</span>
          </div>
        )}
      </div>
      {error && <p className="text-xs font-medium text-rose-500">{error.message || error}</p>}
    </div>
  );
}
