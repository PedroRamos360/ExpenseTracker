const STORAGE_BASE_KEY = "EXPENSE_TRACKER";

const StorageKeys = {
  expenses: `${STORAGE_BASE_KEY}-expenses`,
  tabs: `${STORAGE_BASE_KEY}-tabs`,
  activeTab: `${STORAGE_BASE_KEY}-active-tab`,
};

export class Storage {
  static getStoredExpenses() {
    return JSON.parse(localStorage.getItem(StorageKeys.expenses)) || [];
  }

  static storeExpenses(expenses) {
    localStorage.setItem(StorageKeys.expenses, JSON.stringify(expenses));
  }

  static getTabs() {
    const tabs = JSON.parse(localStorage.getItem(StorageKeys.tabs));
    if (!tabs || tabs.length === 0) {
      const defaultTab = {
        id: "default",
        name: "Principal",
        expenses: this.getStoredExpenses(),
      };
      this.storeTabs([defaultTab]);
      return [defaultTab];
    }
    return tabs;
  }

  static storeTabs(tabs) {
    localStorage.setItem(StorageKeys.tabs, JSON.stringify(tabs));
  }

  static getActiveTab() {
    const activeTabId = localStorage.getItem(StorageKeys.activeTab);
    if (!activeTabId) {
      this.setActiveTab("default");
      return "default";
    }
    return activeTabId;
  }

  static setActiveTab(tabId) {
    localStorage.setItem(StorageKeys.activeTab, tabId);
  }

  static createTab(name) {
    const tabs = this.getTabs();
    const newTab = {
      id: Date.now().toString(),
      name,
      expenses: [],
    };
    tabs.push(newTab);
    this.storeTabs(tabs);
    return newTab;
  }

  static deleteTab(tabId) {
    const tabs = this.getTabs();
    const filteredTabs = tabs.filter((tab) => tab.id !== tabId);
    this.storeTabs(filteredTabs);

    const activeTab = this.getActiveTab();
    if (activeTab === tabId && filteredTabs.length > 0) {
      this.setActiveTab(filteredTabs[0].id);
    }

    return filteredTabs;
  }

  static updateTabExpenses(tabId, expenses) {
    const tabs = this.getTabs();
    const updatedTabs = tabs.map((tab) =>
      tab.id === tabId ? { ...tab, expenses } : tab
    );
    this.storeTabs(updatedTabs);
  }

  static renameTab(tabId, newName) {
    const tabs = this.getTabs();
    const updatedTabs = tabs.map((tab) =>
      tab.id === tabId ? { ...tab, name: newName } : tab
    );
    this.storeTabs(updatedTabs);
    return updatedTabs;
  }
}
