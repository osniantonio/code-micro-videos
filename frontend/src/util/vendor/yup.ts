import { setLocale } from "yup";

setLocale({
  mixed: {
    required: "${path} é requerido",
    notType: "${path} é inválido",
  },
  string: {
    max: "${path} precisa ter no máximo ${max} caracteres",
  },
  number: {
    min: "${path} precisa ter no mínimo ${min}",
  },
});

export * from "yup";
