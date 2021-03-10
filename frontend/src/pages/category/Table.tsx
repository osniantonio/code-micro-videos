// @flow
import * as React from 'react';
import {useEffect, useReducer, useRef, useState} from "react";
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import { httpVideo } from '../../util/http';

const columnsDefinitions:MUIDataTableColumn[] = [
    {
        name: "id",
        label: "ID",
    },
    {
        name: "name",
        label: "Nome",
    },
    {
        name: "is_active",
        label: "Ativo?",
    },
    {
        name: "created_at",
        label: "Criado em",
    },
];
const data = [
    {id: 1, name: "Teste 1", is_active: true, created_at: "2019-12-10"},
    {id: 2, name: "Teste 2", is_active: true, created_at: "2019-12-11"},
    {id: 3, name: "Teste 3", is_active: true, created_at: "2019-12-12"},
    {id: 4, name: "Teste 4", is_active: true, created_at: "2019-12-13"},
    {id: 5, name: "Teste 5", is_active: true, created_at: "2019-12-14"},
];
type Props = {};
export const Table = (props: Props) => {

    const [data, setData] = useState([]);
    useEffect( () => {
        console.log('qualquer coisa...');
        httpVideo.get('categories').then(
            response => setData(response.data.data)
        );
    }, []);
    return (
        <MUIDataTable 
            title="Listagem de categorias"
            columns={columnsDefinitions} 
            data={data}
        />
    );
};