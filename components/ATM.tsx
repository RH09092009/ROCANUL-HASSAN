import React, { useState } from 'react';
import { User } from '../types';
import { atmWithdrawal } from '../services/bankService';

interface ATMProps {
  user: User;
  onClose: () => void;
  refreshUser: () => void;
}

export const ATM: React.FC<ATMProps> = ({ user, onClose, refreshUser }) => {
  const [screen, setScreen] = useState<'LOGIN' | 'MENU' | 'WITHDRAW' | 'BALANCE' | 'RESULT'>('LOGIN');
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);

  // ATM Keypad simulation
  const handleKey = (key: string) => {
    if (key === 'CLEAR') {
      setInput('');
      return;
    }
    if (key === 'ENTER') {
      processEnter();
      return;
    }
    if (key === 'CANCEL') {
      onClose();
      return;
    }
    if (input.length < 8) setInput(prev => prev + key);
  };

  const processEnter = () => {
    if (screen === 'LOGIN') {
        // Validate PIN roughly (in real app, this would call backend)
        if (user.card?.status === 'LOCKED' || user.card?.status === 'FROZEN') {
            setMessage("CARD LOCKED/FROZEN");
            setScreen('RESULT');
            return;
        }
        if (input === user.card?.pin) {
            setScreen('MENU');
            setInput('');
        } else {
             // Simulate wrong pin logic locally for UI (real logic is in service)
             atmWithdrawal(user.card?.number || '', input, 0); 
             refreshUser(); // To update lock status
             setMessage("INVALID PIN");
             setScreen('RESULT');
             setInput('');
        }
    } else if (screen === 'WITHDRAW') {
        const amount = parseInt(input);
        if (isNaN(amount) || amount <= 0) return;
        
        const res = atmWithdrawal(user.card?.number || '', user.card?.pin || '', amount);
        if (res.success) {
            setMessage("TRANSACTION COMPLETE");
            setReceipt(`
            JP MORGAN ATM
            DATE: ${new Date().toLocaleDateString()}
            TIME: ${new Date().toLocaleTimeString()}
            ----------------------
            WITHDRAWAL: $${amount}
            AVAIL BAL : $${res.user?.balance.toFixed(2)}
            
            THANK YOU
            `);
        } else {
            setMessage(res.message.toUpperCase());
        }
        refreshUser();
        setScreen('RESULT');
        setInput('');
    }
  };

  const renderScreenContent = () => {
    if (!user.card) return <div className="text-center text-red-500 mt-10 font-mono animate-pulse font-bold text-xl">NO CARD ISSUED</div>;

    if (screen === 'RESULT') {
        return (
            <div className="flex flex-col items-center justify-center h-full font-mono text-[#33FF00]">
                <p className="text-lg mb-4 text-center font-bold tracking-wider">{message}</p>
                {receipt && <pre className="text-[10px] leading-tight bg-gray-100 text-black p-2 mb-2 border border-gray-500 font-mono shadow-lg whitespace-pre-wrap">{receipt}</pre>}
                <div className="mt-4 animate-pulse">PRESS CANCEL TO EXIT</div>
                <button onClick={() => { setScreen('MENU'); setReceipt(null); }} className="text-[#33FF00] underline mt-2 hover:text-white">MAIN MENU</button>
            </div>
        );
    }

    if (screen === 'LOGIN') {
      return (
        <div className="flex flex-col items-center justify-center h-full font-mono">
          <h2 className="mb-4 font-bold text-2xl text-[#33FF00] tracking-widest">JP MORGAN ATM</h2>
          <p className="mb-2 text-[#33FF00] text-lg">INSERT CARD & ENTER PIN</p>
          <div className="bg-[#002200] border-2 border-[#006600] text-[#33FF00] w-48 h-12 flex items-center justify-center mt-2 text-2xl tracking-[0.5em]">
            {'*'.repeat(input.length)}
          </div>
        </div>
      );
    }

    if (screen === 'MENU') {
      return (
        <div className="grid grid-cols-2 gap-6 h-full content-center p-8 font-mono">
           <button onClick={() => setScreen('WITHDRAW')} className="bg-[#004400] hover:bg-[#006600] text-[#33FF00] p-4 border-2 border-[#33FF00] text-left font-bold text-lg">1. WITHDRAW CASH</button>
           <button onClick={() => setScreen('BALANCE')} className="bg-[#004400] hover:bg-[#006600] text-[#33FF00] p-4 border-2 border-[#33FF00] text-left font-bold text-lg">2. BALANCE ENQUIRY</button>
           <button onClick={() => onClose()} className="bg-[#004400] hover:bg-[#006600] text-[#33FF00] p-4 border-2 border-[#33FF00] text-left col-span-2 text-center font-bold text-lg">3. RETURN CARD</button>
        </div>
      );
    }

    if (screen === 'WITHDRAW') {
         return (
            <div className="flex flex-col items-center justify-center h-full font-mono">
              <p className="text-[#33FF00] mb-2 text-xl">ENTER WITHDRAWAL AMOUNT:</p>
              <div className="flex items-center">
                <span className="text-3xl text-[#33FF00] mr-2">$</span>
                <div className="bg-[#002200] border-b-2 border-[#33FF00] text-[#33FF00] min-w-[150px] text-right text-3xl p-1 font-bold">
                    {input}
                </div>
              </div>
              <p className="text-[#00AA00] text-sm mt-6">PRESS ENTER TO CONFIRM</p>
            </div>
          );
    }
    
    if (screen === 'BALANCE') {
        return (
            <div className="flex flex-col items-center justify-center h-full font-mono">
              <p className="text-[#33FF00] text-xl">AVAILABLE BALANCE</p>
              <h1 className="text-5xl mt-6 text-[#33FF00] font-bold tracking-wider">${user.balance.toFixed(2)}</h1>
              <button onClick={() => setScreen('MENU')} className="mt-12 text-[#33FF00] border-2 border-[#33FF00] px-6 py-2 hover:bg-[#33FF00] hover:text-black font-bold">BACK</button>
            </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-gray-300 p-6 rounded-xl shadow-2xl border-t-4 border-l-4 border-gray-100 border-b-8 border-r-8 border-gray-600 flex flex-col md:flex-row gap-8 max-w-5xl w-full max-h-[90vh]">
        
        {/* Screen Section */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg relative border-4 border-gray-600 shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
          <div className="bg-[#001100] w-full h-80 md:h-96 font-mono relative overflow-hidden border-4 border-gray-900 shadow-inner rounded-sm">
             {/* CRT Effects */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,255,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%]" />
             <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,50,0,0)_60%,rgba(0,0,0,0.5)_100%)] z-20 pointer-events-none"></div>
             
             <div className="relative z-30 h-full p-6">
                {renderScreenContent()}
             </div>
          </div>
          <div className="flex justify-between mt-2 px-2">
             <div className="text-gray-500 font-bold text-xs tracking-widest">DIEBOLD 1000</div>
             <div className="flex gap-2">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
             </div>
          </div>
        </div>

        {/* Keypad Section */}
        <div className="w-full md:w-72 bg-gray-400 p-6 rounded border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600 shadow-lg">
          <div className="bg-gray-300 p-2 rounded mb-6 border border-gray-500 inset-shadow">
             <div className="h-2 bg-black rounded-full w-full mb-1 opacity-20"></div>
             <div className="h-2 bg-black rounded-full w-full opacity-20"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
              <button key={n} onClick={() => handleKey(n.toString())} className="h-14 bg-gray-200 border-b-4 border-r-4 border-gray-500 border-t border-l border-white active:border-0 active:translate-y-1 active:bg-gray-300 font-bold text-2xl text-gray-800 rounded shadow-sm">
                {n}
              </button>
            ))}
            <button onClick={() => handleKey('.')} className="h-14 bg-gray-200 border-b-4 border-r-4 border-gray-500 border-t border-l border-white active:border-0 active:translate-y-1 font-bold text-2xl text-gray-800 rounded">.</button>
            <button onClick={() => handleKey('0')} className="h-14 bg-gray-200 border-b-4 border-r-4 border-gray-500 border-t border-l border-white active:border-0 active:translate-y-1 font-bold text-2xl text-gray-800 rounded">0</button>
            <button className="h-14 bg-gray-200 border-b-4 border-r-4 border-gray-500 border-t border-l border-white active:border-0 active:translate-y-1 font-bold text-2xl text-gray-800 rounded"></button>
          </div>
          <div className="grid grid-rows-3 gap-3">
             <button onClick={() => handleKey('CANCEL')} className="h-12 bg-red-600 text-white font-bold text-lg border-b-4 border-r-4 border-red-900 border-t border-l border-red-400 active:border-0 rounded shadow-md">CANCEL</button>
             <button onClick={() => handleKey('CLEAR')} className="h-12 bg-yellow-500 text-black font-bold text-lg border-b-4 border-r-4 border-yellow-700 border-t border-l border-yellow-300 active:border-0 rounded shadow-md">CLEAR</button>
             <button onClick={() => handleKey('ENTER')} className="h-12 bg-green-600 text-white font-bold text-lg border-b-4 border-r-4 border-green-900 border-t border-l border-green-400 active:border-0 rounded shadow-md">ENTER</button>
          </div>
        </div>
      </div>
    </div>
  );
};