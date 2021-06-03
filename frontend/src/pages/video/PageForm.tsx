import * as React from 'react';
import {Page} from "../../components/Page";
import { useParams } from 'react-router';
import { Form } from './form';

const PageForm = () => {
    const id = useParams();
    return (
        <Page title={!id ? 'Criar videos' : 'Editar videos'}>
            <Form />
        </Page>
    );
};

export default PageForm;