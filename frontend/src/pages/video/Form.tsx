// @flow
import * as React from "react";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  makeStyles,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router";
import { Category, Video } from "../../util/models";
import { useState } from "react";
import * as yup from "../../util/vendor/yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import SubmitActions from "../../components/SubmitActions";
import { DefaultForm } from "../../components/DefaultForm";
import videoHttp from "../../util/http/video-http";

const validationSchema = yup.object().shape({
  title: yup.string().label("Título").required().max(255),
  description: yup.string().label("Sinopse").required(),
  year_launched: yup.number().label("Ano de lançamento").required().min(1),
  duration: yup.number().label("Duraçāo").required().min(1),
  rating: yup.string().label("Cassificaçāo").required(),
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
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      opened: true,
    },
  });

  const snackbar = useSnackbar();
  const history = useHistory();
  const { id }: any = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    (async function getVideo() {
      try {
        setLoading(true);
        const { data } = await videoHttp.get(id);
        setVideo(data.data);
        reset(data.data);
      } catch (error) {
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
      const http = !video
        ? videoHttp.create(formData)
        : videoHttp.update(video.id, formData);

      const { data } = await http;

      snackbar.enqueueSnackbar("Video salvo com sucesso", {
        variant: "success",
      });

      setTimeout(() => {
        event
          ? id
            ? history.replace(`/videos/${data.data.id}/edit`)
            : history.push(`/videos/${data.data.id}/edit`)
          : history.push("/videos");
      });
      setLoading(false);
    } catch (error) {
      snackbar.enqueueSnackbar("Nāo foi possível salvar o video", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <DefaultForm GridItemProps={{ xs: 12 }} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <TextField
            name={"title"}
            label={"Título"}
            fullWidth
            variant={"outlined"}
            inputRef={register}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            error={errors["title"] !== undefined}
            helperText={
              errors["title"] !== undefined && errors["title"].message
            }
          />
          <TextField
            name={"description"}
            label={"Sinopse"}
            multiline
            rows="4"
            margin="normal"
            variant={"outlined"}
            fullWidth
            inputRef={register}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            error={errors["description"] !== undefined}
            helperText={
              errors["description"] !== undefined &&
              errors["description"].message
            }
          />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                name={"year_launched"}
                label={"Ano de lançamento"}
                type={"number"}
                margin="normal"
                variant={"outlined"}
                fullWidth
                inputRef={register}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                error={errors["year_launched"] !== undefined}
                helperText={
                  errors["year_launched"] !== undefined &&
                  errors["year_launched"].message
                }
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                name={"duration"}
                label={"Duraçāo"}
                type={"number"}
                margin="normal"
                variant={"outlined"}
                fullWidth
                inputRef={register}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                error={errors["duration"] !== undefined}
                helperText={
                  errors["duration"] !== undefined && errors["duration"].message
                }
              />
            </Grid>
          </Grid>
          Elenco
          <br />
          Gêneros e categorias
        </Grid>

        <Grid item xs={12} md={6}>
          Classificação
          <br />
          Uploads
          <br />
          <FormControlLabel
            control={
              <Checkbox
                name="opened"
                color={"primary"}
                onChange={() => setValue("opened", !getValues()["opened"])}
              />
            }
            label={
              <Typography color="primary" variant={'subtitle2'}>
                Quero que este conteúdo apareça na seção lançamentos
              </Typography>
            }
            labelPlacement="end"
          />
        </Grid>
      </Grid>

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
