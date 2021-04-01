// @flow
import * as React from "react";
import {
  Box,
  Button,
  ButtonProps,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Theme,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { useEffect, useState } from "react";
import { CastMember } from "../../util/models";
import castMemberHttp from "../../util/http/cast-member-http";
import * as yup from "../../util/vendor/yup";
import { yupResolver } from "@hookform/resolvers/yup";
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
  type: yup.number().label("Tipo").required(),
});

export const Form = () => {
  const snackbar = useSnackbar();
  const history = useHistory();
  const classes = useStyles();
  const { id }: any = useParams();
  const [castMember, setCastMember] = useState<CastMember | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: "secondary",
    variant: "contained",
    disabled: loading,
  };

  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    errors,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    register({ name: "type" });
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }
    async function getCastMember() {
      try {
        const { data } = await castMemberHttp.get(id);
        setCastMember(data.data);
        reset(data.data);
      } catch (error) {
        console.log(error);
        snackbar.enqueueSnackbar("Nāo foi possível carregar as informaçoes", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    getCastMember();
  }, []);

  async function onSubmit(formData, event) {
    try {
      setLoading(true);
      const http = !castMember
        ? castMemberHttp.create(formData)
        : castMemberHttp.update(castMember.id, formData);

      const { data } = await http;

      snackbar.enqueueSnackbar("Membro de elenco salvo com sucesso", {
        variant: "success",
      });

      setTimeout(() => {
        event
          ? id
            ? history.replace(`/cast-members/${data.data.id}/edit`)
            : history.push(`/cast-members/${data.data.id}/edit`)
          : history.push("/cast-members");
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      snackbar.enqueueSnackbar("Nāo foi possível salvar o Membro de elenco", {
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
      <FormControl
        margin={"normal"}
        error={errors.type !== undefined}
        disabled={loading}
      >
        <FormLabel component={"legend"}>Tipo</FormLabel>
        <RadioGroup
          name={"type"}
          onChange={(e) => {
            setValue("type", parseInt(e.target.value));
          }}
          value={watch("type") + ""}
        >
          <FormControlLabel
            value="1"
            control={<Radio color={"primary"} />}
            label="Diretor"
          />
          <FormControlLabel
            value="2"
            control={<Radio color={"primary"} />}
            label="Ator"
          />
        </RadioGroup>
        {errors.type && (
          <FormHelperText id="type-helper-text">
            {errors.type.message}
          </FormHelperText>
        )}
      </FormControl>
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
