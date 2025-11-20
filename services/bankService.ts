
import { User, Transaction, TransactionType, Loan, LoanStatus, Cheque, ChequeStatus, Card, ADMIN_USER, ADMIN_PASS } from '../types';

const STORAGE_KEY = 'jpmorgan_db_v2'; // Incremented version to force new seed data

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialAdmin: User = {
  accountNumber: ADMIN_USER,
  password: ADMIN_PASS,
  name: 'System Administrator',
  email: 'admin@jpmorgan.com',
  balance: 1000000000000, // 1 Trillion
  isAdmin: true,
  transactions: [],
  loans: [],
  cheques: [],
  chequeBooksLeft: 999,
  isFrozen: false
};

// --- SEED DATA FROM CSV ---
const seedUsers: User[] = [
  initialAdmin,
  {
    "accountNumber": "19139",
    "password": "574280",
    "name": "Susan Wilson",
    "email": "susan.wilson@jpmorgan.com",
    "balance": 4790476.86,
    "isAdmin": false,
    "isFrozen": false,
    "chequeBooksLeft": 5,
    "transactions": [
      { "id": "1", "date": "2008-05-09", "type": TransactionType.DEPOSIT, "amount": 6309.42, "description": "Deposit", "status": "failed" },
      { "id": "2", "date": "2014-05-11", "type": TransactionType.TRANSFER, "amount": 6162.16, "description": "Transfer", "status": "success" },
      { "id": "3", "date": "2014-07-24", "type": TransactionType.WITHDRAWAL, "amount": 12867.4, "description": "Bank Fee", "status": "success" },
      { "id": "4", "date": "2016-01-19", "type": TransactionType.WITHDRAWAL, "amount": 8031.91, "description": "Withdrawal", "status": "success" },
      { "id": "5", "date": "2004-12-08", "type": TransactionType.WITHDRAWAL, "amount": 17259.64, "description": "Withdrawal", "status": "success" },
      { "id": "9", "date": "2007-10-25", "type": TransactionType.DEPOSIT, "amount": 9824.36, "description": "Interest Credit", "status": "success" }
    ],
    "loans": [],
    "cheques": []
  },
  {
    "accountNumber": "51488",
    "password": "691520",
    "name": "James Rodriguez",
    "email": "j.rodriguez@jpmorgan.com",
    "balance": 2456933.73,
    "isAdmin": false,
    "isFrozen": false,
    "chequeBooksLeft": 5,
    "transactions": [
      { "id": "29", "date": "2015-07-30", "type": TransactionType.DEPOSIT, "amount": 1984.06, "description": "Interest Credit", "status": "success" },
      { "id": "30", "date": "2007-12-21", "type": TransactionType.DEPOSIT, "amount": 14093.64, "description": "Interest Credit", "status": "success" },
      { "id": "31", "date": "2000-03-25", "type": TransactionType.WITHDRAWAL, "amount": 13111.79, "description": "Bank Fee", "status": "success" },
      { "id": "32", "date": "2009-08-14", "type": TransactionType.TRANSFER, "amount": 10995.63, "description": "Transfer", "status": "success" }
    ],
    "loans": [
        { "id": "1", "accountNumber": "51488", "type": "business", "amount": 1402134.58, "interestRate": 5.0, "tenureMonths": 60, "monthlyEMI": 26460.01, "status": LoanStatus.ACTIVE, "remainingAmount": 1200000, "appliedDate": "2005-11-16" } as any
    ],
    "cheques": []
  },
  {
    "accountNumber": "56084",
    "password": "653791",
    "name": "Elizabeth Jackson",
    "email": "liz.jackson@jpmorgan.com",
    "balance": 4498322.84,
    "isAdmin": false,
    "isFrozen": false,
    "chequeBooksLeft": 5,
    "transactions": [
        { "id": "39", "date": "2010-01-25", "type": TransactionType.DEPOSIT, "amount": 16708.14, "description": "Deposit", "status": "success" },
        { "id": "40", "date": "2023-11-17", "type": TransactionType.DEPOSIT, "amount": 5803.9, "description": "Deposit", "status": "success" },
        { "id": "41", "date": "2004-11-21", "type": TransactionType.WITHDRAWAL, "amount": 7447.53, "description": "Withdrawal", "status": "success" }
    ],
    "loans": [],
    "cheques": []
  },
  {
    "accountNumber": "80711",
    "password": "755236",
    "name": "Karen Jackson",
    "email": "karen.j@jpmorgan.com",
    "balance": 3945213.93,
    "isAdmin": false,
    "isFrozen": false,
    "chequeBooksLeft": 5,
    "transactions": [
        { "id": "67", "date": "2002-08-08", "type": TransactionType.WITHDRAWAL, "amount": 7270.12, "description": "Withdrawal", "status": "success" },
        { "id": "74", "date": "2006-09-06", "type": TransactionType.DEPOSIT, "amount": 12072.93, "description": "Interest Credit", "status": "failed" }
    ],
    "loans": [],
    "cheques": []
  },
  {
    "accountNumber": "32116",
    "password": "259069",
    "name": "David Martin",
    "email": "david.m@jpmorgan.com",
    "balance": 3369033.37,
    "isAdmin": false,
    "isFrozen": false,
    "chequeBooksLeft": 5,
    "transactions": [
        { "id": "110", "date": "2010-01-27", "type": TransactionType.DEPOSIT, "amount": 16050.9, "description": "Interest Credit", "status": "failed" },
        { "id": "111", "date": "2007-10-07", "type": TransactionType.WITHDRAWAL, "amount": 8062.37, "description": "Withdrawal", "status": "success" }
    ],
    "loans": [
        { "id": "2", "type": "personal", "amount": 517810.18, "interestRate": 3.5, "tenureMonths": 36, "monthlyEMI": 15172.92, "status": LoanStatus.CLOSED, "remainingAmount": 0, "appliedDate": "2003-02-17" } as any,
        { "id": "3", "type": "car", "amount": 2059568.39, "interestRate": 5.0, "tenureMonths": 60, "monthlyEMI": 38866.6, "status": LoanStatus.CLOSED, "remainingAmount": 0, "appliedDate": "2006-07-06" } as any,
        { "id": "4", "type": "car", "amount": 2247850.43, "interestRate": 7.5, "tenureMonths": 36, "monthlyEMI": 69922.13, "status": LoanStatus.CLOSED, "remainingAmount": 0, "appliedDate": "2005-11-22" } as any
    ],
    "cheques": []
  },
  {
    "accountNumber": "58949",
    "password": "817517",
    "name": "Sarah Johnson",
    "email": "s.johnson@jpmorgan.com",
    "balance": 4287318.86,
    "isAdmin": false,
    "isFrozen": false,
    "chequeBooksLeft": 5,
    "transactions": [
        { "id": "149", "date": "2014-07-24", "type": TransactionType.TRANSFER, "amount": 14217.16, "description": "Transfer", "status": "success" },
        { "id": "155", "date": "2007-12-11", "type": TransactionType.WITHDRAWAL, "amount": 7255.33, "description": "Withdrawal", "status": "failed" }
    ],
    "loans": [],
    "cheques": []
  },
  {
    "accountNumber": "22760",
    "password": "517207",
    "name": "James Thomas",
    "email": "j.thomas@jpmorgan.com",
    "balance": 3598453.12,
    "isAdmin": false,
    "isFrozen": false,
    "chequeBooksLeft": 5,
    "transactions": [
         { "id": "182", "date": "2004-06-12", "type": TransactionType.WITHDRAWAL, "amount": 11545.54, "description": "Bank Fee", "status": "success" }
    ],
    "loans": [
        { "id": "5", "type": "business", "amount": 554090.76, "interestRate": 3.5, "tenureMonths": 12, "monthlyEMI": 47054.29, "status": LoanStatus.ACTIVE, "remainingAmount": 200000, "appliedDate": "2006-10-12" } as any,
        { "id": "6", "type": "personal", "amount": 221902.01, "interestRate": 6.0, "tenureMonths": 24, "monthlyEMI": 9834.83, "status": LoanStatus.ACTIVE, "remainingAmount": 50000, "appliedDate": "2007-01-11" } as any
    ],
    "cheques": []
  },
  {
    "accountNumber": "94144",
    "password": "784318",
    "name": "David Davis",
    "email": "d.davis@jpmorgan.com",
    "balance": 3286041.92,
    "isAdmin": false,
    "isFrozen": false,
    "chequeBooksLeft": 5,
    "transactions": [
        { "id": "230", "date": "2005-06-25", "type": TransactionType.WITHDRAWAL, "amount": 10415.15, "description": "Withdrawal", "status": "failed" }
    ],
    "loans": [
        { "id": "8", "type": "car", "amount": 1341928.24, "interestRate": 3.5, "tenureMonths": 36, "monthlyEMI": 39321.29, "status": LoanStatus.ACTIVE, "remainingAmount": 800000, "appliedDate": "2001-02-24" } as any
    ],
    "cheques": []
  },
  {
    "accountNumber": "44274",
    "password": "857263",
    "name": "Jessica Miller",
    "email": "j.miller@jpmorgan.com",
    "balance": 707470.3,
    "isAdmin": false,
    "isFrozen": true, // Frozen as per CSV
    "chequeBooksLeft": 5,
    "transactions": [
        { "id": "271", "date": "2013-10-16", "type": TransactionType.TRANSFER, "amount": 2823.78, "description": "Transfer", "status": "success" }
    ],
    "loans": [
        { "id": "10", "type": "car", "amount": 240339.32, "interestRate": 8.5, "tenureMonths": 180, "monthlyEMI": 2366.72, "status": LoanStatus.CLOSED, "remainingAmount": 0, "appliedDate": "2007-02-16" } as any,
        { "id": "11", "type": "home", "amount": 446784.62, "interestRate": 7.5, "tenureMonths": 60, "monthlyEMI": 8952.65, "status": LoanStatus.ACTIVE, "remainingAmount": 200000, "appliedDate": "2010-09-16" } as any
    ],
    "cheques": []
  },
  {
    "accountNumber": "57127",
    "password": "769708",
    "name": "Mary Thomas",
    "email": "m.thomas@jpmorgan.com",
    "balance": 2606433.55,
    "isAdmin": false,
    "isFrozen": false, // Flagged suspicious in CSV but not frozen there
    "chequeBooksLeft": 5,
    "transactions": [
         { "id": "320", "date": "2002-01-03", "type": TransactionType.DEPOSIT, "amount": 7848.55, "description": "Interest Credit", "status": "success" }
    ],
    "loans": [],
    "cheques": []
  },
  {
    "accountNumber": "28004",
    "password": "689184",
    "name": "William Thomas",
    "email": "w.thomas@jpmorgan.com",
    "balance": 1229131.22,
    "isAdmin": false,
    "isFrozen": false,
    "chequeBooksLeft": 5,
    "transactions": [],
    "loans": [
         { "id": "9", "type": "car", "amount": 35035.06, "interestRate": 6.0, "tenureMonths": 180, "monthlyEMI": 295.65, "status": LoanStatus.ACTIVE, "remainingAmount": 5000, "appliedDate": "2007-01-04" } as any
    ],
    "cheques": []
  },
  {
    "accountNumber": "89299",
    "password": "543316",
    "name": "Barbara Martin",
    "email": "b.martin@jpmorgan.com",
    "balance": 2412611.78,
    "isAdmin": false,
    "isFrozen": false,
    "chequeBooksLeft": 5,
    "transactions": [
        { "id": "848", "date": "2020-01-31", "type": TransactionType.DEPOSIT, "amount": 10579.25, "description": "Deposit", "status": "failed" }
    ],
    "loans": [],
    "cheques": []
  },
  {
    "accountNumber": "30688",
    "password": "787663",
    "name": "Joseph Jackson",
    "email": "j.jackson@jpmorgan.com",
    "balance": 2503982.12,
    "isAdmin": false,
    "isFrozen": false,
    "chequeBooksLeft": 5,
    "transactions": [
         { "id": "1896", "date": "2015-03-30", "type": TransactionType.DEPOSIT, "amount": 8338.62, "description": "Interest Credit", "status": "failed" }
    ],
    "loans": [
        { "id": "78", "type": "personal", "amount": 190636.28, "interestRate": 7.5, "tenureMonths": 12, "monthlyEMI": 16539.11, "status": LoanStatus.ACTIVE, "remainingAmount": 50000, "appliedDate": "2004-09-17" } as any,
        { "id": "79", "type": "home", "amount": 1160338.37, "interestRate": 4.5, "tenureMonths": 24, "monthlyEMI": 50646.23, "status": LoanStatus.ACTIVE, "remainingAmount": 800000, "appliedDate": "2004-12-01" } as any
    ],
    "cheques": []
  },
  {
    "accountNumber": "72225",
    "password": "531821",
    "name": "Mary Hernandez",
    "email": "m.hernandez@jpmorgan.com",
    "balance": 471803.17,
    "isAdmin": false,
    "isFrozen": false,
    "chequeBooksLeft": 5,
    "transactions": [
        { "id": "915", "date": "2006-07-09", "type": TransactionType.WITHDRAWAL, "amount": 2849.12, "description": "Bank Fee", "status": "failed" }
    ],
    "loans": [
        { "id": "37", "type": "business", "amount": 112565.96, "interestRate": 7.5, "tenureMonths": 36, "monthlyEMI": 3501.5, "status": LoanStatus.ACTIVE, "remainingAmount": 50000, "appliedDate": "2006-01-23" } as any,
        { "id": "38", "type": "car", "amount": 169967.55, "interestRate": 10.0, "tenureMonths": 24, "monthlyEMI": 7843.14, "status": LoanStatus.OVERDUE, "remainingAmount": 20000, "appliedDate": "2002-12-27" } as any
    ],
    "cheques": []
  }
];

// Helper to get DB
const getDB = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
  return JSON.parse(data);
};

const saveDB = (db: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

// --- Auth ---

export const login = (accountNumber: string, pinOrPass: string): User | null => {
  const db = getDB();
  const user = db.find(u => u.accountNumber === accountNumber && u.password === pinOrPass);
  return user || null;
};

export const register = (name: string, email: string): User => {
  const db = getDB();
  let accNum = '';
  // Generate unique 5 digit account number
  do {
    accNum = Math.floor(10000 + Math.random() * 90000).toString();
  } while (db.some(u => u.accountNumber === accNum));

  const password = Math.floor(100000 + Math.random() * 900000).toString();

  const newUser: User = {
    accountNumber: accNum,
    password: password,
    name,
    email,
    balance: 0,
    isAdmin: false,
    transactions: [],
    loans: [],
    cheques: [],
    chequeBooksLeft: 0,
    isFrozen: false
  };

  db.push(newUser);
  saveDB(db);
  return newUser;
};

export const resetPassword = (accountNumber: string, email: string): string | null => {
  const db = getDB();
  const user = db.find(u => u.accountNumber === accountNumber && u.email === email);
  if (user) {
    const newPass = Math.floor(100000 + Math.random() * 900000).toString();
    user.password = newPass;
    saveDB(db);
    return newPass;
  }
  return null;
};

// --- Banking Operations ---

export const deposit = (accountNumber: string, amount: number): User | null => {
  const db = getDB();
  const user = db.find(u => u.accountNumber === accountNumber);
  if (!user) return null;

  user.balance += amount;
  user.transactions.unshift({
    id: generateId(),
    date: new Date().toISOString(),
    type: TransactionType.DEPOSIT,
    amount,
    description: 'Cash Deposit',
    status: 'success'
  });

  saveDB(db);
  return user;
};

export const withdraw = (accountNumber: string, amount: number): { success: boolean; message: string; user?: User } => {
  const db = getDB();
  const user = db.find(u => u.accountNumber === accountNumber);
  if (!user) return { success: false, message: 'User not found' };
  if (user.isFrozen) return { success: false, message: 'Account Frozen' };
  if (user.balance < amount) return { success: false, message: 'Insufficient Funds' };

  user.balance -= amount;
  user.transactions.unshift({
    id: generateId(),
    date: new Date().toISOString(),
    type: TransactionType.WITHDRAWAL,
    amount,
    description: 'Cash Withdrawal',
    status: 'success'
  });

  saveDB(db);
  return { success: true, message: 'Withdrawal Successful', user };
};

export const transfer = (fromAcc: string, toAcc: string, amount: number): { success: boolean; message: string; user?: User } => {
  const db = getDB();
  const sender = db.find(u => u.accountNumber === fromAcc);
  const receiver = db.find(u => u.accountNumber === toAcc);

  if (!sender) return { success: false, message: 'Sender not found' };
  if (!receiver) return { success: false, message: 'Target account invalid' };
  if (sender.isFrozen) return { success: false, message: 'Account Frozen' };
  if (sender.balance < amount) return { success: false, message: 'Insufficient Funds' };

  sender.balance -= amount;
  receiver.balance += amount;

  const txId = generateId();
  const date = new Date().toISOString();

  sender.transactions.unshift({
    id: txId,
    date,
    type: TransactionType.TRANSFER,
    amount,
    description: `Transfer to ${toAcc}`,
    targetAccount: toAcc,
    status: 'success'
  });

  receiver.transactions.unshift({
    id: txId,
    date,
    type: TransactionType.TRANSFER,
    amount,
    description: `Transfer from ${fromAcc}`,
    targetAccount: fromAcc,
    status: 'success'
  });

  saveDB(db);
  return { success: true, message: 'Transfer Successful', user: sender };
};

// --- Loans ---

export const applyLoan = (accountNumber: string, amount: number, tenureMonths: number): User | null => {
  const db = getDB();
  const user = db.find(u => u.accountNumber === accountNumber);
  if (!user) return null;

  const interestRate = 5.0; // 5% fixed
  const interest = (amount * (interestRate / 100));
  const totalAmount = amount + interest;
  const monthlyEMI = Math.ceil(totalAmount / tenureMonths);

  const loan: Loan = {
    id: generateId(),
    amount,
    interestRate,
    tenureMonths,
    monthlyEMI,
    status: LoanStatus.PENDING,
    remainingAmount: totalAmount,
    appliedDate: new Date().toISOString()
  };

  user.loans.push(loan);
  saveDB(db);
  return user;
};

// --- ATM ---

export const issueCard = (accountNumber: string): User | null => {
  const db = getDB();
  const user = db.find(u => u.accountNumber === accountNumber);
  if (!user) return null;

  if (user.card) return user; // Already has card

  const cardNumber = '4' + Math.random().toString().substr(2, 15);
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 4);
  const expiry = `${String(expiryDate.getMonth() + 1).padStart(2, '0')}/${String(expiryDate.getFullYear()).substr(2, 2)}`;
  
  user.card = {
    number: cardNumber,
    expiry,
    cvv: Math.floor(100 + Math.random() * 899).toString(),
    pin: '1234', // Default
    status: 'ACTIVE',
    wrongPinAttempts: 0,
    dailyLimit: 2000,
    dailyWithdrawn: 0
  };

  saveDB(db);
  return user;
};

export const atmWithdrawal = (cardNumber: string, pin: string, amount: number): { success: boolean; message: string; user?: User } => {
  const db = getDB();
  const user = db.find(u => u.card?.number === cardNumber);
  
  if (!user || !user.card) return { success: false, message: 'Card Invalid' };
  
  if (user.card.status !== 'ACTIVE') return { success: false, message: `Card is ${user.card.status}` };

  if (user.card.pin !== pin) {
    user.card.wrongPinAttempts += 1;
    if (user.card.wrongPinAttempts >= 3) {
      user.card.status = 'LOCKED';
    }
    saveDB(db);
    return { success: false, message: 'Invalid PIN' };
  }

  // Reset attempts on success
  user.card.wrongPinAttempts = 0;

  if (user.card.dailyWithdrawn + amount > user.card.dailyLimit) return { success: false, message: 'Daily Limit Exceeded' };
  if (user.balance < amount) return { success: false, message: 'Insufficient Funds' };

  user.balance -= amount;
  user.card.dailyWithdrawn += amount;
  
  user.transactions.unshift({
    id: generateId(),
    date: new Date().toISOString(),
    type: TransactionType.ATM_WITHDRAWAL,
    amount,
    description: 'ATM Cash Withdrawal',
    status: 'success'
  });

  saveDB(db);
  return { success: true, message: 'Please take your cash', user };
};

// --- Cheques ---

export const requestChequeBook = (accountNumber: string): User | null => {
  const db = getDB();
  const user = db.find(u => u.accountNumber === accountNumber);
  if (user) {
    user.chequeBooksLeft += 1;
    saveDB(db);
    return user;
  }
  return null;
};

export const issueCheque = (accountNumber: string, payee: string, amount: number, memo: string): User | null => {
  const db = getDB();
  const user = db.find(u => u.accountNumber === accountNumber);
  if (!user) return null;

  const cheque: Cheque = {
    id: generateId(),
    number: Math.floor(100000 + Math.random() * 900000).toString(),
    payee,
    amount,
    date: new Date().toISOString(),
    memo,
    status: ChequeStatus.ISSUED
  };

  user.cheques.push(cheque);
  saveDB(db);
  return user;
};

// --- Admin ---

export const getAllUsers = (): User[] => {
  return getDB();
};

export const adminAdjustBalance = (accountNumber: string, amount: number) => {
    const db = getDB();
    const user = db.find(u => u.accountNumber === accountNumber);
    if (user) {
        user.balance += amount;
        if (user.balance < 0) user.balance = 0; // Prevent negative balance from admin adjust
        user.transactions.unshift({
             id: generateId(),
             date: new Date().toISOString(),
             type: amount > 0 ? TransactionType.DEPOSIT : TransactionType.WITHDRAWAL,
             amount: Math.abs(amount),
             description: 'Admin Adjustment',
             status: 'success'
        });
        saveDB(db);
    }
};

export const adminAction = (action: 'APPROVE_LOAN' | 'REJECT_LOAN' | 'CLEAR_CHEQUE' | 'BOUNCE_CHEQUE' | 'FREEZE' | 'UNFREEZE' | 'UNLOCK_CARD' | 'ISSUE_CARD' | 'FREEZE_CARD', targetId: string, extra?: any): void => {
  const db = getDB();
  
  // Very basic linear search through all data structures
  db.forEach(user => {
    // Loans
    if (action === 'APPROVE_LOAN' || action === 'REJECT_LOAN') {
      const loan = user.loans.find(l => l.id === targetId);
      if (loan && loan.status === LoanStatus.PENDING) {
        loan.status = action === 'APPROVE_LOAN' ? LoanStatus.APPROVED : LoanStatus.REJECTED;
        if (action === 'APPROVE_LOAN') {
          user.balance += loan.amount;
          user.transactions.unshift({
            id: generateId(),
            date: new Date().toISOString(),
            type: TransactionType.LOAN_DISBURSAL,
            amount: loan.amount,
            description: 'Loan Disbursed',
            status: 'success'
          });
        }
      }
    }

    // Cheques
    if (action === 'CLEAR_CHEQUE' || action === 'BOUNCE_CHEQUE') {
      const cheque = user.cheques.find(c => c.id === targetId);
      if (cheque && cheque.status === ChequeStatus.ISSUED) {
        if (action === 'CLEAR_CHEQUE') {
           if (user.balance >= cheque.amount) {
             cheque.status = ChequeStatus.CLEARED;
             user.balance -= cheque.amount;
             user.transactions.unshift({
               id: generateId(),
               date: new Date().toISOString(),
               type: TransactionType.CHEQUE_CLEARING,
               amount: cheque.amount,
               description: `Cheque ${cheque.number} Cleared`,
               status: 'success'
             });
           } else {
             cheque.status = ChequeStatus.BOUNCED; // Auto bounce if no funds
           }
        } else {
          cheque.status = ChequeStatus.BOUNCED;
        }
      }
    }
    
    // Account Actions
    if (user.accountNumber === targetId) {
        if (action === 'FREEZE') user.isFrozen = true;
        if (action === 'UNFREEZE') user.isFrozen = false;
        
        // Card Actions
        if (action === 'UNLOCK_CARD' && user.card) {
            user.card.status = 'ACTIVE';
            user.card.wrongPinAttempts = 0;
        }
        if (action === 'FREEZE_CARD' && user.card) {
            user.card.status = 'FROZEN';
        }
        if (action === 'ISSUE_CARD' && !user.card) {
             // Logic from issueCard repeated here to save to current DB ref
            const cardNumber = '4' + Math.random().toString().substr(2, 15);
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 4);
            const expiry = `${String(expiryDate.getMonth() + 1).padStart(2, '0')}/${String(expiryDate.getFullYear()).substr(2, 2)}`;
            
            user.card = {
                number: cardNumber,
                expiry,
                cvv: Math.floor(100 + Math.random() * 899).toString(),
                pin: '1234',
                status: 'ACTIVE',
                wrongPinAttempts: 0,
                dailyLimit: 2000,
                dailyWithdrawn: 0
            };
        }
    }
  });
  
  saveDB(db);
};
