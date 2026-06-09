import React, { useState } from 'react';
import ColorPickerPopover from './ColorPickerPopover';

export default function ColorPickerInput({ label, name, value: propValue, defaultValue, onChange }) {
  const [internalValue, setInternalValue] = useState(defaultValue || propValue || '');
  const isControlled = propValue !== undefined;
  const value = isControlled ? propValue : internalValue;

  const handleChange = (e) => {
    const val = e.target.value;
    if (!isControlled) setInternalValue(val);
    if (onChange) onChange(val);
  };

  const handleColorPick = (color) => {
    if (!isControlled) setInternalValue(color);
    if (onChange) onChange(color);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      <div className="flex items-center gap-3">
        <ColorPickerPopover color={value || '#000000'} onChange={handleColorPick} />
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={handleChange}
          placeholder="#hexcode"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
      </div>
    </div>
  );
}
