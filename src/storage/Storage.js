const STORAGE_BASE_KEY = "EXPENSE_TRACKER";

const StorageKeys = {
  expenses: `${STORAGE_BASE_KEY}-expenses`,
};

export class Storage {
  static getStoredExpenses() {
    return JSON.parse(localStorage.getItem(StorageKeys.expenses)) || [];
  }

  static storeExpenses(expenses) {
    localStorage.setItem(StorageKeys.expenses, JSON.stringify(expenses));
  }
}
