import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardActions,
  Collapse,
  IconButton,
  List,
  Theme,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { Upload } from "../../store/upload/types";
import { countInProgress } from "../../store/upload/getters";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    width: 450,
  },
  cardActionRoot: {
    padding: "8px 8px 8px 16px",
    backgroundColor: theme.palette.primary.main,
  },
  title: {
    fontWeight: "bold",
    color: theme.palette.primary.contrastText,
  },
  icons: {
    marginLeft: "auto !important",
    color: theme.palette.primary.contrastText,
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

interface SnackbarUploadProps {
  id: string | number;
}

const SnackbarUpload = React.forwardRef<any, SnackbarUploadProps>(
  (props, ref) => {
    const { id } = props;
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState<boolean>(true);

    return (
      <Card ref={ref} className={classes.card}>
        <CardActions classes={{ root: classes.cardActionRoot }}>
          <Typography variant={"subtitle2"} className={classes.title}>
            Fazendo o upload de - totalInProgress - vídeo(s)
          </Typography>
          <div className={classes.icons}>
            <IconButton
              color={"inherit"}
              onClick={() => setExpanded(!expanded)}
            >
              <ExpandMoreIcon
                className={classNames(classes.expand, {
                  [classes.expandOpen]: !expanded,
                })}
              />
            </IconButton>
            <IconButton color={"inherit"} onClick={() => closeSnackbar(id)}>
              <CloseIcon />
            </IconButton>
          </div>
        </CardActions>
        <Collapse in={expanded}>
          <List className={classes.list}>Items</List>
        </Collapse>
      </Card>
    );
  }
);

export default SnackbarUpload;
