import {RouteProps} from 'react-router-dom';
import CategoryList from '../pages/category/PageList';
import CategoryForm from '../pages/category/PageForm';
import CastMemberList from '../pages/cast-members/PageList';
import CastMemberForm from '../pages/cast-members/PageForm';
import GenreList from '../pages/genres/PageList';
import GenreForm from '../pages/genres/PageForm';
import VideoList from '../pages/video/PageList';
import VideoForm from '../pages/video/PageForm';
import Dashboard from '../pages/Dashboard';
import UploadPage from "../pages/uploads";

export interface MyRouteProps extends RouteProps {
    name: string;
    label: string;
}

const routes: MyRouteProps[] = [
    {
        name: 'dashboard',
        label: 'Dashboard',
        path: '/',
        component: Dashboard,
        exact: true
    },
    {
        name: 'categories.list',
        label: 'Categorias',
        path: '/categories',
        component: CategoryList,
        exact: true
    },
    {
        name: 'categories.create',
        label: 'Criar categoria',
        path: '/categories/create',
        component: CategoryForm,
        exact: true
    },
    {
        name: 'categories.edit',
        label: 'Editar categoria',
        path: '/categories/:id/edit',
        component: CategoryForm,
        exact: true
    },
    {
        name: 'cast_members.list',
        label: 'Membros de elencos',
        path: '/cast-members',
        component: CastMemberList,
        exact: true
    },
    {
        name: 'cast_members.create',
        label: 'Criar membro de elenco',
        path: '/cast-members/create',
        component: CastMemberForm,
        exact: true
    },
    {
        name: 'cast_members.edit',
        label: 'Editar membros de elencos',
        path: '/cast-members/:id/edit',
        component: CastMemberForm,
        exact: true
    },
    {
        name: 'genres.list',
        label: 'Gêneros',
        path: '/genres',
        component: GenreList,
        exact: true
    },
    {
        name: 'genres.create',
        label: 'Criar gênero',
        path: '/genres/create',
        component: GenreForm,
        exact: true
    },
    {
        name: 'genres.edit',
        label: 'Editar gêneros',
        path: '/genres/:id/edit',
        component: GenreForm,
        exact: true
    },
    {
        name: 'videos.list',
        label: 'Videos',
        path: '/videos',
        component: VideoList,
        exact: true
    },
    {
        name: 'videos.create',
        label: 'Criar videos',
        path: '/videos/create',
        component: VideoForm,
        exact: true
    },
    {
        name: 'videos.edit',
        label: 'Editar videos',
        path: '/videos/:id/edit',
        component: VideoForm,
        exact: true
    },
    {
        name: 'uploads',
        label: 'Uploads',
        path: '/uploads',
        component: UploadPage,
        exact: true
    }
];
export default routes;
