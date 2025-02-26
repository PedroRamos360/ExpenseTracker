import React, { useCallback, useMemo } from "react";
import { IoCopyOutline } from "react-icons/io5";
import "./App.css";
import swal from "sweetalert";
import { TfiImport } from "react-icons/tfi";
import { FaTrash } from "react-icons/fa";

const STORAGE_BASE_KEY = "EXPENSE_TRACKER";

const StorageKeys = {
  expenses: `${STORAGE_BASE_KEY}-expenses`,
};

function App() {
  const [expenses, setExpenses] = React.useState(getSavedExpenses());
  const [newExpense, setNewExpense] = React.useState("");

  const handleNewExpense = (event) => {
    setNewExpense(event.target.value);
  };

  const saveExpenses = useCallback((expensesToSave) => {
    setExpenses(expensesToSave);
    localStorage.setItem(StorageKeys.expenses, JSON.stringify(expensesToSave));
  }, []);

  const addExpense = useCallback(() => {
    if (!validateExpense(newExpense)) {
      errorAlert("Formato inválido!", "Use o formato: Mercado: 25.00");
      return;
    }
    let [label, value] = newExpense.split(":").map((item) => item.trim());
    if (value.includes(",")) {
      value = value.replace(",", ".");
    }
    if (isNaN(value)) {
      errorAlert("Formato inválido!", "Use o formato: Mercado: 25.00");
      return;
    }
    const expense = { label, value };
    saveExpenses([...expenses, expense]);
    setNewExpense("");
  }, [newExpense, expenses, saveExpenses]);

  const total = useMemo(() => {
    return expenses.reduce((acc, curr) => {
      return acc + parseFloat(curr.value);
    }, 0);
  }, [expenses]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const exportToClipboard = useCallback(() => {
    const formattedExpenses = expenses.map((expense) => {
      return `${expense.label}: ${expense.value}`;
    });
    const formattedExpensesString = formattedExpenses.join("\n");
    navigator.clipboard.writeText(formattedExpensesString);
    successAlert(
      "Sucesso!",
      "Gastos copiados para a área de transferência com sucesso!"
    );
  }, [expenses]);

  const importFromClipboard = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      console.log(text);
      const newExpenses = text.split(/[\r\n]+/).map((expense) => {
        let [label, value] = expense.split(":").map((item) => item.trim());
        console.log({
          expense,
          result: validateExpense(expense),
        });
        if (!validateExpense(expense)) {
          return "error";
        }
        if (value.includes(",")) {
          value = value.replace(",", ".");
        }
        return { label, value };
      });
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

  return (
    <main>
      <div className="container">
        <h1>Calculadora de Gastos</h1>
        <div>
          <div className="add-expense-container">
            <input
              type="text"
              value={newExpense}
              onChange={handleNewExpense}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  addExpense();
                }
              }}
              placeholder={`EX: Mercado: 25.00`}
            />
            <button onClick={addExpense} className="add-button">
              Adicionar
            </button>
          </div>
          <div className="expenses-container">
            <div>
              <button
                onClick={exportToClipboard}
                className="header-button"
                title="Copiar gastos para a área de transferência"
              >
                <IoCopyOutline size={20} />
              </button>
              <button
                onClick={importFromClipboard}
                className="header-button"
                title="Importar gastos da área de transferência"
              >
                <TfiImport size={20} />
              </button>
            </div>
            <h2>Gastos</h2>
            <ul>
              {expenses.map((expense, index) => (
                <li key={index}>
                  <div className="expense-li">
                    <button className="delete-button">
                      <FaTrash
                        onClick={() => {
                          const newExpenses = expenses.filter(
                            (expenseItem) => expenseItem !== expense
                          );
                          saveExpenses(newExpenses);
                        }}
                        size={17}
                      />
                    </button>
                    <p>
                      {expense.label}: {formatCurrency(expense.value)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="footer">
              <hr />
              <h3>Total: {formatCurrency(total)}</h3>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function validateExpense(expense) {
  const regexToMatch = /^[a-zA-Z0-9ç ]+:\s*[0-9]+([.,]\d{1,2})?$/g;
  if (!regexToMatch.test(expense)) {
    return false;
  }
  return true;
}

function successAlert(title, text) {
  swal({
    title: title,
    text: text,
    icon: "success",
    buttons: {
      confirm: {
        text: "Ok",
        value: true,
        visible: true,
        className: "",
        closeModal: true,
      },
    },
  });
}

function errorAlert(title, text) {
  swal({
    title: title,
    text: text,
    icon: "error",
    buttons: {
      confirm: {
        text: "Ok",
        value: true,
        visible: true,
        className: "",
        closeModal: true,
      },
    },
  });
}

function getSavedExpenses() {
  return JSON.parse(localStorage.getItem(StorageKeys.expenses)) || [];
}

export default App;
