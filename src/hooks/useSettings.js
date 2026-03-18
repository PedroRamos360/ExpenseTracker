import { useCallback, useEffect, useState } from "react";
import { Storage } from "../storage/Storage";

export function useSettings() {
  const [spendingLimit, setSpendingLimitState] = useState(null);

  useEffect(() => {
    setSpendingLimitState(Storage.getSpendingLimit());
  }, []);

  const setSpendingLimit = useCallback((limit) => {
    Storage.setSpendingLimit(limit);
    setSpendingLimitState(limit);
  }, []);

  return {
    spendingLimit,
    setSpendingLimit,
  };
}
