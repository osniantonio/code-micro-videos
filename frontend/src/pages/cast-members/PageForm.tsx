import * as React from 'react';
import {Page} from "../../components/Page";
import { useParams } from 'react-router';
import { Form } from './Form';

const PageForm = () => {
    const parametros:any = useParams();
    return (
        <Page title={!parametros.id ? 'Criar membro de elenco' : 'Editar membro de elenco'}>
            <Form />
        </Page>
    );
};

export default PageForm;