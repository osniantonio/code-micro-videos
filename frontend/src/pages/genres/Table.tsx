// @flow
import * as React from "react";
import { useEffect, useReducer, useRef, useState } from "react";
import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import { httpVideo } from "../../util/http";
import { Chip } from "@material-ui/core";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import { Category, Genre } from "../../util/models";
import { BadgeNo, BadgeYes } from "../../components/Badge";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import genreHttp from "../../util/http/genre-http";

const columnsDefinitions: MUIDataTableColumn[] = [
  {
    name: "id",
    label: "ID",
    options: {
      sort: false,
      filter: false,
    },
  },
  {
    name: "name",
    label: "Nome",
  },
  {
    name: "categories",
    label: "Categorias",
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
    genreHttp.list<{ data: Genre[] }>().then(({ data }) => setData(data.data));
  }, []);
  return (
    <MUIDataTable
      title="Listagem de gêneros"
      columns={columnsDefinitions}
      data={data}
    />
  );
};
