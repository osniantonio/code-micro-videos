import * as React from 'react';
import {Page} from "../../components/Page";
import { useParams } from 'react-router';

const PageForm = () => {
    const parametros:any = useParams();
    return (
        <Page title={!parametros.id ? 'Criar Gênero' : 'Editar Gênero'}>
            <span>Formulário de cadastro de Gênero.</span>
        </Page>
    );
};

export default PageForm;