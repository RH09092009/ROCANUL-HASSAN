
import React, { useState, useEffect } from 'react';
import { User, ADMIN_USER, TransactionType } from './types';
import { login, register, deposit, withdraw, transfer, applyLoan, issueCard, requestChequeBook, issueCheque, getAllUsers, adminAction, resetPassword, adminAdjustBalance } from './services/bankService';
import { Win98Window, Win98Button, Win98Input, Win98Select, Win98Table, Win98Alert } from './components/Win98Components';
import { ATM } from './components/ATM';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'LOGIN' | 'REGISTER' | 'DASHBOARD' | 'ADMIN' | 'RESET'>('LOGIN');
  const [alert, setAlert] = useState<{ msg: string, type: 'success'|'error'|'info' } | null>(null);
  const [atmOpen, setAtmOpen] = useState(false);

  // Dashboard sub-views
  const [dashView, setDashView] = useState<'HOME' | 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | 'LOAN' | 'CHEQUE' | 'CARD' | 'HISTORY'>('HOME');

  // Admin sub-views
  const [adminTab, setAdminTab] = useState<'OVERVIEW' | 'USERS' | 'CARDS' | 'LOANS' | 'CHEQUES'>('OVERVIEW');

  // Form States
  const [formData, setFormData] = useState<any>({});
  
  // Admin specific states
  const [manageFundsModal, setManageFundsModal] = useState<{acc: string, name: string} | null>(null);
  const [manageFundsAmount, setManageFundsAmount] = useState('');

  const refreshUser = () => {
      if (currentUser) {
          const updated = login(currentUser.accountNumber, currentUser.password);
          if (updated) setCurrentUser(updated);
      }
  };

  useEffect(() => {
      // Initial load or session check can go here
  }, []);

  const handleLogin = () => {
    const acc = formData.acc?.trim();
    const pass = formData.pass?.trim();

    if (!acc || !pass) {
        setAlert({ msg: 'Please enter both Account Number and Password.', type: 'error' });
        return;
    }

    const user = login(acc, pass);
    if (user) {
      setCurrentUser(user);
      setFormData({});
      if (user.isAdmin) setView('ADMIN');
      else setView('DASHBOARD');
    } else {
      setAlert({ msg: 'Invalid Login Credentials. Please check your Account ID and Password.', type: 'error' });
    }
  };

  const handleRegister = () => {
      if (!formData.name || !formData.email) {
        setAlert({ msg: 'Name and Email are required.', type: 'error' });
        return;
      }
      const user = register(formData.name, formData.email);
      setAlert({ msg: `Account Created Successfully!\n\nAccount #: ${user.accountNumber}\nPassword: ${user.password}\n\nPlease save these credentials.`, type: 'success' });
      setView('LOGIN');
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setView('LOGIN');
      setDashView('HOME');
      setAdminTab('OVERVIEW');
      setFormData({});
  };

  // --- User Actions ---

  const handleDeposit = () => {
      if (!currentUser) return;
      const amt = parseFloat(formData.amount);
      if (amt > 0) {
          deposit(currentUser.accountNumber, amt);
          refreshUser();
          setAlert({ msg: 'Cash Deposit Successful.', type: 'success' });
          setFormData({});
      } else {
          setAlert({ msg: 'Invalid Amount.', type: 'error' });
      }
  };

  const handleWithdraw = () => {
      if (!currentUser) return;
      const amt = parseFloat(formData.amount);
      if (isNaN(amt) || amt <= 0) {
          setAlert({ msg: 'Please enter a valid amount.', type: 'error' });
          return;
      }
      const res = withdraw(currentUser.accountNumber, amt);
      if (res.success) {
          refreshUser();
          setAlert({ msg: res.message, type: 'success' });
          setFormData({});
      } else {
          setAlert({ msg: res.message, type: 'error' });
      }
  };

  const handleTransfer = () => {
      if (!currentUser) return;
      const amt = parseFloat(formData.amount);
      if (isNaN(amt) || amt <= 0 || !formData.targetAcc) {
           setAlert({ msg: 'Invalid Transfer Details.', type: 'error' });
           return;
      }
      const res = transfer(currentUser.accountNumber, formData.targetAcc, amt);
      if (res.success) {
          refreshUser();
          setAlert({ msg: `Transfer of $${amt} to ${formData.targetAcc} Successful.`, type: 'success' });
          setFormData({});
      } else {
          setAlert({ msg: res.message, type: 'error' });
      }
  };

  const handleLoanApply = () => {
      if (!currentUser) return;
      if (!formData.amount || !formData.tenure) {
          setAlert({ msg: 'Please fill all loan details.', type: 'error' });
          return;
      }
      applyLoan(currentUser.accountNumber, parseFloat(formData.amount), parseInt(formData.tenure));
      refreshUser();
      setAlert({ msg: 'Loan Application Submitted to Admin for Review.', type: 'success' });
  };

  const handleIssueCheque = () => {
      if (!currentUser) return;
      if (currentUser.chequeBooksLeft <= 0) {
        setAlert({ msg: 'No Cheque Books available. Please request a new book.', type: 'error' });
        return;
      }
      if (!formData.payee || !formData.amount) {
          setAlert({ msg: 'Payee and Amount are required.', type: 'error' });
          return;
      }
      issueCheque(currentUser.accountNumber, formData.payee, parseFloat(formData.amount), formData.memo || '');
      refreshUser();
      setAlert({ msg: 'Cheque Issued Successfully.', type: 'success' });
  };
  
  // --- Admin Actions ---
  const handleAdminFundAdjust = () => {
      if (!manageFundsModal) return;
      const amount = parseFloat(manageFundsAmount);
      if (isNaN(amount) || amount === 0) {
          setAlert({msg: 'Please enter a valid non-zero amount.', type: 'error'});
          return;
      }
      adminAdjustBalance(manageFundsModal.acc, amount);
      refreshUser(); // Only useful if admin views self, but good practice
      setManageFundsModal(null);
      setManageFundsAmount('');
      setAlert({msg: 'Account Balance Updated Successfully.', type: 'success'});
  };

  // --- Renderers ---

  if (view === 'LOGIN') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#001A33] text-white">
        {alert && <Win98Alert message={alert.msg} type={alert.type} onClose={() => setAlert(null)} />}
        
        <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold font-serif tracking-wider text-white drop-shadow-md">JP MORGAN</h1>
            <p className="text-base text-gray-300 mt-1 tracking-widest font-bold">BANKING SYSTEM 2000</p>
        </div>

        <Win98Window title="Secure Login" className="w-80 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
            <div className="flex flex-col gap-4 py-6 px-4 bg-[#E6E6E6]">
                <div className="flex items-center justify-center mb-2">
                    <div className="w-16 h-16 bg-blue-900 flex items-center justify-center text-white font-serif font-bold text-3xl border-4 border-double border-white shadow-lg">JP</div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-black font-bold">Account ID / Username:</label>
                    <Win98Input placeholder="Enter Account ID" onChange={e => setFormData({...formData, acc: e.target.value})} autoFocus />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-black font-bold">Password:</label>
                    <Win98Input type="password" placeholder="******" onChange={e => setFormData({...formData, pass: e.target.value})} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                </div>
                <div className="flex justify-between mt-4">
                    <Win98Button onClick={handleLogin} className="w-24 font-bold">Login</Win98Button>
                    <Win98Button onClick={() => setView('REGISTER')} className="w-24">Sign Up</Win98Button>
                </div>
                <div className="text-center mt-4 border-t border-gray-400 pt-2">
                   <button onClick={() => setView('RESET')} className="text-blue-800 underline text-xs hover:text-red-600">Forgot Password?</button>
                </div>
            </div>
        </Win98Window>
        <div className="absolute bottom-4 text-gray-400 text-xs">© 1999-2000 JP Morgan Chase & Co. All rights reserved.</div>
      </div>
    );
  }

  if (view === 'REGISTER') {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#001A33]">
            {alert && <Win98Alert message={alert.msg} type={alert.type} onClose={() => setAlert(null)} />}
            <Win98Window title="New Account Application" className="w-96 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
                <div className="flex flex-col gap-4 py-6 px-4 bg-[#E6E6E6]">
                    <p className="text-black text-sm mb-2">Please enter your details to open a new account.</p>
                    <div className="space-y-1">
                        <label className="text-xs text-black font-bold">Full Name</label>
                        <Win98Input placeholder="John Doe" onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-black font-bold">Email Address</label>
                        <Win98Input placeholder="john@aol.com" onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="flex justify-between mt-4">
                        <Win98Button onClick={handleRegister} className="font-bold">Submit Application</Win98Button>
                        <Win98Button onClick={() => setView('LOGIN')}>Cancel</Win98Button>
                    </div>
                </div>
            </Win98Window>
        </div>
      );
  }

  if (view === 'RESET') {
    return (
        <div className="h-screen flex items-center justify-center bg-[#001A33]">
            {alert && <Win98Alert message={alert.msg} type={alert.type} onClose={() => setAlert(null)} />}
            <Win98Window title="Reset Password" className="w-80 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]">
                <div className="flex flex-col gap-4 p-4 bg-[#E6E6E6]">
                    <p className="text-black text-xs">Enter your account details to generate a new password.</p>
                    <Win98Input placeholder="Account Number" onChange={e => setFormData({...formData, acc: e.target.value})} />
                    <Win98Input placeholder="Email Address" onChange={e => setFormData({...formData, email: e.target.value})} />
                    <div className="flex justify-between mt-2">
                        <Win98Button onClick={() => {
                            const newPass = resetPassword(formData.acc, formData.email);
                            if (newPass) setAlert({ msg: `Success! Your new password is: ${newPass}`, type: 'success' });
                            else setAlert({ msg: 'Account details not found.', type: 'error' });
                        }}>Reset Password</Win98Button>
                        <Win98Button onClick={() => setView('LOGIN')}>Back</Win98Button>
                    </div>
                </div>
            </Win98Window>
        </div>
    )
  }

  if (view === 'DASHBOARD' && currentUser) {
      return (
          <div className="min-h-screen bg-[#001A33] p-4 font-sans flex flex-col items-center">
             {alert && <Win98Alert message={alert.msg} type={alert.type} onClose={() => setAlert(null)} />}
             {atmOpen && <ATM user={currentUser} onClose={() => setAtmOpen(false)} refreshUser={refreshUser} />}
             
             <div className="w-full max-w-5xl mb-2 flex justify-between items-end text-white">
                 <h2 className="font-bold text-xl tracking-wider">JP MORGAN ONLINE</h2>
                 <div className="text-xs opacity-70 font-bold">Secure Connection established</div>
             </div>

             {/* Main App Window */}
             <Win98Window title={`Dashboard - ${currentUser.name} (${currentUser.accountNumber})`} className="w-full max-w-5xl h-[80vh] flex flex-col shadow-[8px_8px_0_0_rgba(0,0,0,0.5)]">
                
                {/* Menu Bar */}
                <div className="flex border-b border-gray-400 pb-1 mb-2 bg-[#E6E6E6] gap-1 text-sm select-none flex-wrap">
                    {['HOME', 'DEPOSIT', 'WITHDRAW', 'TRANSFER', 'LOAN', 'CHEQUE', 'CARD', 'HISTORY'].map(m => (
                        <button 
                            key={m} 
                            onClick={() => { setDashView(m as any); setFormData({}); }}
                            className={`px-3 py-1 border border-transparent hover:border-gray-500 hover:shadow-inner ${dashView === m ? 'bg-blue-900 text-white font-bold shadow-inner' : 'text-black hover:bg-gray-200'}`}
                        >
                            {m}
                        </button>
                    ))}
                     <button onClick={() => setAtmOpen(true)} className="px-3 py-1 text-green-900 font-bold hover:bg-green-100 border border-transparent hover:border-green-800 ml-2">ATM</button>
                     <div className="flex-grow"></div>
                     <button onClick={handleLogout} className="px-3 py-1 text-red-900 hover:bg-red-100 font-bold">LOGOUT</button>
                </div>

                {/* Content Area */}
                <div className="flex-grow bg-[#FFFFFF] p-4 border-2 border-gray-600 inset-shadow overflow-auto relative">
                    
                    {dashView === 'HOME' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="win98-window p-4 !bg-[#E6E6E6]">
                                <h3 className="font-bold border-b border-gray-500 mb-4 text-black">Account Summary</h3>
                                <div className="text-4xl font-mono text-right mb-4 text-blue-900 bg-white p-2 border inset-shadow border-gray-400">${currentUser.balance.toFixed(2)}</div>
                                <div className="text-sm space-y-2 text-black">
                                    <div className="flex justify-between border-b border-dotted border-gray-400 pb-1"><span>Account Type:</span> <span>Premium Savings</span></div>
                                    <div className="flex justify-between border-b border-dotted border-gray-400 pb-1"><span>Account Status:</span> <span className={currentUser.isFrozen ? 'text-red-600 font-bold' : 'text-green-700 font-bold'}>{currentUser.isFrozen ? 'FROZEN' : 'ACTIVE'}</span></div>
                                    <div className="flex justify-between pb-1"><span>Interest Rate:</span> <span>1.5% APY</span></div>
                                </div>
                            </div>
                            <div className="win98-window p-4 !bg-[#E6E6E6]">
                                <h3 className="font-bold border-b border-gray-500 mb-4 text-black">Quick Actions & Stats</h3>
                                <div className="text-sm space-y-2 text-black">
                                    <div className="flex justify-between"><span>Total Loans:</span> <span>{currentUser.loans.length}</span></div>
                                    <div className="flex justify-between"><span>Issued Cheques:</span> <span>{currentUser.cheques.length}</span></div>
                                    <div className="flex justify-between"><span>Card Status:</span> <span className="font-bold">{currentUser.card ? currentUser.card.status : 'NOT ISSUED'}</span></div>
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <Win98Button onClick={() => setDashView('TRANSFER')}>Quick Transfer</Win98Button>
                                        <Win98Button onClick={() => setDashView('DEPOSIT')}>Deposit Funds</Win98Button>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <h4 className="font-bold mb-2 text-sm text-black bg-gray-200 px-2 py-1 border border-gray-400 inline-block">Recent Activity</h4>
                                <Win98Table headers={['Date', 'Type', 'Amount', 'Description', 'Status']}>
                                    {currentUser.transactions.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500 italic">No transactions found.</td></tr>}
                                    {currentUser.transactions.slice(0, 5).map(t => (
                                        <tr key={t.id} className={`hover:bg-blue-50 ${t.status === 'failed' ? 'line-through text-red-500 opacity-75' : ''}`}>
                                            <td className="px-2 py-1">{new Date(t.date).toLocaleDateString()}</td>
                                            <td className="px-2 py-1">{t.type}</td>
                                            <td className={`px-2 py-1 text-right font-bold ${t.type === TransactionType.DEPOSIT || t.type === TransactionType.LOAN_DISBURSAL ? 'text-green-700' : 'text-red-700'}`}>
                                                ${t.amount.toFixed(2)}
                                            </td>
                                            <td className="px-2 py-1">{t.description}</td>
                                            <td className="px-2 py-1 uppercase text-xs font-bold">{t.status || 'SUCCESS'}</td>
                                        </tr>
                                    ))}
                                </Win98Table>
                            </div>
                        </div>
                    )}

                    {dashView === 'DEPOSIT' && (
                        <div className="flex justify-center pt-10">
                            <div className="w-96 win98-window p-6 !bg-[#E6E6E6]">
                                <h3 className="text-lg font-bold mb-4 text-black border-b border-gray-500 pb-2">Cash Deposit</h3>
                                <p className="text-xs mb-4 text-black">Enter the amount you wish to deposit into your account.</p>
                                <label className="text-xs font-bold text-black">Amount ($)</label>
                                <Win98Input type="number" placeholder="0.00" className="mb-6 text-xl text-right" onChange={e => setFormData({...formData, amount: e.target.value})} autoFocus />
                                <Win98Button className="w-full py-2" onClick={handleDeposit}>Confirm Deposit</Win98Button>
                            </div>
                        </div>
                    )}

                    {dashView === 'WITHDRAW' && (
                        <div className="flex justify-center pt-10">
                            <div className="w-96 win98-window p-6 !bg-[#E6E6E6]">
                                <h3 className="text-lg font-bold mb-4 text-black border-b border-gray-500 pb-2">Withdrawal Slip</h3>
                                <p className="text-xs mb-4 text-black">Funds will be deducted immediately.</p>
                                <label className="text-xs font-bold text-black">Amount ($)</label>
                                <Win98Input type="number" placeholder="0.00" className="mb-6 text-xl text-right" onChange={e => setFormData({...formData, amount: e.target.value})} autoFocus />
                                <Win98Button className="w-full py-2" onClick={handleWithdraw}>Process Withdrawal</Win98Button>
                            </div>
                        </div>
                    )}

                    {dashView === 'TRANSFER' && (
                        <div className="flex justify-center pt-10">
                            <div className="w-96 win98-window p-6 !bg-[#E6E6E6]">
                                 <h3 className="text-lg font-bold mb-4 text-black border-b border-gray-500 pb-2">Wire Transfer</h3>
                                 <div className="space-y-4">
                                     <div>
                                        <label className="text-xs font-bold text-black">Beneficiary Account #</label>
                                        <Win98Input placeholder="5-Digit Number" onChange={e => setFormData({...formData, targetAcc: e.target.value})} />
                                     </div>
                                     <div>
                                        <label className="text-xs font-bold text-black">Amount ($)</label>
                                        <Win98Input type="number" placeholder="0.00" className="text-right" onChange={e => setFormData({...formData, amount: e.target.value})} />
                                     </div>
                                     <div className="bg-yellow-50 border border-yellow-200 p-2 text-[10px] text-black">
                                        Note: Transfers are irreversible once processed.
                                     </div>
                                     <Win98Button className="w-full py-2" onClick={handleTransfer}>Send Funds</Win98Button>
                                 </div>
                            </div>
                        </div>
                    )}

                    {dashView === 'LOAN' && (
                        <div className="flex gap-6 h-full">
                            <div className="w-1/3 win98-window p-4 h-fit !bg-[#E6E6E6]">
                                <h3 className="font-bold mb-2 text-black border-b border-gray-500">Apply for Loan</h3>
                                <div className="space-y-3 mt-4">
                                    <div>
                                        <label className="text-xs font-bold text-black">Amount ($)</label>
                                        <Win98Input type="number" onChange={e => setFormData({...formData, amount: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-black">Tenure</label>
                                        <Win98Select onChange={e => setFormData({...formData, tenure: e.target.value})}>
                                            <option value="">Select Tenure</option>
                                            <option value="12">12 Months (5% Fixed)</option>
                                            <option value="24">24 Months (5% Fixed)</option>
                                            <option value="36">36 Months (5% Fixed)</option>
                                        </Win98Select>
                                    </div>
                                    <Win98Button className="w-full mt-2" onClick={handleLoanApply}>Submit Application</Win98Button>
                                </div>
                            </div>
                            <div className="w-2/3 flex flex-col">
                                <h4 className="font-bold mb-2 text-black bg-gray-200 px-2 border border-gray-400 inline-block w-fit">Loan Status</h4>
                                <Win98Table headers={['Loan ID', 'Type', 'Amount', 'Status', 'EMI', 'Remaining']}>
                                    {currentUser.loans.map(l => (
                                        <tr key={l.id}>
                                            <td className="px-2 py-1 font-mono text-xs">{l.id}</td>
                                            <td className="px-2 py-1 text-xs capitalize">{l.type || 'Personal'}</td>
                                            <td className="px-2 py-1">${l.amount}</td>
                                            <td className={`px-2 py-1 font-bold ${l.status === 'APPROVED' || l.status === 'ACTIVE' ? 'text-green-700' : l.status === 'REJECTED' || l.status === 'OVERDUE' ? 'text-red-700' : 'text-yellow-700'}`}>{l.status}</td>
                                            <td className="px-2 py-1">${l.monthlyEMI}</td>
                                            <td className="px-2 py-1">${l.remainingAmount}</td>
                                        </tr>
                                    ))}
                                </Win98Table>
                            </div>
                        </div>
                    )}

                    {dashView === 'CARD' && (
                        <div className="flex flex-col items-center mt-10">
                            {!currentUser.card ? (
                                <div className="text-center">
                                    <h2 className="text-xl text-black font-bold mb-4">Debit Card Not Issued</h2>
                                    <p className="text-black mb-6">You do not have an active VISA Debit Card associated with this account.</p>
                                    <Win98Button onClick={() => { issueCard(currentUser.accountNumber); refreshUser(); }} className="scale-125">Order VISA Card</Win98Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6 items-center">
                                    {/* Retro Card Design */}
                                    <div className="bg-gray-300 rounded-xl w-96 h-56 shadow-2xl border-t-2 border-l-2 border-white border-r-2 border-b-2 border-gray-600 relative overflow-hidden p-6 transform transition-transform hover:scale-105">
                                        <div className="absolute top-0 left-0 w-full h-12 bg-blue-900 border-b-4 border-yellow-500"></div>
                                        <div className="absolute top-6 right-6 italic font-bold text-white text-3xl drop-shadow-md z-10">VISA</div>
                                        
                                        <div className="mt-16">
                                            <div className="flex gap-2 justify-start items-center">
                                                <div className="w-10 h-8 bg-yellow-200 rounded opacity-80 border border-yellow-600"></div> {/* Chip */}
                                                <div className="text-xs font-bold text-gray-500">ELECTRONIC USE ONLY</div>
                                            </div>
                                        </div>

                                        <div className="mt-2 text-2xl tracking-widest font-mono text-gray-800 font-bold drop-shadow-sm" style={{textShadow: '1px 1px 0 #fff, -1px -1px 0 #ccc'}}>
                                            {currentUser.card.number.match(/.{1,4}/g)?.join(' ')}
                                        </div>
                                        
                                        <div className="mt-2 flex gap-8 items-end">
                                            <div>
                                                <div className="text-[8px] uppercase font-bold text-gray-600">VALID THRU</div>
                                                <div className="font-mono font-bold text-gray-800">{currentUser.card.expiry}</div>
                                            </div>
                                            <div className="font-bold uppercase tracking-wide text-gray-700 text-sm mb-0.5">{currentUser.name}</div>
                                        </div>
                                        
                                        {currentUser.card.status !== 'ACTIVE' && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
                                                <div className="bg-red-600 text-white font-bold text-2xl border-4 border-white p-2 rotate-12 shadow-lg">
                                                    {currentUser.card.status}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="win98-window p-6 !bg-[#E6E6E6] w-96">
                                        <h4 className="font-bold border-b border-gray-500 mb-2 text-black">Card Controls</h4>
                                        <div className="text-sm text-black space-y-2">
                                            <div className="flex justify-between"><span>Daily Withdrawal Limit:</span> <span className="font-mono">$2000.00</span></div>
                                            <div className="flex justify-between"><span>Wrong PIN Attempts:</span> <span className={currentUser.card.wrongPinAttempts > 0 ? 'text-red-600 font-bold' : 'text-green-700'}>{currentUser.card.wrongPinAttempts}/3</span></div>
                                            <div className="mt-4 border-t border-gray-400 pt-2 text-xs text-center text-gray-600">
                                                To change PIN or report lost, please visit a branch or use the ATM.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {dashView === 'CHEQUE' && (
                         <div className="flex gap-6 h-full">
                            <div className="w-1/3 win98-window p-4 h-fit !bg-[#E6E6E6]">
                                <h3 className="font-bold mb-2 text-black border-b border-gray-500">Issue Cheque</h3>
                                <div className="space-y-3 mt-4">
                                    <div className="text-xs mb-2 font-bold bg-white border inset-shadow p-1 text-center text-black">Available Leaves: {currentUser.chequeBooksLeft}</div>
                                    <Win98Input placeholder="Payee Name" onChange={e => setFormData({...formData, payee: e.target.value})} />
                                    <Win98Input type="number" placeholder="Amount ($)" onChange={e => setFormData({...formData, amount: e.target.value})} />
                                    <Win98Input placeholder="Memo (Optional)" onChange={e => setFormData({...formData, memo: e.target.value})} />
                                    <Win98Button className="w-full mt-2" onClick={handleIssueCheque}>Issue Cheque</Win98Button>
                                    <div className="border-t border-gray-400 my-3"></div>
                                    <Win98Button className="w-full" onClick={() => { requestChequeBook(currentUser.accountNumber); refreshUser(); }}>Request New Book</Win98Button>
                                </div>
                            </div>
                            <div className="w-2/3 flex flex-col">
                                <h4 className="font-bold mb-2 text-black bg-gray-200 px-2 border border-gray-400 inline-block w-fit">Cheque Register</h4>
                                <Win98Table headers={['#', 'Date', 'Payee', 'Amount', 'Status']}>
                                    {currentUser.cheques.map(c => (
                                        <tr key={c.id}>
                                            <td className="px-2 py-1 font-mono text-blue-900 font-bold">{c.number}</td>
                                            <td className="px-2 py-1">{new Date(c.date).toLocaleDateString()}</td>
                                            <td className="px-2 py-1">{c.payee}</td>
                                            <td className="px-2 py-1">${c.amount}</td>
                                            <td className={`px-2 py-1 text-xs font-bold ${c.status === 'CLEARED' ? 'text-green-700' : c.status === 'BOUNCED' ? 'text-red-600' : 'text-gray-600'}`}>{c.status}</td>
                                        </tr>
                                    ))}
                                </Win98Table>
                            </div>
                        </div>
                    )}

                    {dashView === 'HISTORY' && (
                        <div className="h-full flex flex-col">
                             <div className="mb-3 flex gap-2 items-center p-2 bg-[#E6E6E6] border border-gray-500">
                                 <span className="text-sm font-bold text-black">FILTER VIEW:</span>
                                 {['ALL', 'DEPOSIT', 'WITHDRAW', 'TRANSFER', 'ATM', 'LOAN'].map(f => (
                                     <button key={f} className="text-xs font-bold text-blue-800 hover:text-white hover:bg-blue-800 px-2 py-0.5 border border-transparent hover:border-blue-900 transition-colors">[{f}]</button>
                                 ))}
                             </div>
                             <Win98Table headers={['Ref ID', 'Date / Time', 'Transaction Type', 'Amount', 'Description', 'Status']}>
                                {currentUser.transactions.map(t => (
                                    <tr key={t.id} className={`hover:bg-yellow-50 ${t.status === 'failed' ? 'line-through opacity-60' : ''}`}>
                                        <td className="px-2 py-1 font-mono text-xs text-gray-600">{t.id}</td>
                                        <td className="px-2 py-1">{new Date(t.date).toLocaleString()}</td>
                                        <td className="px-2 py-1 uppercase font-bold text-xs">{t.type.replace('_', ' ')}</td>
                                        <td className={`px-2 py-1 text-right font-bold font-mono ${t.amount > 0 && (t.type === TransactionType.DEPOSIT || t.type === TransactionType.LOAN_DISBURSAL) ? 'text-green-700' : 'text-red-700'}`}>
                                            ${t.amount.toFixed(2)}
                                        </td>
                                        <td className="px-2 py-1 text-xs truncate max-w-xs italic text-gray-700">{t.description}</td>
                                        <td className={`px-2 py-1 text-xs font-bold uppercase ${t.status === 'failed' ? 'text-red-600' : 'text-green-600'}`}>{t.status || 'SUCCESS'}</td>
                                    </tr>
                                ))}
                             </Win98Table>
                        </div>
                    )}
                </div>
                
                {/* Status Bar */}
                <div className="mt-1 border-t border-white shadow-[inset_1px_1px_0_#808080] bg-[#E6E6E6] px-2 py-0.5 text-xs text-black flex justify-between font-mono">
                    <span>Status: Online</span>
                    <span>Encryption: 128-bit</span>
                </div>
             </Win98Window>
          </div>
      );
  }

  if (view === 'ADMIN' && currentUser?.isAdmin) {
    const allUsers = getAllUsers().filter(u => !u.isAdmin);
    const pendingLoans = allUsers.flatMap(u => u.loans.filter(l => l.status === 'PENDING').map(l => ({...l, user: u})));
    const pendingCheques = allUsers.flatMap(u => u.cheques.filter(c => c.status === 'ISSUED').map(c => ({...c, user: u})));
    
    return (
      <div className="min-h-screen bg-[#001A33] p-4 font-sans flex flex-col text-black items-center justify-center">
         {alert && <Win98Alert message={alert.msg} type={alert.type} onClose={() => setAlert(null)} />}
         
         {/* Manage Funds Modal */}
         {manageFundsModal && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                 <Win98Window title="Manage Funds - Admin" className="w-96 shadow-2xl">
                    <div className="p-4 space-y-4 bg-[#E6E6E6]">
                        <div className="text-sm font-bold">Adjust Balance for {manageFundsModal.name}</div>
                        <div className="text-xs text-gray-600">Enter amount. Use negative for deduction (e.g. -500).</div>
                        <Win98Input type="number" autoFocus placeholder="0.00" value={manageFundsAmount} onChange={e => setManageFundsAmount(e.target.value)} />
                        <div className="flex justify-end gap-2">
                            <Win98Button onClick={() => setManageFundsModal(null)}>Cancel</Win98Button>
                            <Win98Button onClick={handleAdminFundAdjust} className="font-bold">Update</Win98Button>
                        </div>
                    </div>
                 </Win98Window>
             </div>
         )}

         <Win98Window title="Computer Management (Local) - JP Morgan Admin" className="w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl">
            {/* Menu Bar Mockup */}
            <div className="bg-[#E6E6E6] flex px-1 py-0.5 border-b border-gray-400 text-sm">
                <span className="px-2 hover:bg-blue-800 hover:text-white cursor-pointer">File</span>
                <span className="px-2 hover:bg-blue-800 hover:text-white cursor-pointer">Action</span>
                <span className="px-2 hover:bg-blue-800 hover:text-white cursor-pointer">View</span>
                <span className="px-2 hover:bg-blue-800 hover:text-white cursor-pointer">Help</span>
            </div>
            
            <div className="flex h-full">
                {/* SIDEBAR - MMC Style (Tree View) */}
                <div className="w-64 bg-white border-r-2 border-gray-600 win98-inset flex flex-col p-1 gap-0 select-none overflow-y-auto">
                     <div className="flex items-center px-1 py-1 text-sm">
                        <span className="mr-1">📂</span>
                        <span className="font-bold">Console Root</span>
                     </div>
                     
                     {/* Tree Items */}
                     <div className="ml-4 flex flex-col gap-0.5">
                         <button onClick={() => setAdminTab('OVERVIEW')} className={`text-left px-1 py-0.5 text-sm flex items-center ${adminTab === 'OVERVIEW' ? 'bg-blue-800 text-white' : 'hover:underline'}`}>
                            <span className="mr-1">🖥️</span> Overview
                         </button>
                         <button onClick={() => setAdminTab('USERS')} className={`text-left px-1 py-0.5 text-sm flex items-center ${adminTab === 'USERS' ? 'bg-blue-800 text-white' : 'hover:underline'}`}>
                            <span className="mr-1">👤</span> User Database
                         </button>
                         <button onClick={() => setAdminTab('CARDS')} className={`text-left px-1 py-0.5 text-sm flex items-center ${adminTab === 'CARDS' ? 'bg-blue-800 text-white' : 'hover:underline'}`}>
                            <span className="mr-1">💳</span> Card Management
                         </button>
                         <button onClick={() => setAdminTab('LOANS')} className={`text-left px-1 py-0.5 text-sm flex items-center justify-between w-full ${adminTab === 'LOANS' ? 'bg-blue-800 text-white' : 'hover:underline'}`}>
                            <div className="flex items-center"><span className="mr-1">💰</span> Loan Approvals</div>
                            {pendingLoans.length > 0 && <span className={`text-[10px] px-1 rounded-sm ${adminTab === 'LOANS' ? 'bg-white text-blue-800' : 'bg-red-600 text-white'}`}>{pendingLoans.length}</span>}
                         </button>
                         <button onClick={() => setAdminTab('CHEQUES')} className={`text-left px-1 py-0.5 text-sm flex items-center justify-between w-full ${adminTab === 'CHEQUES' ? 'bg-blue-800 text-white' : 'hover:underline'}`}>
                             <div className="flex items-center"><span className="mr-1">📝</span> Cheque Clearing</div>
                            {pendingCheques.length > 0 && <span className={`text-[10px] px-1 rounded-sm ${adminTab === 'CHEQUES' ? 'bg-white text-blue-800' : 'bg-red-600 text-white'}`}>{pendingCheques.length}</span>}
                         </button>
                     </div>

                     <div className="flex-grow"></div>
                     <div className="p-2">
                        <Win98Button onClick={handleLogout} className="w-full text-red-900 text-xs">Log Off</Win98Button>
                     </div>
                </div>

                {/* CONTENT */}
                <div className="flex-grow bg-[#E6E6E6] p-2 overflow-hidden flex flex-col">
                    {/* Inner Title Bar for Context */}
                    <div className="bg-gradient-to-r from-blue-800 to-blue-400 text-white px-2 py-1 text-sm font-bold shadow-sm mb-2">
                         {adminTab === 'OVERVIEW' && 'System Overview'}
                         {adminTab === 'USERS' && 'User Database Management'}
                         {adminTab === 'CARDS' && 'Card Administration'}
                         {adminTab === 'LOANS' && 'Loan Approval Center'}
                         {adminTab === 'CHEQUES' && 'Cheque Clearing House'}
                    </div>

                    <div className="flex-grow overflow-auto">
                        {adminTab === 'OVERVIEW' && (
                            <div className="space-y-6 p-2">
                                <div className="bg-white border border-gray-400 p-4 flex items-center gap-4 shadow-sm">
                                    <div className="text-4xl">🏦</div>
                                    <div>
                                        <h3 className="text-gray-600 font-bold text-xs mb-1">TOTAL RESERVE ASSETS</h3>
                                        <div className="text-3xl font-bold text-blue-900 font-mono tracking-wider">$1,000,000,000,000.00</div>
                                        <div className="text-xs text-green-700 mt-1">✅ SYSTEM OPERATIONAL</div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="win98-window !bg-white p-4 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer" onClick={() => setAdminTab('USERS')}>
                                        <div className="text-3xl mb-2">👥</div>
                                        <div className="text-2xl font-bold">{allUsers.length}</div>
                                        <div className="text-xs font-bold text-gray-500 uppercase">Active Accounts</div>
                                    </div>
                                    <div className="win98-window !bg-white p-4 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer" onClick={() => setAdminTab('LOANS')}>
                                        <div className="text-3xl mb-2">💰</div>
                                        <div className="text-2xl font-bold">{pendingLoans.length}</div>
                                        <div className="text-xs font-bold text-gray-500 uppercase">Pending Loans</div>
                                    </div>
                                    <div className="win98-window !bg-white p-4 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer" onClick={() => setAdminTab('CHEQUES')}>
                                        <div className="text-3xl mb-2">📝</div>
                                        <div className="text-2xl font-bold">{pendingCheques.length}</div>
                                        <div className="text-xs font-bold text-gray-500 uppercase">Pending Cheques</div>
                                    </div>
                                </div>

                                <div className="win98-window !bg-white p-2">
                                    <div className="font-bold text-xs border-b border-gray-300 mb-2 pb-1">SYSTEM EVENT LOG</div>
                                    {allUsers.flatMap(u => u.transactions).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map(t => (
                                        <div key={t.id} className={`text-xs font-mono border-b border-dotted border-gray-200 py-1 flex justify-between hover:bg-blue-50 px-1 ${t.status === 'failed' ? 'text-red-500' : ''}`}>
                                            <span>{t.description} {t.status === 'failed' && '(FAILED)'}</span>
                                            <span className="text-gray-500">{new Date(t.date).toLocaleTimeString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {adminTab === 'USERS' && (
                            <div className="h-full flex flex-col">
                                <div className="mb-2 text-xs text-gray-600">Right-click or use buttons to manage accounts.</div>
                                <Win98Table headers={['Account', 'Name', 'Balance', 'Status', 'Actions']}>
                                    {allUsers.map(u => (
                                        <tr key={u.accountNumber} className={u.isFrozen ? 'bg-red-50' : 'hover:bg-white'}>
                                            <td className="px-2 py-1 font-bold font-mono">{u.accountNumber}</td>
                                            <td className="px-2 py-1">{u.name}</td>
                                            <td className="px-2 py-1 text-right font-mono">${u.balance.toFixed(2)}</td>
                                            <td className={`px-2 py-1 font-bold text-xs ${u.isFrozen ? 'text-red-600' : 'text-green-600'}`}>{u.isFrozen ? 'FROZEN' : 'ACTIVE'}</td>
                                            <td className="px-2 py-1 flex gap-2">
                                                <button onClick={() => setManageFundsModal({acc: u.accountNumber, name: u.name})} className="win98-btn px-2 text-[10px] bg-gray-100">Funds</button>
                                                <button onClick={() => { adminAction(u.isFrozen ? 'UNFREEZE' : 'FREEZE', u.accountNumber); refreshUser(); }} className="win98-btn px-2 text-[10px] bg-gray-100">{u.isFrozen ? 'Unfreeze' : 'Freeze'}</button>
                                            </td>
                                        </tr>
                                    ))}
                                </Win98Table>
                            </div>
                        )}

                        {adminTab === 'CARDS' && (
                            <div className="h-full flex flex-col">
                                <Win98Table headers={['Account', 'Name', 'Card Status', 'PIN Attempts', 'Actions']}>
                                    {allUsers.map(u => (
                                        <tr key={u.accountNumber} className="hover:bg-white">
                                            <td className="px-2 py-1 font-mono">{u.accountNumber}</td>
                                            <td className="px-2 py-1">{u.name}</td>
                                            <td className="px-2 py-1">
                                                {u.card ? <span className={`font-bold text-xs px-1 border ${u.card.status === 'ACTIVE' ? 'text-green-600 border-green-200 bg-green-50' : 'text-red-600 border-red-200 bg-red-50'}`}>{u.card.status}</span> : <span className="text-gray-400 italic">None</span>}
                                            </td>
                                            <td className="px-2 py-1">{u.card ? u.card.wrongPinAttempts : '-'}</td>
                                            <td className="px-2 py-1 flex gap-2">
                                                {!u.card && <button onClick={() => { adminAction('ISSUE_CARD', u.accountNumber); refreshUser(); }} className="win98-btn px-2 text-[10px] bg-blue-50">Issue VISA</button>}
                                                {u.card && u.card.status === 'ACTIVE' && <button onClick={() => { adminAction('FREEZE_CARD', u.accountNumber); refreshUser(); }} className="win98-btn px-2 text-[10px] bg-yellow-50">Freeze</button>}
                                                {u.card && (u.card.status === 'LOCKED' || u.card.status === 'FROZEN') && <button onClick={() => { adminAction('UNLOCK_CARD', u.accountNumber); refreshUser(); }} className="win98-btn px-2 text-[10px] bg-green-50">Unlock</button>}
                                            </td>
                                        </tr>
                                    ))}
                                </Win98Table>
                            </div>
                        )}

                        {adminTab === 'LOANS' && (
                            <div className="h-full flex flex-col">
                                {pendingLoans.length === 0 ? <div className="text-gray-500 italic p-4 text-center bg-white border border-dotted">No pending loan applications found.</div> : (
                                    <Win98Table headers={['Date', 'Loan ID', 'Applicant', 'Current Bal', 'Request Amt', 'Tenure', 'Actions']}>
                                        {pendingLoans.map(l => (
                                            <tr key={l.id} className="hover:bg-white">
                                                <td className="px-2 py-1 text-xs">{new Date(l.appliedDate).toLocaleDateString()}</td>
                                                <td className="px-2 py-1 font-mono text-xs text-gray-500">{l.id}</td>
                                                <td className="px-2 py-1 font-bold">{l.user.name}</td>
                                                <td className={`px-2 py-1 font-mono text-right ${l.user.balance < 0 ? 'text-red-600' : 'text-black'}`}>${l.user.balance.toFixed(2)}</td>
                                                <td className="px-2 py-1 font-bold text-blue-900 text-right">${l.amount.toFixed(2)}</td>
                                                <td className="px-2 py-1 text-center">{l.tenureMonths} Mo</td>
                                                <td className="px-2 py-1 flex gap-1 justify-end">
                                                    <button onClick={() => { adminAction('APPROVE_LOAN', l.id); refreshUser(); }} className="win98-btn px-2 text-[10px] bg-green-100 hover:bg-green-200">Approve</button>
                                                    <button onClick={() => { adminAction('REJECT_LOAN', l.id); refreshUser(); }} className="win98-btn px-2 text-[10px] bg-red-100 hover:bg-red-200">Reject</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </Win98Table>
                                )}
                            </div>
                        )}

                        {adminTab === 'CHEQUES' && (
                            <div className="h-full flex flex-col">
                                {pendingCheques.length === 0 ? <div className="text-gray-500 italic p-4 text-center bg-white border border-dotted">No pending cheques for clearing.</div> : (
                                    <Win98Table headers={['Cheque #', 'Issuer', 'Payee', 'Amount', 'Actions']}>
                                        {pendingCheques.map(c => (
                                            <tr key={c.id} className="hover:bg-white">
                                                <td className="px-2 py-1 font-mono font-bold">{c.number}</td>
                                                <td className="px-2 py-1">{c.user.name}</td>
                                                <td className="px-2 py-1">{c.payee}</td>
                                                <td className="px-2 py-1 font-bold">${c.amount}</td>
                                                <td className="px-2 py-1 flex gap-1">
                                                    <button onClick={() => { adminAction('CLEAR_CHEQUE', c.id); refreshUser(); }} className="win98-btn px-2 text-[10px] bg-green-100">Clear</button>
                                                    <button onClick={() => { adminAction('BOUNCE_CHEQUE', c.id); refreshUser(); }} className="win98-btn px-2 text-[10px] bg-red-100">Bounce</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </Win98Table>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Status Bar */}
             <div className="mt-1 border-t border-white shadow-[inset_1px_1px_0_#808080] bg-[#E6E6E6] px-2 py-0.5 text-xs text-black flex justify-between font-mono">
                <span>Connected to: LOCALHOST</span>
                <span>User: ADMINISTRATOR</span>
            </div>
         </Win98Window>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default App;
