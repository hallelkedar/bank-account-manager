import { createCustomer } from "./customersManager.js";
const BankAccounts = [];

export function addAccount(account) {
  BankAccounts.push(account);
}

const getCleanAccount = (account) => {
  if (!account) return false;
  return Object.fromEntries(
    Object.entries(account).filter(
      ([key, value]) => typeof value !== "function",
    ),
  );
};

export function getAllAccounts() {
  return BankAccounts.map((account) => getCleanAccount(account));
}

export function getAccount(id) {
  return BankAccounts.find((acc) => acc.id === id);
}

export function getAccountByName(name) {
  const accName = name.trim().toLowerCase();
  const accounts = BankAccounts.filter(
    (acc) => acc.fullName.trim().toLowerCase() === accName
  );
  if (accounts.length === 0) return null;
  return accounts.map((acc) => getCleanAccount(acc))
}

export function getStatistics() {
  return {
    totalCustomers: BankAccounts.length,
    activeAccounts: BankAccounts.reduce(
      (total, account) => (account.isActive ? total + 1 : total),
      0,
    ),
    totalMoney: BankAccounts.reduce(
      (total, account) => total + Number(account.balance),
      0,
    ),
    get averageBalance() {
      return this.totalMoney / this.activeAccounts || 0;
    },
    highestBalance: BankAccounts.reduce(
      (max, account) => (account.balance > max ? (max = account.balance) : max),
      0,
    ),
  };
}
