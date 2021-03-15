// @flow
import * as React from "react";
import { Box, Button, ButtonProps, Checkbox, makeStyles, TextField, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1)
    }
  }
});

export const Form = () => {
  const classes = useStyles();
  const buttonProps: ButtonProps = {
    className: classes.submit,
    variant: "outlined",
  }
  return (
    <form>
      <TextField
        name={"name"}
        label={"Nome"}
        variant={"outlined"}
        fullWidth
        InputLabelProps={{ shrink: true }}
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
      />
      <Checkbox
        name={"is_active"}
        color={"primary"}
      />
      Ativo?
      <Box dir={"rtl"}>
          <Button {...buttonProps}>Salvar</Button>
          <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
      </Box>
    </form>
  );
};
