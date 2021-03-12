import * as React from 'react';
import {Page} from "../../components/Page";
import { useParams } from 'react-router';

const PageForm = () => {
    const parametros:any = useParams();
    return (
        <Page title={!parametros.id ? 'Criar membro de elenco' : 'Editar membro de elenco'}>
            <span>Formulário de cadastro do Membro da Equipe.</span>
        </Page>
    );
};

export default PageForm;