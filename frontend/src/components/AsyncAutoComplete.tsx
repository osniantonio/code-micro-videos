import * as React from "react";
import {
  Autocomplete,
  AutocompleteProps,
  UseAutocompleteSingleProps,
} from "@material-ui/lab";
import { TextFieldProps } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { RefAttributes, useContext, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useImperativeHandle } from "react";
import LoadingContext from "./loading/LoadingContext";

interface AsyncAutoCompleteProps
  extends RefAttributes<AsyncAutoCompleteComponent> {
  fetchOptions: (debouncedSearchText) => Promise<any>;
  debounceTime?: number;
  TextFieldProps?: TextFieldProps;
  AutocompleteProps?: Omit<AutocompleteProps<any>, "renderInput" | "options"> &
    Omit<UseAutocompleteSingleProps<any>, "renderInput" | "options">;
}

export interface AsyncAutoCompleteComponent {
  clear: () => void;
}

export const AsyncAutoComplete = React.forwardRef<
  AsyncAutoCompleteComponent,
  AsyncAutoCompleteProps
>((props, ref) => {
  const { AutocompleteProps, debounceTime = 300, fetchOptions } = props;
  const { freeSolo, onOpen, onClose, onInputChange } = AutocompleteProps as any;
  const [open, setOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText] = useDebounce<string>(searchText, debounceTime);
  const loading = useContext(LoadingContext);
  const [options, setOptions] = useState([]);

  const textFieldProps: TextFieldProps = {
    margin: "normal",
    variant: "outlined",
    fullWidth: true,
    InputLabelProps: { shrink: true },
    ...(props.TextFieldProps && { ...props.TextFieldProps }),
  };

  const autoCompleteProps: AutocompleteProps<any> = {
    loadingText: "Carregando...",
    noOptionsText: "Nenhum item encontrado",
    ...(AutocompleteProps && { ...AutocompleteProps }),
    open,
    options: options,
    loading: loading,
    onOpen() {
      setOpen(true);

      /** Chama funcao passada em props, caso exista*/
      onOpen && onOpen();
    },
    onClose() {
      setOpen(false);

      /** Chama funcao passada em props, caso exista*/
      onClose && onClose();
    },
    onInputChange(event, value) {
      setSearchText(value);

      /** Chama funcao passada em props, caso exista*/
      onInputChange && onInputChange();
    },
    renderInput: (params) => (
      <TextField
        {...params}
        {...textFieldProps}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {loading && <CircularProgress color={"inherit"} size={20} />}
              {params.InputProps.endAdornment}
            </React.Fragment>
          ),
        }}
      />
    ),
  };

  useEffect(() => {
    if (!open && !freeSolo) {
      setOptions([]);
    }
  }, [freeSolo, open]);

  useEffect(() => {
    /**
     * Se estiver fechado ou a busca for vazia e for freeSolo
     *
     * */
    if (!open) {
      return;
    }
    if (debouncedSearchText === "" && freeSolo) {
      return;
    }

    let isSubscribed = true;
    (async () => {
      try {
        const data = await fetchOptions(debouncedSearchText);
        if (isSubscribed) {
          setOptions(data);
        }
      } catch (e) {}
    })();

    return () => {
      isSubscribed = false;
    };
  }, [freeSolo, debouncedSearchText, open, fetchOptions]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setSearchText("");
      setOptions([]);
    },
  }));

  return <Autocomplete {...autoCompleteProps} />;
});
