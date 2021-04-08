// @flow
import * as React from "react";
import { useEffect, useReducer, useRef, useState } from "react";
import MUIDataTable, { MUIDataTableColumn } from "mui-datatables";
import { httpVideo } from "../../util/http";
import { Chip, IconButton } from "@material-ui/core";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import { CastMember, CastMemberTypeMap, ListResponse } from "../../util/models";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import castMemberHttp from "../../util/http/cast-member-http";

const castMemberNames = Object.values(CastMemberTypeMap);

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
    name: "type",
    label: "Tipo",
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
  const [data, setData] = useState<CastMember[]>([]);
  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      const { data } = await castMemberHttp.list<ListResponse<CastMember>>();
      if (isSubscribed) {
        setData(data.data);
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, []);
  return (
    <MUIDataTable
      title="Listagem de membros"
      columns={columnsDefinitions}
      data={data}
    />
  );
};
