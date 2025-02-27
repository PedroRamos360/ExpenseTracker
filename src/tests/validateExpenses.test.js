import { validateExpense } from "../utils/validateExpense";

describe("validateExpense", () => {
  test.each([
    // Valid cases
    ["Mercado: 25.00", true],
    ["Farmácia: 10,50", true],
    ["Restaurante: 50", true],
    ["Supermercado: 100,00", true],
    ["Cinema: 15.5", true],
    ["Transporte: 5", true],
    ["Aluguel: 1200.00", true],
    ["Internet: 99,99", true],
    ["Academia: 75.25", true],
    ["Café: 3.75", true],
    ["Mercado (Promoção): 25.00", true],
    ["Farmácia (Desconto): 10,50", true],

    // Invalid cases
    ["Mercado: ", false],
    ["Farmácia: abc", false],
    ["Restaurante: 50.000", false],
    ["Supermercado: 100,000", false],
    ["Cinema: 15.555", false],
    ["Transporte: 5,5,5", false],
    ["Aluguel: 1200.000", false],
    ["Internet: 99,99,99", false],
  ])('should validate "%s" as %s', (input, expected) => {
    expect(validateExpense(input)).toBe(expected);
  });
});
