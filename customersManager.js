import {
  IdGenerator,
  createAccountIsValid,
  atmValidation,
} from "./utils/utils.js";
import { getAllAccounts, getAccount, getAccountByName } from "./db.js";

export function createCustomer(fullName, accountType, initialBalance) {
  if (createAccountIsValid(fullName, accountType, initialBalance)) {
    return {
      id: IdGenerator(),
      fullName,
      accountType,
      balance: initialBalance,
      isActive: true,
      deposit: function (amount) {
        if (!atmValidation(amount, "deposit")) {
          return false;
        }
        this.balance += amount;
        return true;
      },
      withdraw: function (amount) {
        if (!atmValidation(amount, "withraw")) {
          return false;
        }
        this.balance -= amount;
        return true;
      },
      closeAccount() {
        if (!this.isActive) {
          return "Account is already close.";
        }
        this.isActive = false;
        return "Account closed successfully";
      },
    };
  }
  return null
}

export function getCustomerObj(customer) {
    return Object.fromEntries(
    Object.entries(customer).filter(
      ([key, value]) => typeof value !== "function",
    ),
  );
}

