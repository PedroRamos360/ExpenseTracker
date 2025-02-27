import { Currency } from "./Currency";
import { validateExpense } from "./validateExpense";

export class Clipboard {
  static valuesFirst(expenses, total) {
    const formattedExpenses = expenses.map((expense) => {
      return `${Currency.format(expense.value)}: ${expense.label}`;
    });
    const formattedExpensesString = `${formattedExpenses.join(
      "\n"
    )}\n\nTotal: ${Currency.format(total)}`;

    return formattedExpensesString;
  }

  static labelsFirst(expenses, total) {
    const formattedExpenses = expenses.map((expense) => {
      return `${expense.label}: ${Currency.format(expense.value)}`;
    });
    const formattedExpensesString = `${formattedExpenses.join(
      "\n"
    )}\n\nTotal: ${Currency.format(total)}`;
    return formattedExpensesString;
  }

  static treatTextBeforeImporting(text) {
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
    return newExpenses;
  }
}
