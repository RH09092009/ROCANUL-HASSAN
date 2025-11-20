import React from 'react';

export const Win98Window: React.FC<{ title: string; children: React.ReactNode; className?: string; onClose?: () => void }> = ({ title, children, className = "", onClose }) => (
  <div className={`win98-window p-1 ${className}`}>
    <div className="win98-title-bar px-2 py-1 flex justify-between items-center mb-1 select-none">
      <span className="text-sm tracking-wide truncate font-bold drop-shadow-sm text-white">{title}</span>
      <div className="flex gap-1">
         {/* Fake minimize/maximize */}
        <button className="win98-btn w-5 h-5 flex items-center justify-center text-[10px] font-bold leading-none text-black pb-1">_</button>
        <button className="win98-btn w-5 h-5 flex items-center justify-center text-[10px] font-bold leading-none text-black pb-1">□</button>
        {onClose && (
          <button onClick={onClose} className="win98-btn w-5 h-5 flex items-center justify-center text-[10px] font-bold leading-none text-black pb-1 ml-0.5">
            X
          </button>
        )}
      </div>
    </div>
    <div className="p-2 text-black">
      {children}
    </div>
  </div>
);

export const Win98Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => (
  <button 
    className={`win98-btn px-4 py-1 text-sm font-bold active:bg-gray-200 outline-none focus:outline-black focus:outline-dashed focus:outline-1 focus:-outline-offset-2 text-black ${className}`} 
    {...props} 
  />
);

export const Win98Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input 
    className={`win98-inset px-2 py-1 text-sm w-full outline-none text-black bg-white focus:bg-yellow-50 placeholder-gray-500 ${className}`} 
    {...props} 
  />
);

export const Win98Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, ...props }) => (
  <select 
    className={`win98-inset px-1 py-1 text-sm w-full outline-none text-black bg-white ${className}`} 
    {...props} 
  />
);

export const Win98Table: React.FC<{ headers: string[]; children: React.ReactNode }> = ({ headers, children }) => (
  <div className="win98-inset bg-white overflow-auto max-h-64 border-2 border-gray-600">
    <table className="w-full text-sm text-left border-collapse">
      <thead>
        <tr className="bg-gray-200 text-black">
          {headers.map((h, i) => (
            <th key={i} className="border-b border-r border-gray-400 px-2 py-1 sticky top-0 bg-gray-200 text-xs font-bold uppercase whitespace-nowrap select-none">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-dotted divide-gray-300 font-mono text-xs text-black bg-white">
        {children}
      </tbody>
    </table>
  </div>
);

export const Win98Alert: React.FC<{ message: string; type: 'error' | 'success' | 'info'; onClose: () => void }> = ({ message, type, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
    <div className="win98-window w-96 p-1 shadow-2xl">
      <div className="win98-title-bar px-2 py-0.5 flex justify-between items-center mb-4">
        <span className="text-white">{type === 'error' ? 'Error' : type === 'success' ? 'Information' : 'System Message'}</span>
        <button onClick={onClose} className="win98-btn w-5 h-5 flex items-center justify-center text-xs font-bold text-black">X</button>
      </div>
      <div className="flex items-start gap-4 px-4 py-4 min-h-[100px]">
        <div className="text-4xl select-none">
          {type === 'error' ? '❌' : type === 'success' ? 'ℹ️' : '❓'}
        </div>
        <div className="text-sm font-medium pt-1 text-black leading-relaxed">{message}</div>
      </div>
      <div className="flex justify-center mt-2 mb-2">
        <Win98Button onClick={onClose} className="w-24">OK</Win98Button>
      </div>
    </div>
  </div>
);