import { createAccount } from "./createAccount";

export const optionTransact = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

export const generatePassword = (lastname, date) => {
  const dateObject = new Date(date);
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const year = dateObject.getFullYear();
  return `${lastname}${month}${day}${year}`;
};

export function reducerTransaction(state, action) {
  switch (action.type) {
    case "SET_INPUT": {
      const { field, input } = action.payload;
      return {
        ...state,
        [field]: input,
        [`${field}Error`]: "",
        [`is${field}Error`]: false,
      };
    }
    case "EMPTY_INPUT": {
      const { field, message } = action.payload;
      return {
        ...state,
        [`${field}Error`]: message,
        [`is${field}Error`]: true,
      };
    }

    case "CREATE_ACCOUNT":
      return createAccount(state);
    case "ADD_ACCOUNT":
      return { ...state, isAddAcc: !state.isAddAcc };
    case "DELETE_ACCOUNT": {
      const updateAccount = state.accountList.filter(
        (acc) => acc.id !== action.payload
      );
      localStorage.setItem("account", JSON.stringify(updateAccount));

      return { ...state, accountList: updateAccount };
    }
    case "SELECTED_ACCOUNT": {
      localStorage.setItem("selectedAccount", JSON.stringify(action.payload));
      return {
        ...state,
        selectedAccount: action.payload,
        isOpenDetails: !state.isOpenDetails,
      };
    }
    case "CLOSE_ACCOUNT-DETAILS":
      return { ...state, isOpenDetails: action.payload };
    case "WIDTHDRAW": {
      const withdrawalAmount = state.amountWidthdraw;
      const selectedAccount = state.selectedAccount;
      const newBalance = +selectedAccount.initialBalance - +withdrawalAmount;

      const widthdrawTransaction = {
        type: "widthdraw",
        date: new Intl.DateTimeFormat("en-PH", optionTransact).format(
          new Date()
        ),
        name: selectedAccount.firstName,
        id: state.selectedAccount.userTransactionHistory.length + 1,
        amount: withdrawalAmount,
      };

      const updatedAccount = state.accountList.map((account) =>
        account.id === selectedAccount.id
          ? {
              ...account,
              initialBalance: newBalance,
              userTransactionHistory: [
                widthdrawTransaction,
                ...state.selectedAccount.userTransactionHistory,
              ],
            }
          : account
      );

      const getAllTransaction = updatedAccount.flatMap((acc) => [
        ...acc.userTransactionHistory,
        ...acc.expenseList,
      ]);

      console.log(getAllTransaction);
      const getSelectedAccount = updatedAccount.find(
        (acc) => acc.id === selectedAccount.id
      );

      localStorage.setItem("account", JSON.stringify(updatedAccount));

      localStorage.setItem(
        "selectedAccount",
        JSON.stringify({ ...getSelectedAccount })
      );
      localStorage.setItem(
        "allTransactionHistory",
        JSON.stringify(getAllTransaction)
      );
      return {
        ...state,
        allTransactionHistory: getAllTransaction,
        accountList: updatedAccount,
        selectedAccount: {
          ...getSelectedAccount,
        },
        amountWidthdraw: "",
      };
    }
    case "DEPOSIT": {
      const depositAmount = state.amountDeposit;
      const selectedAccount = state.selectedAccount;
      const newBalance = +selectedAccount.initialBalance + +depositAmount;

      const depositTransaction = {
        type: "deposit",
        date: new Intl.DateTimeFormat("en-PH", optionTransact).format(
          new Date()
        ),
        name: selectedAccount.firstName,
        id: state.selectedAccount.userTransactionHistory.length + 1,
        amount: depositAmount,
      };

      const updatedAccount = state.accountList.map((account) =>
        account.id === selectedAccount.id
          ? {
              ...account,
              initialBalance: newBalance,
              userTransactionHistory: [
                depositTransaction,
                ...state.selectedAccount.userTransactionHistory,
              ],
            }
          : account
      );
      const getSelectedAccount = updatedAccount.find(
        (acc) => acc.id === selectedAccount.id
      );
      const getAllTransaction = updatedAccount.flatMap((acc) => [
        ...acc.userTransactionHistory,
        ...acc.expenseList,
      ]);
      localStorage.setItem(
        "allTransactionHistory",
        JSON.stringify(getAllTransaction)
      );
      localStorage.setItem("account", JSON.stringify(updatedAccount));

      localStorage.setItem(
        "selectedAccount",
        JSON.stringify({ ...getSelectedAccount })
      );

      return {
        ...state,
        accountList: updatedAccount,
        allTransactionHistory: getAllTransaction,
        selectedAccount: { ...getSelectedAccount },
        amountDeposit: "",
      };
    }

    case "IS_APPROVED":
      return {
        ...state,
        isApproved: action.payload,
      };
    case "REJECT":
      return {
        ...state,
        amountLoan: "",
        loanTerms: "",
      };
    case "SET_LOAN-TERMS":
      return { ...state, loanTerms: action.payload };
    case "LOAN": {
      const insuranceBank = Math.round(
        (state.amountLoan * 1.25 * state.loanTerms) / 1000
      );
      const loanAmount = state.amountLoan - insuranceBank;
      console.log(loanAmount);
      const selectedAccount = state.selectedAccount;
      const newBalance = +selectedAccount.initialBalance + +loanAmount;

      const loanTransaction = {
        type: "loan",
        date: new Intl.DateTimeFormat("en-PH", optionTransact).format(
          new Date()
        ),
        name: selectedAccount.firstName,
        id: state.selectedAccount.userTransactionHistory.length + 1,
        amount: loanAmount,
      };

      const updatedAccount = state.accountList.map((account) =>
        account.id === selectedAccount.id
          ? {
              ...account,
              initialBalance: newBalance,
              userTransactionHistory: [
                loanTransaction,
                ...state.selectedAccount.userTransactionHistory,
              ],
            }
          : account
      );
      const getSelectedAccount = updatedAccount.find(
        (acc) => acc.id === selectedAccount.id
      );
      const getAllTransaction = updatedAccount.flatMap((acc) => [
        ...acc.userTransactionHistory,
        ...acc.expenseList,
      ]);
      localStorage.setItem(
        "allTransactionHistory",
        JSON.stringify(getAllTransaction)
      );
      localStorage.setItem("account", JSON.stringify(updatedAccount));

      localStorage.setItem(
        "selectedAccount",
        JSON.stringify({ ...getSelectedAccount })
      );

      return {
        ...state,
        accountList: updatedAccount,
        allTransactionHistory: getAllTransaction,
        selectedAccount: { ...getSelectedAccount },
        amountLoan: "",
        loanTerms: "",
      };
    }
    case "SEND_MONEY": {
      const receiver = state.accountList.find(
        (acc) => acc.id === state.receiverId
      );

      const newBalanceReceiver = +receiver.initialBalance + +state.senderAmount;
      const selectedAccount = state.selectedAccount;
      const newBalance = +selectedAccount.initialBalance - +state.senderAmount;

      const sendingTransaction = {
        type: "send",
        date: new Intl.DateTimeFormat("en-PH", optionTransact).format(
          new Date()
        ),
        name: selectedAccount.firstName,
        id: state.selectedAccount.userTransactionHistory.length + 1,
        amount: state.senderAmount,
      };
      const receivedTransaction = {
        type: "received",
        date: new Intl.DateTimeFormat("en-PH", optionTransact).format(
          new Date()
        ),
        name: receiver.firstName,
        id: receiver.userTransactionHistory.length + 1,
        amount: state.senderAmount,
      };

      const updatedAccount = state.accountList.map((account) =>
        account.id === receiver.id
          ? {
              ...account,
              initialBalance: newBalanceReceiver,
              userTransactionHistory: [
                receivedTransaction,
                ...receiver.userTransactionHistory,
              ],
            }
          : account.id === selectedAccount.id
          ? {
              ...account,
              initialBalance: newBalance,
              userTransactionHistory: [
                sendingTransaction,
                ...state.selectedAccount.userTransactionHistory,
              ],
            }
          : account
      );

      const getSelectedAccount = updatedAccount.find(
        (acc) => acc.id === selectedAccount.id
      );
      const getAllTransaction = updatedAccount.flatMap((acc) => [
        ...acc.userTransactionHistory,
        ...acc.expenseList,
      ]);
      localStorage.setItem(
        "allTransactionHistory",
        JSON.stringify(getAllTransaction)
      );
      localStorage.setItem("account", JSON.stringify(updatedAccount));

      localStorage.setItem(
        "selectedAccount",
        JSON.stringify({ ...getSelectedAccount })
      );
      return {
        ...state,
        accountList: updatedAccount,
        allTransactionHistory: getAllTransaction,
        selectedAccount: { ...getSelectedAccount },
        receiverId: "",
        senderId: "",
        senderAmount: "",
      };
    }
    case "INPUT_EXPENSE": {
      const updateExpenseName = state.selectedAccount.expenseList.map(
        (expense) =>
          expense.id === action.payload.id
            ? { ...expense, expenseName: action.payload.input }
            : expense
      );

      const updateAccount = {
        ...state.selectedAccount,
        expenseList: updateExpenseName,
      };
      localStorage.setItem("selectedAccount", JSON.stringify(updateAccount));

      return {
        ...state,
        selectedAccount: {
          ...state.selectedAccount,
          expenseList: updateExpenseName,
        },
        editExpenseName: action.payload.input,
      };
    }
    case "EDIT_EXPENSE-NAME": {
      const pickingExpense = state.selectedAccount.expenseList.map((expense) =>
        expense.id === action.payload
          ? { ...expense, isEdit: !expense.isEdit }
          : expense
      );
      localStorage.setItem(
        "selectedAccount",
        JSON.stringify({
          ...state.selectedAccount,
          expenseList: pickingExpense,
        })
      );
      return {
        ...state,
        selectedAccount: {
          ...state.selectedAccount,
          expenseList: pickingExpense,
        },
      };
    }
    case "SUBMIT_EDITED_EXPENSE": {
      const pickingExpense = state.selectedAccount.expenseList.map((expense) =>
        expense.id === action.payload
          ? { ...expense, isEdit: !expense.isEdit }
          : expense
      );
      localStorage.setItem(
        "selectedAccount",
        JSON.stringify({
          ...state.selectedAccount,
          expenseList: pickingExpense,
        })
      );
      return {
        ...state,
        selectedAccount: {
          ...state.selectedAccount,
          expenseList: pickingExpense,
        },
        editExpenseName: "",
      };
    }
    case "EXPENSE_ITEM": {
      const selectedAccount = state.selectedAccount;
      const addItem = {
        expenseName: state.expenseName,
        name: selectedAccount.firstName,
        amount: state.expenseAmount,
        type: "expense",
        isEdit: false,
        date: new Intl.DateTimeFormat("en-PH", optionTransact).format(
          new Date()
        ),
        id: selectedAccount.expenseList.length + 1,
      };
      const newBalance =
        +state.selectedAccount.initialBalance - state.expenseAmount;

      const updatedAccount = state.accountList.map((account) =>
        account.id === selectedAccount.id
          ? {
              ...account,
              initialBalance: newBalance,
              expenseList: [...state.selectedAccount.expenseList, addItem],
            }
          : account
      );

      const getSelectedAccount = updatedAccount.find(
        (acc) => acc.id === selectedAccount.id
      );
      const getAllTransaction = updatedAccount.flatMap((acc) => [
        ...acc.userTransactionHistory,
        ...acc.expenseList,
      ]);
      localStorage.setItem(
        "allTransactionHistory",
        JSON.stringify(getAllTransaction)
      );
      localStorage.setItem("account", JSON.stringify(updatedAccount));

      localStorage.setItem(
        "selectedAccount",
        JSON.stringify({ ...getSelectedAccount })
      );

      return {
        ...state,
        allTransactionHistory: getAllTransaction,
        accountList: updatedAccount,
        selectedAccount: { ...getSelectedAccount },
        expenseName: "",
        expenseAmount: "",
      };
    }
    case "DELETE_EXPENSE": {
      const selectedAccount = state.selectedAccount;
      const updateExpenseList = selectedAccount.expenseList.filter(
        (expense) => expense.id !== action.payload
      );

      const updatedAccount = state.accountList.map((account) =>
        account.id === selectedAccount.id
          ? {
              ...account,
              expenseList: updateExpenseList,
            }
          : account
      );

      const getSelectedAccount = updatedAccount.find(
        (acc) => acc.id === selectedAccount.id
      );

      localStorage.setItem("account", JSON.stringify(updatedAccount));

      localStorage.setItem(
        "selectedAccount",
        JSON.stringify({ ...getSelectedAccount })
      );
      return {
        ...state,
        selectedAccount: { ...getSelectedAccount },
      };
    }
    default:
      return state;
  }
}
