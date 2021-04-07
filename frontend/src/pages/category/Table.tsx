// @flow
import * as React from "react";
import { useEffect, useState } from "react";
import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import { IconButton } from "@material-ui/core";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import categoryHttp from "../../util/http/category-http";
import { Category } from "../../util/models";
import { BadgeNo, BadgeYes } from "../../components/Badge";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";

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
            to={`/categories/${tableMeta.rowData[0]}/edit`}
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
  const [data, setData] = useState<Category[]>([]);
  useEffect(() => {
    let isSubscribed = true;
    (async () => {
        const {data} = await categoryHttp.list();
        if (isSubscribed) {
          setData(data.data);
        }
    })();

    return () => {
      isSubscribed = false;
    }
  }, []);
  return (
    <MUIDataTable
      title="Listagem de categorias"
      columns={columnsDefinitions}
      data={data}
    />
  );
};
