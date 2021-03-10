// @flow
import * as React from 'react';
import {useEffect, useReducer, useRef, useState} from "react";
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { httpVideo } from '../../util/http';
import { Chip } from '@material-ui/core';
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import { CastMemberTypeMap} from "../../util/models";

const castMemberNames = Object.values(CastMemberTypeMap);

const columnsDefinitions:MUIDataTableColumn[] = [
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
                names: castMemberNames
            },
        }
    },
    {
        name: "created_at",
        label: "Criado em",
        options: {
            filter: false,
            customBodyRender(value, tableMeta, updateValue) {
                return <span> { format(parseISO(value), 'dd/MM/yyyy') } </span>
            }
        }
    },
];
const data = [];
type Props = {};
export const Table = (props: Props) => {
    const [data, setData] = useState([]);
    useEffect( () => {
        httpVideo.get('cast_members').then(
            response => setData(response.data.data)
        );
    }, []);
    return (
        <MUIDataTable 
            title="Listagem de membros"
            columns={columnsDefinitions} 
            data={data}
        />
    );
};