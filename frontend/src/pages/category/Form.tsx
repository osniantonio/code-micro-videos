// @flow
import * as React from "react";
import {
  Box,
  Button,
  ButtonProps,
  Checkbox,
  FormControlLabel,
  makeStyles,
  TextField,
  Theme,
} from "@material-ui/core";
import categoryHttp from "../../util/http/category-http";
import { useHistory, useParams } from "react-router";
import { Category } from "../../util/models";
import { useState } from "react";
import * as yup from "../../util/vendor/yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useSnackbar } from "notistack";

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
  
  const snackbar = useSnackbar();
  const history = useHistory();
  const classes = useStyles();
  const { id }: any = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: "secondary",
    variant: "contained",
    disabled: loading,
  };  

  useEffect(() => {
    register({ name: "is_active" });
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }    
    (async function getCategory() {
      try {
        setLoading(true);
        const { data } = await categoryHttp.get(id);
        setCategory(data.data);
        reset(data.data);
      } catch (error) {
        console.log(error);
        snackbar.enqueueSnackbar("Nāo foi possível carregar as informações", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSubmit(formData, event) {
    try {
      setLoading(true);
      const http = !category
        ? categoryHttp.create(formData)
        : categoryHttp.update(category.id, formData);

      const { data } = await http;

      snackbar.enqueueSnackbar("Categoria salva com sucesso", {
        variant: "success",
      });

      setTimeout(() => {
        event
          ? id
            ? history.replace(`/categories/${data.data.id}/edit`)
            : history.push(`/categories/${data.data.id}/edit`)
          : history.push("/categories");
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar("Nāo foi possível salvar a categoria", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name={"name"}
        label={"Nome"}
        variant={"outlined"}
        fullWidth
        InputLabelProps={{ shrink: true }}
        error={errors["name"] !== undefined}
        helperText={errors["name"] !== undefined && errors["name"].message}
        disabled={loading}
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
        disabled={loading}
        inputRef={register}
      />
      <FormControlLabel
        disabled={loading}
        control={
          <Checkbox
            name={"is_active"}
            color={"primary"}
            onChange={() => setValue("is_active", !getValues()["is_active"])}
            checked={watch("is_active")}
          />
        }
        label={"Ativo?"}
        labelPlacement={"end"}
      />
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
