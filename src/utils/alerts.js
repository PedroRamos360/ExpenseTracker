import swal from "sweetalert";

export function successAlert(title, text) {
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

export function errorAlert(title, text) {
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

export function withConfirmation(callback) {
  swal({
    title: "Tem certeza?",
    text: "Você realmente quer deletar todos os seus gastos registrados?",
    icon: "warning",
    buttons: ["Cancelar", "Deletar"],
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      callback();
    }
  });
}
