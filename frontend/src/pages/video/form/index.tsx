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
import { Category, Video, VideoFileFieldsMap } from "../../../util/models";
import * as yup from "../../../util/vendor/yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createRef,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSnackbar } from "notistack";
import SubmitActions from "../../../components/SubmitActions";
import { DefaultForm } from "../../../components/DefaultForm";
import videoHttp from "../../../util/http/video-http";
import Rating from "../../../components/Rating";
import { omit, zipObject } from "lodash";
import InputFile, { InputFileComponent } from "../../../components/InputFile";
import { RatingField } from "./RatingField";
import { UploadField } from "./UploadField";
import CastMemberField, { CastMemberFieldComponent } from "./CastMemberField";
import GenreField, { GenreFieldComponent } from "./GenreField";
import CategoryField, { CategoryFieldComponent } from "./CategoryField";

const useStyles = makeStyles((theme: Theme) => ({
  cardUpload: {
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    margin: theme.spacing(2, 0),
  },
  cardOpened: {
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
  },
  cardContentOpened: {
    paddingBottom: theme.spacing(2) + "px !important",
  },
}));

const validationSchema = yup.object().shape({
  title: yup.string().label("Título").required().max(255),
  description: yup.string().label("Sinopse").required(),
  year_launched: yup.number().label("Ano de lançamento").required().min(1),
  duration: yup.number().label("Duraçāo").required().min(1),
  rating: yup.string().label("Cassificaçāo").required(),
});

const fileFields = Object.keys(VideoFileFieldsMap);

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
      rating: null,
      cast_members: [],
      genres: [],
      categories: [],
      opened: false,
    },
  });

  const classes = useStyles();
  const snackbar = useSnackbar();
  const history = useHistory();
  const { id }: any = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isGreaterMd = useMediaQuery(theme.breakpoints.up("md"));
  const castMemberRef = useRef() as MutableRefObject<CastMemberFieldComponent>;
    const genreRef = useRef() as MutableRefObject<GenreFieldComponent>;
    const categoryRef = useRef() as MutableRefObject<CategoryFieldComponent>;

  const uploadRef = useRef(
    zipObject(
      fileFields,
      fileFields.map(() => createRef())
    )
  ) as MutableRefObject<{
    [key: string]: MutableRefObject<InputFileComponent>;
  }>;

  useEffect(() => {
    [
      "rating",
      "opened",
      "genres",
      "categories",
      "cast_members",
      ...fileFields,
    ].forEach((name) => register({ name }));
  }, [register]);

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

          <CastMemberField
              ref={castMemberRef}
              castMembers={watch('cast_members')}
              setCastMembers={(value) => setValue('cast_members', value)}
              error={errors.cast_members}
              disabled={loading}
          />
          <Grid container spacing={2}>
              <Grid item xs={6} md={6}>
                  <GenreField
                      ref={genreRef}
                        genres={watch('genres')}
                        setGenres={(value) => setValue('genres', value)}
                        categories={watch('categories')}
                        setCategories={(value) => setValue('categories', value)}
                        error={errors.genres}
                        disabled={loading}
                  />
              </Grid>
              <Grid item xs={6} md={6}>
                  <CategoryField
                      ref={categoryRef}
                      categories={watch('categories')}
                      setCategories={(value) => setValue('categories', value)}
                      genres={watch('genres')}
                      error={errors.categories}
                      disabled={loading}
                  />
              </Grid>
          </Grid>
          <Grid item xs={12} >
              <FormHelperText>
                  Escolha os gêneros dos videos
              </FormHelperText>
              <FormHelperText>
                  Escolha pelo menos uma categoria de cada gênero
              </FormHelperText>
          </Grid>

        </Grid>

        <Grid item xs={12} md={6}>
          <RatingField
            value={watch("rating")}
            setValue={(value: any) => setValue("rating", value)}
            error={errors.rating}
            disabled={loading}
            FormControlProps={{
              margin: isGreaterMd ? "none" : "normal",
            }}
          />
          <br />
          <Card className={classes.cardUpload}>
            <CardContent>
              <Typography color="primary" variant="h6">
                Imagens
              </Typography>
              <UploadField
                ref={uploadRef.current["thumb_file"]}
                accept={"image/*"}
                label={"Thumb"}
                setValue={(value) => setValue("thumb_file", value)}
              />
              <UploadField
                ref={uploadRef.current["banner_file"]}
                accept={"image/*"}
                label={"Banner"}
                setValue={(value) => setValue("banner_file", value)}
              />
            </CardContent>
          </Card>
          <Card className={classes.cardUpload}>
            <CardContent>
              <Typography color="primary" variant="h6">
                Videos
              </Typography>
              <UploadField
                ref={uploadRef.current["trailer_file"]}
                accept={"video/mp4"}
                label={"Trailer"}
                setValue={(value) => setValue("trailer_file", value)}
              />
              <UploadField
                ref={uploadRef.current["video_file"]}
                accept={"video/mp4"}
                label={"Principal"}
                setValue={(value) => setValue("video_file", value)}
              />
            </CardContent>
          </Card>
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
              <Typography color="primary" variant={"subtitle2"}>
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
