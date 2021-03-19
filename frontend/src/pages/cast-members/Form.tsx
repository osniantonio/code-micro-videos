// @flow
import * as React from "react";
import {
  Box,
  Button,
  ButtonProps,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Theme,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import {useEffect, useState} from "react";
import { CastMember } from "../../util/models";
import castMemberHttp from "../../util/http/cast-member-http";

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
  const { id } : any = useParams();
  const [castMember, setCastMember] = useState<CastMember | null>(null);
  const buttonProps: ButtonProps = {
    className: classes.submit,
    variant: "outlined",
  };
  const { register, handleSubmit, getValues, setValue } = useForm();

  useEffect(() => {
    register({name: "type"})
  }, [register]);

  async function onSubmit(formData, event) {
    const http = !castMember
      ? castMemberHttp.create(formData)
      : castMemberHttp.update(castMember.id, formData);

    const { data } = await http;

    setTimeout(() => {
      event
        ? id
          ? history.replace(`/cast-members/${data.data.id}/edit`)
          : history.push(`/cast-members/${data.data.id}/edit`)
        : history.push("/cast-members");
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
      <FormControl margin={"normal"}>
        <FormLabel component="legend">Tipo</FormLabel>
        <RadioGroup
          name={"type"}
          onChange={(e) => {
            setValue('type', parseInt(e.target.value));
          }}
        >
          <FormControlLabel  value="1" control={<Radio color={"primary"} />} label="Diretor" />
          <FormControlLabel  value="2" control={<Radio color={"primary"} />} label="Ator" />
        </RadioGroup>
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
