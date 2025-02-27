export class Currency {
  static format(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  static unformat(value) {
    return value.replace(/[^\d.,]/g, "");
  }
}
