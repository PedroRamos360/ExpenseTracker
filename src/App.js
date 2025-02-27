import React, { useCallback, useMemo } from "react";
import { IoCopyOutline } from "react-icons/io5";
import "./App.css";
import { TfiImport } from "react-icons/tfi";
import { FaTrash } from "react-icons/fa";
import { AiOutlineClear } from "react-icons/ai";
import { BsCopy } from "react-icons/bs";
import { errorAlert, withConfirmation } from "./utils/alerts";
import { validateExpense } from "./utils/validateExpense";
import { Storage } from "./storage/Storage";
import { useButtons } from "./hooks/useButtons";
import { Currency } from "./utils/Currency";

function App() {
  const [expenses, setExpenses] = React.useState(Storage.getStoredExpenses());
  const [newExpense, setNewExpense] = React.useState("");
  const saveExpenses = useCallback((expensesToSave) => {
    setExpenses(expensesToSave);
    Storage.storeExpenses(expensesToSave);
  }, []);
  const total = useMemo(() => {
    return expenses.reduce((acc, curr) => {
      return acc + parseFloat(curr.value);
    }, 0);
  }, [expenses]);
  const {
    clearExpenses,
    importFromClipboard,
    exportToClipboard,
    exportToClipboardValueFirst,
  } = useButtons({
    saveExpenses,
    expenses,
    total,
  });

  const handleNewExpense = (event) => {
    setNewExpense(event.target.value);
  };

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
            <div className="header-button-container">
              <button
                onClick={exportToClipboard}
                className="header-button"
                title="Copiar gastos para a área de transferência (descrição primeiro)"
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
              <button
                onClick={() => {
                  withConfirmation(clearExpenses);
                }}
                className="header-button"
                title="Limpar todos gastos"
              >
                <AiOutlineClear size={20} />
              </button>
              <button
                onClick={exportToClipboardValueFirst}
                className="header-button"
                title="Copiar gastos para a área de transferência (valores primeiro)"
              >
                <BsCopy size={20} />
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
                      {expense.label}: {Currency.format(expense.value)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <footer>
              <hr />
              <h3>Total: {Currency.format(total)}</h3>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
