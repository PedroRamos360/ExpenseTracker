import { useCallback } from "react";
import { successAlert, errorAlert } from "../utils/alerts";
import { validateExpense } from "../utils/validateExpense";
import { Currency } from "../utils/Currency";

export function useButtons({ saveExpenses, expenses, total }) {
  const clearExpenses = useCallback(() => {
    saveExpenses([]);
    successAlert("Sucesso!", "Todos os gastos foram apagados!");
  }, [saveExpenses]);

  const importFromClipboard = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      const newExpenses = text
        .split(/[\r\n]+/)
        .map((expense) => {
          if (expense === "" || expense.startsWith("Total: ")) {
            return null;
          }
          let [label, value] = expense.split(":").map((item) => item.trim());
          value = Currency.unformat(value);
          const formattedExpense = `${label}: ${value}`;
          if (!validateExpense(formattedExpense)) {
            console.log("Invalid expense: ", formattedExpense);
            return "error";
          }

          if (value.includes(",")) {
            value = value.replace(",", ".");
          }
          return { label, value };
        })
        .filter((expense) => expense);
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
    const formattedExpenses = expenses.map((expense) => {
      return `${expense.label}: ${Currency.format(expense.value)}`;
    });
    const formattedExpensesString = `${formattedExpenses.join(
      "\n"
    )}\n\nTotal: ${Currency.format(total)}`;
    navigator.clipboard.writeText(formattedExpensesString);
    successAlert(
      "Sucesso!",
      "Gastos copiados para a área de transferência com sucesso!"
    );
  }, [expenses, total]);

  const exportToClipboardValueFirst = useCallback(() => {
    const formattedExpenses = expenses.map((expense) => {
      return `${Currency.format(expense.value)}: ${expense.label}`;
    });
    const formattedExpensesString = `${formattedExpenses.join(
      "\n"
    )}\n\nTotal: ${Currency.format(total)}`;
    navigator.clipboard.writeText(formattedExpensesString);
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
