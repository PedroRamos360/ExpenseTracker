import { useState, useCallback, useEffect } from "react";
import { Storage } from "../storage/Storage";
import { successAlert, errorAlert, withConfirmation } from "../utils/alerts";

export function useTabs() {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [isCreatingTab, setIsCreatingTab] = useState(false);
  const [newTabName, setNewTabName] = useState("");

  useEffect(() => {
    const storedTabs = Storage.getTabs();
    const activeTab = Storage.getActiveTab();
    setTabs(storedTabs);
    setActiveTabId(activeTab);
  }, []);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const createTab = useCallback(
    (name) => {
      if (!name.trim()) {
        errorAlert("Nome inválido!", "O nome da aba não pode estar vazio.");
        return;
      }

      if (tabs.some((tab) => tab.name.toLowerCase() === name.toLowerCase())) {
        errorAlert("Nome duplicado!", "Já existe uma aba com esse nome.");
        return;
      }

      const newTab = Storage.createTab(name.trim());
      const updatedTabs = Storage.getTabs();
      setTabs(updatedTabs);
      setActiveTabId(newTab.id);
      Storage.setActiveTab(newTab.id);
      successAlert("Sucesso!", `Aba "${name}" criada com sucesso!`);
    },
    [tabs]
  );

  const deleteTab = useCallback(
    (tabId) => {
      if (tabs.length <= 1) {
        errorAlert("Erro!", "Não é possível excluir a última aba.");
        return;
      }

      const tabToDelete = tabs.find((tab) => tab.id === tabId);
      if (!tabToDelete) return;

      withConfirmation(() => {
        const updatedTabs = Storage.deleteTab(tabId);
        setTabs(updatedTabs);

        if (activeTabId === tabId && updatedTabs.length > 0) {
          const newActiveTabId = updatedTabs[0].id;
          setActiveTabId(newActiveTabId);
          Storage.setActiveTab(newActiveTabId);
        }

        successAlert(
          "Sucesso!",
          `Aba "${tabToDelete.name}" excluída com sucesso!`
        );
      }, `Tem certeza que deseja excluir a aba "${tabToDelete.name}"? Todos os gastos desta aba serão perdidos.`);
    },
    [tabs, activeTabId]
  );

  const switchTab = useCallback((tabId) => {
    setActiveTabId(tabId);
    Storage.setActiveTab(tabId);
  }, []);

  const updateTabExpenses = useCallback((tabId, expenses) => {
    Storage.updateTabExpenses(tabId, expenses);
    const updatedTabs = Storage.getTabs();
    setTabs(updatedTabs);
  }, []);

  const renameTab = useCallback(
    (tabId, newName) => {
      if (!newName.trim()) {
        errorAlert("Nome inválido!", "O nome da aba não pode estar vazio.");
        return;
      }

      if (
        tabs.some(
          (tab) =>
            tab.id !== tabId && tab.name.toLowerCase() === newName.toLowerCase()
        )
      ) {
        errorAlert("Nome duplicado!", "Já existe uma aba com esse nome.");
        return;
      }

      const updatedTabs = Storage.renameTab(tabId, newName.trim());
      setTabs(updatedTabs);
      successAlert("Sucesso!", `Aba renomeada para "${newName}" com sucesso!`);
    },
    [tabs]
  );

  return {
    tabs,
    activeTab,
    activeTabId,
    createTab,
    deleteTab,
    switchTab,
    updateTabExpenses,
    renameTab,
    isCreatingTab,
    setIsCreatingTab,
    newTabName,
    setNewTabName,
  };
}
