import { input, number, select, confirm } from "@inquirer/prompts";
import { addAccount, getAccount, getAccountByName } from "./db.js";
import { createCustomer, getCustomerObj } from "./customersManager.js";
import { getAllAccounts, getStatistics } from "./db.js";
import { devNull } from "node:os";
import { info, log } from "node:console";
import { escape } from "node:querystring";
import { atmValidation } from "./utils/utils.js";

async function createAccountHandle() {
  const name = await input({
    message: "Enter your full name: ",
    validate: (value) => {
      if (value.length > 2 && /^[a-zA-Zא-ת]+$/.test(value)) {
        return true;
      }
      return "Name must can be only letters (2 or more). try again";
    },
  });
  const accountType = await select({
    message: "Select an account type: ",
    choices: [
      {
        name: "Regular",
        value: "Regular",
      },
      {
        name: "Premium",
        value: "Premium",
      },
      {
        name: "Student",
        value: "Student",
      },
    ],
  });
  const initialBalance = await input({
    message: "Enter amount for account balance: ",
    validate: (value) => {
      const num = Number(value);
      if (value.trim() === "" || Number.isNaN(num) || num < 0) {
        return "You must type non-negative number, try again.";
      }
      return true;
    },
  });
  const account = createCustomer(name, accountType, Number(initialBalance));
  if (account) {
    addAccount(account);
    console.log(`Account created successfully. (id: ${account.id})`);
  }
}

async function atmHandle() {
  const atmAction = await select({
    message: "Select transaction",
    choices: [
      {
        name: "Deposit",
        value: "deposit",
      },
      {
        name: "Withdraw",
        value: "withdraw",
      },
      {
        name: "Close account",
        value: "closeAccount",
      },
    ],
  });
  const accountId = await getValidId();
  const account = getAccount(Number(accountId));

  if (atmAction === "deposit") {
    const done = account.deposit(
      await getNumberInput("Enter amount you would like to deposit: "),
    );
    if (done) {
      console.log("Deposit completed successfully");
    }
    return "Deposit failed.";
  } else if (atmAction === "withdraw") {
    const withrawNum = await input({
      message: 'Enter amount you would like to withraw',
      validate: (value) => {
        const num = Number(value);
        if (value.trim() === "" || Number.isNaN(num) || num < 0) {
          return "You must type non-negative number, try again.";
        } else if (!atmValidation(account.balance, num, 'withraw')) {
          return "Withdraw failed: insufficient balance"
        }
        return true;
    },
  })
    const done = account.withdraw(Number(withrawNum))
    if (done) {
      console.log("Withdraw completed successfully");
    }

  } else if (atmAction === "closeAccount") {
    const userConfirm = await confirm({ message: "Are you sure? (Y/N)" });
    if (userConfirm) {
      const msg = account.closeAccount();
      return msg;
    }
  }
}

async function getValidId() {
  const accountId = await input({
    message: "Enter your id number account: ",
    validate: (value) => {
      const num = Number(value);
      if (value.trim() === "" || Number.isNaN(num) || num < 0) {
        return "You must type non-negative number, try again.";
      }
      if (!getAccount(num)) return "Account not found. try again";
      return true;
    },
  });
  return Number(accountId);
}

async function getExistsName() {
  const accountName = await input({
    message: "Enter your name account: ",
    validate: (value) => {
      if (!getAccountByName(value)) {
        return "Account not found. try again";
      }
      return true;
    },
  });
  return accountName;
}

async function getNumberInput(msg) {
  const number = await input({
    message: msg,
    validate: (value) => {
      const num = Number(value);
      if (value.trim() === "" || Number.isNaN(num) || num < 0) {
        return "You must type non-negative number, try again.";
      }
      return true;
    },
  });
  return Number(number);
}


async function informationHandle() {
  const infoAction = await select({
    message: "Select the information you want to see",
    choices: [
      {
        name: "Show Customers",
        value: "showCustomers",
      },
      {
        name: "Search Customer",
        value: "searchCustomer",
      },
      {
        name: "Show Statistics",
        value: "showStatistics",
      },
    ],
  });
  if (infoAction === "showCustomers") {
    console.table(getAllAccounts());
  } else if (infoAction === "searchCustomer") {
    const by = await select({
      message: "Search by:",
      choices: [
        {value: "id"},
        {value: "name"},
      ],
    });

    switch (by) {
      case "id":
        const idNumber = await getValidId();
        const accById = getAccount(idNumber);
        console.table(getCustomerObj(accById));
        break;
      case "name":
        const nameAccount = await getExistsName();
        const accByName = getAccountByName(nameAccount);
        console.table(getCustomerObj(accByName));
        break;
    }
  } else if (infoAction === "showStatistics") {
    const dict = {
      totalCustomers: "Total Customers",
      activeAccounts: "Active Accounts",
      totalMoney: "Total Money",
      averageBalance: "Average Balance",
      highestBalance: "Highest Balance",
    };
    const stat = getStatistics();
    console.log("===== Statistics =====");
    for (const figure in stat) {
      console.log(`${dict[figure]}: ${stat[figure]}`);
    }
  }
}

export async function generalMenu() {
  console.log("Welcome to Bank Account Manager!");
  let keepRunning = true;
  while (keepRunning) {
    const menuChoice = await select({
      message: "Choose a task",
      choices: [
        {
          name: "Create new account",
          value: "create",
        },
        {
          name: "ATM actions (deposit/withdraw/close-account)",
          value: "atm",
        },
        {
          name: "Get information",
          value: "info",
        },
        {
          name: "Exit",
          value: "exit",
        },
      ],
    });
    switch (menuChoice) {
      case "create": {
        await createAccountHandle();
        break;
      }
      case "atm": {
        await atmHandle();
        break;
      }
      case "info": {
        await informationHandle();
        break;
      }
      case "exit": {
        keepRunning = false;
        console.log("Goodbye.");
        break;
      }
    }

    console.log("\n---");
  }
}
