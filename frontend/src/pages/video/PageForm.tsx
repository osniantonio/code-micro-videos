import Form from "./form";
import { useParams } from 'react-router-dom';
import {Page} from "../../components/Page";

const PageForm = () => {
    const { id }: any = useParams();
    return (
        <Page title={!id ? "Criar vídeo" : "Editar vídeo"}>
            <Form />
        </Page>
    );
};

export default PageForm;