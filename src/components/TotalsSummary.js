import React, { useMemo } from "react";
import { Currency } from "../utils/Currency";

export function TotalsSummary({ total, spendingLimit }) {
  const remaining = useMemo(() => {
    if (spendingLimit === null || spendingLimit === undefined) {
      return null;
    }
    return spendingLimit - total;
  }, [spendingLimit, total]);

  const remainingClass = useMemo(() => {
    if (remaining === null || spendingLimit === null || spendingLimit === 0) {
      return "";
    }

    if (remaining <= 0) {
      return "remaining-critical";
    }

    const ratio = remaining / spendingLimit;
    if (ratio >= 0.5) {
      return "remaining-safe";
    }
    if (ratio >= 0.25) {
      return "remaining-warn";
    }
    if (ratio >= 0.1) {
      return "remaining-alert";
    }
    return "remaining-critical";
  }, [remaining, spendingLimit]);

  return (
    <div className="totals-summary">
      <h3>Total: {Currency.format(total)}</h3>
      {remaining !== null && (
        <div className="totals-metrics">
          <div className="totals-metric">
            <span>Limite</span>
            <strong>{Currency.format(spendingLimit)}</strong>
          </div>
          <div className="totals-metric">
            <span>Restante</span>
            <strong className={remainingClass}>
              {Currency.format(remaining)}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}
