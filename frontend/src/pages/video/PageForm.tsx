import * as React from 'react';
import {Page} from "../../components/Page";
import {Form} from "./Form/index";
import { useParams } from 'react-router';


const PageForm = () => {

    const id = useParams();
    return (

        <Page title={!id ? 'Criar Videos' : 'Editar videos'}>

            <Form/>

        </Page>

    );
};

export default PageForm;