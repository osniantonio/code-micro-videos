// @flow
import * as React from "react";
import { useEffect, useState } from "react";
import { MUIDataTableColumn } from "mui-datatables";
import { IconButton } from "@material-ui/core";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import categoryHttp from "../../util/http/category-http";
import { Category, ListResponse } from "../../util/models";
import { BadgeNo, BadgeYes } from "../../components/Badge";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
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
    width: '43%',
  },
  {
    name: "is_active",
    label: "Ativo?",
    width: '4%',
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
        const {data} = await categoryHttp.list<ListResponse<Category>>();
        if (isSubscribed) {
          setData(data.data);
        }
    })();

    return () => {
      isSubscribed = false;
    }
  }, []);
  return (
    <DefaultTable
      title="Listagem de categorias"
      columns={columnsDefinitions}
      data={data}
    />
  );
};
