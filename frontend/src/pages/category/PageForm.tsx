import * as React from 'react';
import {Page} from "../../components/Page";
import { useParams } from 'react-router';

const PageForm = () => {
    const parametros:any = useParams();
    return (
        <Page title={!parametros.id ? 'Criar Categoria' : 'Editar Categoria'}>
            <span>Formulário de cadastro da Categoria.</span>
        </Page>
    );
};

export default PageForm;