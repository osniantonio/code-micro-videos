// @flow
import * as React from "react";
import {
  Box,
  Button,
  ButtonProps,
  Checkbox,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import categoryHttp from "../../util/http/category-http";
import { useHistory, useParams } from "react-router";
import { Category } from "../../util/models";
import { useState } from "react";
import * as yup from '../../util/vendor/yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

const validationSchema = yup.object().shape({
  name: yup.string().label("Nome").required().max(255),
});

export const Form = () => {
  const history = useHistory();
  const classes = useStyles();
  const { id }: any = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: "secondary",
    variant: "contained",
  };

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    errors,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      is_active: true,
    },
  });

  async function onSubmit(formData, event) {
    const http = !category
      ? categoryHttp.create(formData)
      : categoryHttp.update(category.id, formData);

    const { data } = await http;    

    setTimeout(() => {
      event
        ? id
          ? history.replace(`/categories/${data.data.id}/edit`)
          : history.push(`/categories/${data.data.id}/edit`)
        : history.push("/categories");
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <TextField
        name={"name"}
        label={"Nome"}
        variant={"outlined"}
        fullWidth
        InputLabelProps={{ shrink: true }}
        error={errors['name'] !== undefined}
        helperText={errors['name'] !== undefined && errors['name'].message}
        inputRef={register}
      />
      <TextField
        name={"description"}
        label={"Descrição"}
        variant={"outlined"}
        margin={"normal"}
        fullWidth
        InputLabelProps={{ shrink: true }}
        multiline
        rows="4"
        inputRef={register}
      />
      <Checkbox
        name={"is_active"}
        color={"primary"}
        defaultChecked
        inputRef={register}
      />
      Ativo?
      <Box dir={"rtl"}>
        <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>
          Salvar
        </Button>
        <Button {...buttonProps} type="submit">
          Salvar e continuar editando
        </Button>
      </Box>
    </form>
  );
};
