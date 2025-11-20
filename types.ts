
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  LOAN_DISBURSAL = 'LOAN_DISBURSAL',
  LOAN_PAYMENT = 'LOAN_PAYMENT',
  ATM_WITHDRAWAL = 'ATM_WITHDRAWAL',
  CHEQUE_CLEARING = 'CHEQUE_CLEARING'
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  type: TransactionType;
  amount: number;
  description: string;
  targetAccount?: string; // For transfers
  status: 'success' | 'failed';
}

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  OVERDUE = 'OVERDUE'
}

export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  tenureMonths: number;
  monthlyEMI: number;
  status: LoanStatus;
  remainingAmount: number;
  appliedDate: string;
}

export enum ChequeStatus {
  ISSUED = 'ISSUED',
  PENDING = 'PENDING',
  CLEARED = 'CLEARED',
  BOUNCED = 'BOUNCED'
}

export interface Cheque {
  id: string;
  number: string;
  payee: string;
  amount: number;
  date: string;
  memo: string;
  status: ChequeStatus;
}

export interface Card {
  number: string;
  expiry: string; // MM/YY
  cvv: string;
  pin: string;
  status: 'ACTIVE' | 'FROZEN' | 'LOCKED';
  wrongPinAttempts: number;
  dailyLimit: number;
  dailyWithdrawn: number;
}

export interface User {
  accountNumber: string; // 5 digits
  password: string; // 6 digits
  name: string;
  email: string;
  balance: number;
  isAdmin: boolean;
  transactions: Transaction[];
  loans: Loan[];
  cheques: Cheque[];
  card?: Card;
  chequeBooksLeft: number;
  isFrozen: boolean;
}

export const ADMIN_USER = 'admin';
export const ADMIN_PASS = '09092009';
