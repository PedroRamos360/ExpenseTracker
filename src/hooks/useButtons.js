import { useCallback } from "react";
import { errorAlert, successAlert } from "../utils/alerts";
import { Clipboard } from "../utils/Clipboard";

export function useButtons({ saveExpenses, expenses, total }) {
  const clearExpenses = useCallback(() => {
    saveExpenses([]);
    successAlert("Sucesso!", "Todos os gastos foram apagados!");
  }, [saveExpenses]);

  const importFromClipboard = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      const newExpenses = Clipboard.treatTextBeforeImporting(text);
      if (newExpenses.includes("error")) {
        errorAlert(
          "Erro!",
          "Um ou mais gastos estão em um formato inválido (use o formato: Mercado: 25.00)"
        );
        return;
      }
      saveExpenses(newExpenses);
      successAlert("Sucesso!", "Gastos importados com sucesso!");
    });
  }, [saveExpenses]);

  const exportToClipboard = useCallback(() => {
    navigator.clipboard.writeText(Clipboard.labelsFirst(expenses, total));
    successAlert(
      "Sucesso!",
      "Gastos copiados para a área de transferência com sucesso!"
    );
  }, [expenses, total]);

  const exportToClipboardValueFirst = useCallback(() => {
    navigator.clipboard.writeText(Clipboard.valuesFirst(expenses, total));
    successAlert(
      "Sucesso!",
      "Gastos copiados para a área de transferência com sucesso!"
    );
  }, [expenses, total]);

  return {
    clearExpenses,
    importFromClipboard,
    exportToClipboard,
    exportToClipboardValueFirst,
  };
}
