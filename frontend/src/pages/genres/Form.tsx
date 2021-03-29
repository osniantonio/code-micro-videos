// @flow
import * as React from "react";
import {
  Box,
  Button,
  ButtonProps,
  Checkbox,
  makeStyles,
  MenuItem,
  TextField,
  Theme,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Category, Genre } from "../../util/models";
import genreHttp from "../../util/http/genre-http";
import categoryHttp from "../../util/http/category-http";

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

export const Form = () => {
  const history = useHistory();
  const classes = useStyles();

  const { register, handleSubmit, getValues, setValue, watch } = useForm({
    defaultValues: {
      categories_id: []
   }
  });

  const { id }: any = useParams();
  const [genre, setGenre] = useState<Genre | null>(null);
  const [ categories, setCategories] = useState<Category[]>([]);
  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: "secondary",
    variant: "contained",
  };

  useEffect(() => {
    register({name: "categories_id"})
  }, [register]);

  useEffect(() => {
    categoryHttp
      .list()
      .then(({data}) => setCategories(data.data))
  }, []);

  async function onSubmit(formData, event) {
    const http = !genre
      ? genreHttp.create(formData)
      : genreHttp.update(genre.id, formData);

    const { data } = await http;

    setTimeout(() => {
      event
        ? id
          ? history.replace(`/genres/${data.data.id}/edit`)
          : history.push(`/genres/${data.data.id}/edit`)
        : history.push("/genres");
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
        inputRef={register}
      />

    <Checkbox
        name={"is_active"}
        color={"primary"}
        inputRef={register}
        defaultChecked
      />
      Ativo?

      <TextField
        select
        name={"categories_id"}
        value={watch("categories_id")}
        label={"Categorias"}
        variant={"outlined"}
        margin={"normal"}
        fullWidth
        onChange={(e) => {
          setValue('categories_id', e.target.value);
        }}
        SelectProps={{
          multiple: true,
        }}
        InputLabelProps={{ shrink: true }}
      >
        <MenuItem value="" disabled>
          <em>Selecione categorias</em>
        </MenuItem>

        {categories.map((category, key) => (
          <MenuItem key={key} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>

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
