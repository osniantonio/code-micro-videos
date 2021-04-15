// @flow
import * as React from "react";
import { useEffect, useReducer, useRef, useState } from "react";
import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import { httpVideo } from "../../util/http";
import { Chip, IconButton, MuiThemeProvider } from "@material-ui/core";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import { CastMember, CastMemberTypeMap, ListResponse } from "../../util/models";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import castMemberHttp from "../../util/http/cast-member-http";
import DefaultTable, {
  makeActionsStyles,
  MuiDataTableRefComponent,
  TableColumn,
} from "../../components/Table";
import { useSnackbar } from "notistack";

const castMemberNames = Object.values(CastMemberTypeMap);

const columnsDefinitions: TableColumn[] = [
  {
    name: "id",
    label: "ID",
    width: "30%",
    options: {
      sort: false,
      filter: false,
    },
  },
  {
    name: "name",
    label: "Nome",
    width: "43%",
  },
  {
    name: "type",
    label: "Tipo",
    width: "4%",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return CastMemberTypeMap[value];
      },
      filterOptions: {
        names: castMemberNames,
      },
    },
  },
  {
    name: "created_at",
    label: "Criado em",
    width: "10%",
    options: {
      filter: false,
      customBodyRender(value, tableMeta, updateValue) {
        return <span> {format(parseISO(value), "dd/MM/yyyy")} </span>;
      },
    },
  },
  {
    name: "actions",
    label: "Ações",
    width: "13%",
    options: {
      sort: false,
      filter: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <IconButton
            color={"secondary"}
            component={Link}
            to={`/cast-members/${tableMeta.rowData[0]}/edit`}
          >
            <EditIcon />
          </IconButton>
        );
      },
    },
  },
];

type Props = {};
export const Table = (props: Props) => {
  const snackbar = useSnackbar();
  const [data, setData] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await castMemberHttp.list<ListResponse<CastMember>>();
        if (isSubscribed) {
          setData(data.data);
        }
      } catch (error) {
        console.log(error);
        snackbar.enqueueSnackbar("Nāo foi possível carregar as informaçoes", {
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
  return (
    <MuiThemeProvider theme={makeActionsStyles(columnsDefinitions.length -1)}>
      <DefaultTable
        title="Listagem de membros"
        columns={columnsDefinitions}
        data={data}
        loading={loading}
      />
    </MuiThemeProvider>
  );
};
