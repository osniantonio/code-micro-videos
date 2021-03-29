// @flow
import * as React from "react";
import { useEffect, useReducer, useRef, useState } from "react";
import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import { httpVideo } from "../../util/http";
import { Chip } from "@material-ui/core";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import { Category } from "../../util/models";
import { BadgeNo, BadgeYes } from "../../components/Badge";

const columnsDefinitions: MUIDataTableColumn[] = [
  {
    name: "name",
    label: "Nome",
  },
  {
    name: "categories",
    label: "Categorias",
    options: {
      customBodyRender(value, tableMeta, updateValue) {
        return value.map((category: Category) => category.name).join(", ");
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
];
const data = [];
type Props = {};
export const Table = (props: Props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    httpVideo.get("genres").then((response) => setData(response.data.data));
  }, []);
  return (
    <MUIDataTable
      title="Listagem de gêneros"
      columns={columnsDefinitions}
      data={data}
    />
  );
};
