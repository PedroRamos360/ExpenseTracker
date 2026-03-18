import React, { useEffect, useState } from "react";
import { errorAlert } from "../utils/alerts";

export function SettingsModal({ isOpen, onClose, spendingLimit, onSave }) {
  const [limitInput, setLimitInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      const hasLimit = spendingLimit !== null && spendingLimit !== undefined;
      setLimitInput(hasLimit ? String(spendingLimit) : "");
    }
  }, [isOpen, spendingLimit]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    const trimmed = limitInput.trim();
    if (!trimmed) {
      onSave(null);
      onClose();
      return;
    }

    const normalized = trimmed.replace(",", ".");
    const parsed = Number.parseFloat(normalized);
    if (Number.isNaN(parsed) || parsed < 0) {
      errorAlert("Valor inválido!", "Use um número positivo para o limite.");
      return;
    }

    onSave(parsed);
    onClose();
  };

  return (
    <div
      className="settings-modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="settings-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="settings-modal-header">
          <h2>Configurações</h2>
          <button
            type="button"
            className="settings-modal-close"
            onClick={onClose}
            aria-label="Fechar configurações"
          >
            ×
          </button>
        </div>
        <div className="settings-modal-body">
          <label className="settings-label" htmlFor="spending-limit">
            Limite de gastos
          </label>
          <input
            id="spending-limit"
            type="text"
            value={limitInput}
            onChange={(event) => setLimitInput(event.target.value)}
            placeholder="Ex: 1000"
          />
        </div>
        <div className="settings-modal-footer">
          <button
            type="button"
            className="settings-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="settings-primary"
            onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
