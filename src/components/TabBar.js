import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaTimes, FaEdit } from "react-icons/fa";

export function TabBar({
  tabs,
  activeTabId,
  onSwitchTab,
  onCreateTab,
  onDeleteTab,
  onRenameTab,
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTabName, setNewTabName] = useState("");
  const [editingTab, setEditingTab] = useState(null);
  const [editingName, setEditingName] = useState("");
  const tabsContainerRef = useRef(null);
  const newTabInputRef = useRef(null);
  const editInputRef = useRef(null);

  const calculateInputWidth = (text, minWidth = 80, maxWidth = 160) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "16px Arial";
    const textWidth = context.measureText(text || "Nome da aba").width;
    const padding = 20;
    return Math.min(Math.max(textWidth + padding, minWidth), maxWidth);
  };

  const handleCreateTab = () => {
    if (newTabName.trim() && isCreating) {
      onCreateTab(newTabName);
      setNewTabName("");
      setIsCreating(false);
    }
  };

  const handleRenameTab = (tabId) => {
    if (editingName.trim() && editingTab === tabId) {
      onRenameTab(tabId, editingName);
      setEditingTab(null);
      setEditingName("");
    }
  };

  const startEditing = (tab) => {
    setEditingTab(tab.id);
    setEditingName(tab.name);
  };

  const cancelEditing = () => {
    setEditingTab(null);
    setEditingName("");
  };

  useEffect(() => {
    if (tabsContainerRef.current && activeTabId) {
      const activeTabElement = tabsContainerRef.current.querySelector(
        `[data-tab-id="${activeTabId}"]`
      );
      if (activeTabElement) {
        activeTabElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeTabId]);

  useEffect(() => {
    if (newTabInputRef.current && isCreating) {
      const width = calculateInputWidth(newTabName);
      newTabInputRef.current.style.width = `${width}px`;
    }
  }, [newTabName, isCreating]);

  useEffect(() => {
    if (editInputRef.current && editingTab) {
      const width = calculateInputWidth(editingName, 60, 140);
      editInputRef.current.style.width = `${width}px`;
    }
  }, [editingName, editingTab]);

  return (
    <div className="tab-bar">
      <div className="tabs-container" ref={tabsContainerRef}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            data-tab-id={tab.id}
            className={`tab ${tab.id === activeTabId ? "active" : ""}`}
          >
            {editingTab === tab.id ? (
              <div className="tab-edit-container">
                <input
                  ref={editInputRef}
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleRenameTab(tab.id);
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      cancelEditing();
                    }
                  }}
                  onBlur={(e) => {
                    if (editingName.trim() && !e.relatedTarget) {
                      handleRenameTab(tab.id);
                    } else {
                      cancelEditing();
                    }
                  }}
                  className="tab-edit-input"
                  autoFocus
                  maxLength={20}
                />
              </div>
            ) : (
              <>
                <span
                  className="tab-name"
                  onClick={() => onSwitchTab(tab.id)}
                  onDoubleClick={() => startEditing(tab)}
                  title={tab.name}
                >
                  {tab.name}
                </span>
                <div className="tab-actions">
                  <button
                    className="tab-action-button edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(tab);
                    }}
                    title="Renomear aba"
                    aria-label={`Renomear aba ${tab.name}`}
                  >
                    <FaEdit size={14} />
                  </button>
                  {tabs.length > 1 && (
                    <button
                      className="tab-action-button delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTab(tab.id);
                      }}
                      title="Excluir aba"
                      aria-label={`Excluir aba ${tab.name}`}
                    >
                      <FaTimes size={14} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}

        {isCreating ? (
          <div className="tab new-tab">
            <input
              ref={newTabInputRef}
              type="text"
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateTab();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setIsCreating(false);
                  setNewTabName("");
                }
              }}
              onBlur={(e) => {
                if (newTabName.trim() && !e.relatedTarget) {
                  handleCreateTab();
                } else if (!newTabName.trim()) {
                  setIsCreating(false);
                  setNewTabName("");
                }
              }}
              placeholder="Nome da aba"
              className="new-tab-input"
              autoFocus
              maxLength={20}
            />
          </div>
        ) : (
          <button
            className="add-tab-button"
            onClick={() => setIsCreating(true)}
            title="Criar nova aba"
            aria-label="Criar nova aba"
          >
            <FaPlus size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
