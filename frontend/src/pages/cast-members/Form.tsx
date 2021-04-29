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
import SubmitActions from "../../components/SubmitActions";
import { DefaultForm } from "../../components/DefaultForm";

const validationSchema = yup.object().shape({
  name: yup.string().label("Nome").required().max(255),
  type: yup.number().label("Tipo").required(),
});

export const Form = () => {
  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    errors,
    reset,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const snackbar = useSnackbar();
  const history = useHistory();
  const { id }: any = useParams();
  const [castMember, setCastMember] = useState<CastMember | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    register({ name: "type" });
  }, [register]);

  useEffect(() => {
    if (!id) {
      return;
    }
    (async function getCastMember() {
      try {
        setLoading(true);
        const { data } = await castMemberHttp.get(id);
        setCastMember(data.data);
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
    <DefaultForm GridItemProps={{xs:12, md:6}} onSubmit={handleSubmit(onSubmit)}>
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
