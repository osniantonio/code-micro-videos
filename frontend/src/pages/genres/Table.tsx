// @flow
import * as React from "react";
import { useEffect, useReducer, useRef, useState } from "react";
import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import { httpVideo } from "../../util/http";
import { Chip } from "@material-ui/core";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import { Category, Genre, ListResponse } from "../../util/models";
import { BadgeNo, BadgeYes } from "../../components/Badge";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import genreHttp from "../../util/http/genre-http";
import DefaultTable, {makeActionsStyles, MuiDataTableRefComponent, TableColumn} from "../../components/Table";

const columnsDefinitions: TableColumn[] = [
  {
    name: "id",
    label: "ID",
    width: '30%',
    options: {
      sort: false,
      filter: false,
    },
  },
  {
    name: "name",
    label: "Nome",
    width: '23%',
  },
  {
    name: "categories",
    label: "Categorias",
    width: '4%',
    options: {
      filterType: "multiselect",
      filterOptions: {
        names: [],
      },
      customBodyRender(value, tableMeta, updateValue) {
        return value.map((valor) => valor.name).join(",");
      },
    },
  },
  {
    name: "is_active",
    label: "Ativo?",
    width: '20%',
    options: {
      filterOptions: {
        names: ["Sim", "Nāo"],
      },
      customBodyRender(value, tableMeta, updateValue) {
        return value ? <BadgeYes /> : <BadgeNo />;
      },
    },
  },
  {
    name: "created_at",
    label: "Criado em",
    width: '10%',
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
    width: '13%',
    options: {
      sort: false,
      filter: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <IconButton
            color={"secondary"}
            component={Link}
            to={`/genres/${tableMeta.rowData[0]}/edit`}
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
  const [data, setData] = useState<Genre[]>([]);
  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      const { data } = await genreHttp.list<ListResponse<Genre>>();
      if (isSubscribed) {
        setData(data.data);
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, []);
  return (
    <DefaultTable
      title="Listagem de gêneros"
      columns={columnsDefinitions}
      data={data}
    />
  );
};
