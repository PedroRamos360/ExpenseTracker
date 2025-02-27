import { Clipboard } from "../utils/Clipboard";

describe("Test Clipboard class", () => {
  const expenses = [
    {
      label: "Mercado",
      value: 25.0,
    },
    {
      label: "Farmácia",
      value: 10.0,
    },
    {
      label: "Restaurante",
      value: 50.0,
    },
  ];
  const total = 85;

  const normalizeString = (str) => str.replace(/\u00A0/g, " ");

  test("valuesFirst", () => {
    const result = Clipboard.valuesFirst(expenses, total);
    expect(normalizeString(result)).toEqual(
      "R$ 25,00: Mercado\nR$ 10,00: Farmácia\nR$ 50,00: Restaurante\n\nTotal: R$ 85,00"
    );
  });

  test("labelsFirst", () => {
    const result = Clipboard.labelsFirst(expenses, total);
    expect(normalizeString(result)).toEqual(
      "Mercado: R$ 25,00\nFarmácia: R$ 10,00\nRestaurante: R$ 50,00\n\nTotal: R$ 85,00"
    );
  });

  test("treatTextBeforeImporting", () => {
    const importText = Clipboard.labelsFirst(expenses, total);
    const result = Clipboard.treatTextBeforeImporting(importText);
    expect(result.includes("error")).toBe(false);
  });
});
