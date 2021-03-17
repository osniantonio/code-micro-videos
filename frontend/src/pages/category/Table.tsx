// @flow
import * as React from "react";
import { useEffect, useReducer, useRef, useState } from "react";
import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import { httpVideo } from "../../util/http";
import { Chip } from "@material-ui/core";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import categoryHttp from "../../util/http/category-http";
import { Category } from "../../util/models";

const columnsDefinitions: MUIDataTableColumn[] = [
  {
    name: "name",
    label: "Nome",
  },
  {
    name: "is_active",
    label: "Ativo?",
    options: {
      filterOptions: {
        names: ["Sim", "Nāo"],
      },
      customBodyRender(value, tableMeta, updateValue) {
        return value ? (
          <Chip label="Sim" color="primary" />
        ) : (
          <Chip label="Não" color="secondary" />
        );
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

type Props = {};

export const Table = (props: Props) => {
  const [data, setData] = useState<Category[]>([]);
  useEffect(() => {
    categoryHttp
      .list<{data: Category[]}>()
      .then(({ data }) => setData(data.data));
  }, []);
  return (
    <MUIDataTable
      title="Listagem de categorias"
      columns={columnsDefinitions}
      data={data}
    />
  );
};
