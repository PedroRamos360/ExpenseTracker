export function validateExpense(expense) {
  const regexToMatch =
    /^[a-zA-Z0-9çáéíóúãõâêîôûàèìòùäëïöü() ]+:\s*[0-9]+([.,]\d{1,2})?$/g;
  if (!regexToMatch.test(expense)) {
    return false;
  }
  return true;
}
