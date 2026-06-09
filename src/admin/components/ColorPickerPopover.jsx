import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';

export default function ColorPickerPopover({ color, onChange, title }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const popoverRef = useRef();

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (newColor) => {
    onChange(newColor.hex);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        handleClose();
      }
    };
    if (displayColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [displayColorPicker]);

  return (
    <div className="relative inline-block" title={title}>
      <div
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-slate-300 p-0.5 shadow-sm transition-all hover:border-slate-400"
        onClick={handleClick}
      >
        <div
          className="h-full w-full rounded-sm"
          style={{ backgroundColor: color || '#000000' }}
        />
      </div>
      
      {displayColorPicker && (
        <div className="absolute left-0 top-full mt-2 z-50" ref={popoverRef}>
          <SketchPicker color={color || '#000000'} onChange={handleChange} disableAlpha />
        </div>
      )}
    </div>
  );
}
