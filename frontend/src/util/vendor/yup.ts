/* eslint-disable no-template-curly-in-string */
import { setLocale } from 'yup';

setLocale({
  mixed: {
    required: '${path} é requerido',
    notType: '${path} é inválido',
  },
  string: {
    max: '${path} precisa ter no máximo ${max} caracteres',
    min: '${path} precisa ter no mínimo ${min} caracteres',
  },
  number: {
    max: '${path} precisa ter no máximo ${max}',
    min: '${path} precisa ter no mínimo ${min}',
  },
  array: {
    max: '${path} precisa ter no máximo ${max} item(ns)',
    min: '${path} precisa ter no mínimo ${min} item(ns)',
},
});

export * from 'yup';
