import React from 'react';

export default function FormInput({
  label,
  id,
  type = 'text',
  placeholder,
  register,
  error,
  as = 'input',
  rows = 4,
}) {
  const baseClasses = `w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 ${
    error ? 'border-red-500' : 'border-slate-200'
  }`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          {...register}
          className={baseClasses}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...register}
          className={baseClasses}
        />
      )}
      {error && <p className="text-xs font-medium text-red-500">{error.message}</p>}
    </div>
  );
}
