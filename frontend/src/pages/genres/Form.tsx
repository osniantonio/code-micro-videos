// @flow
import * as React from "react";
import {
  Box,
  Button,
  ButtonProps,
  Checkbox,
  FormControlLabel,
  makeStyles,
  MenuItem,
  TextField,
  Theme,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Category, Genre } from "../../util/models";
import genreHttp from "../../util/http/genre-http";
import * as yup from "../../util/vendor/yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import categoryHttp from "../../util/http/category-http";
import { useSnackbar } from "notistack";
import SubmitActions from "../../components/SubmitActions";
import { DefaultForm } from "../../components/DefaultForm";
import useSnackbarFormError from "../../hooks/useSnackbarFormError";

const validationSchema = yup.object().shape({
  name: yup.string().label("Nome").required().max(255),
  categories_id: yup.array().label("Categorias").required().min(1),
});

export const Form = () => {
  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    watch,
    errors,
    reset,
    trigger,
    formState
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      categories_id: [],
      is_active: true,
    },
  });

  useSnackbarFormError(formState.submitCount, errors);
  const snackbar = useSnackbar();
  const history = useHistory();
  const [genre, setGenre] = useState<Genre | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { id }: any = useParams();
  const [loading, setLoading] = useState<boolean>(false);

  const hasErrorById = (error: any, id: string) => {
    return error[id] !== undefined;
  };

  const getErroMessageById = (error: any, id: string) => {
    return error[id] !== undefined && error[id].message !== undefined
      ? error[id].message
      : undefined;
  };

  useEffect(() => {
    register({ name: "categories_id" });
  }, [register]);

  useEffect(() => {
    register({ name: "is_active" });
  }, [register]);

  useEffect(() => {
    categoryHttp.list().then(({ data }) => setCategories(data.data));
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    (async () => {
      setLoading(true);
      const promises = [ categoryHttp.list({queryParams: {all: ''}})];

      if (id) {
        promises.push(genreHttp.get(id));
      }

      try {
        const [categoriesResponse, genreResponse] = await Promise.all(promises);

        if (isSubscribed) {
          setCategories(categoriesResponse.data.data);

          if (id) {
            setGenre(genreResponse.data.data);
            const categories_id = genreResponse.data.data.categories.map(
              (category) => category.id
            );
            reset({
              ...genreResponse.data.data,
              categories_id,
            });
          }
        }
      } catch (error) {
        snackbar.enqueueSnackbar("Nāo foi possível carregar as informações", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, []);

  async function onSubmit(formData, event) {
    try {
      setLoading(true);
      const http = !genre
        ? genreHttp.create(formData)
        : genreHttp.update(genre.id, formData);

      const { data } = await http;

      snackbar.enqueueSnackbar("Gênero salvo com sucesso", {
        variant: "success",
      });

      setTimeout(() => {
        event
          ? id
            ? history.replace(`/genres/${data.data.id}/edit`)
            : history.push(`/genres/${data.data.id}/edit`)
          : history.push("/genres");
      });
    } catch (error) {
      snackbar.enqueueSnackbar("Nāo foi possível salvar o Gênero", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <DefaultForm GridItemProps={{xs:12, md:6}} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name={"name"}
        label={"Nome"}
        variant={"outlined"}
        fullWidth
        InputLabelProps={{ shrink: true }}
        error={hasErrorById(errors, "name")}
        helperText={getErroMessageById(errors, "name")}
        disabled={loading}
        inputRef={register}
      />

      <TextField
        select
        name={"categories_id"}
        value={watch("categories_id")}
        label={"Categorias"}
        variant={"outlined"}
        margin={"normal"}
        fullWidth
        onChange={(e) => {
          setValue("categories_id", e.target.value);
        }}
        SelectProps={{
          multiple: true,
        }}
        disabled={loading}
        error={hasErrorById(errors, "categories_id")}
        helperText={getErroMessageById(errors, "categories_id")}
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
      <SubmitActions
        disabledButtons={loading}
        handleSave={() =>
          trigger().then((isValid) => {
            isValid && onSubmit(getValues(), null);
          })
        }
      />
    </DefaultForm>
  );
};
