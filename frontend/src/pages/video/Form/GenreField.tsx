// @flow
import * as React from 'react';
import AsyncAutoComplete, {AsyncAutoCompleteComponent} from "../../../components/AsyncAutoComplete";
import {FormControl, FormControlProps, FormHelperText, Grid, Typography} from "@material-ui/core";
import GridSelected from "../../../components/GridSelected";
import GridSelectedItem from "../../../components/GridSelectedItem";
import useHttpHandled from "../../../hooks/useHttpHandle";
import genreHttp from "../../../util/http/genre-http";
import CategoryField from "./CategoryField";
import useCollectionManager from "../../../hooks/useCollectionManager";
import {RefAttributes} from "react";
import {CastMemberFieldComponent} from "./CastMemberField";
import {useRef} from "react";
import {MutableRefObject} from "react";
import {useImperativeHandle} from "react";
import {getGenresFromCategory} from "../../../util/models-filters";

interface GenreFieldProps extends RefAttributes<GenreFieldComponent> {
    genres:any[],
    setGenres: (genres) => void
    categories:any[],
    setCategories: (categories) => void
    error:any
    disabled?:boolean,
    FormControlProps?:FormControlProps
};

export interface GenreFieldComponent {
    clear: () => void;

}
const GenreField = React.forwardRef<GenreFieldComponent,GenreFieldProps> ((props, ref) => {

    const {
        genres,
        setGenres,
        categories,
        setCategories,
        error,
        disabled} = props;
    const autocompleteHttp = useHttpHandled();
    const {addItem, removeItem} = useCollectionManager(genres, setGenres);
    const {removeItem: removeCategory} = useCollectionManager(categories, setCategories);

    const autocompleteRef = useRef() as MutableRefObject<AsyncAutoCompleteComponent>

    function fetchOptions(searchText) {

        return autocompleteHttp(

            genreHttp
                .list({
                    queryParams: {
                        search: searchText, all: ""
                    }
                })

        ).then(data  => data.data)
    }

    useImperativeHandle( ref, () => ({
        clear: () => autocompleteRef.current.clear()

    }));

    return (
        <>

            <AsyncAutoComplete
                ref={autocompleteRef}
                fetchOptions={fetchOptions}
                AutocompleteProps={{
                    //autoSelect:true,
                    clearOnEscape:true,
                    freeSolo: true,
                    getOptionLabel: option => option.name,
                    getOptionSelected: (option, value) => option.id === value.id,
                    onChange: (event, value) => addItem(value),
                    disabled
                }}
                TextFieldProps={{
                    label:'Gêneros',
                    error: error !== undefined
                }}/>
            <FormControl
                margin={"normal"}
                fullWidth
                error={error != undefined}
                disabled={disabled === true}
                {...props.FormControlProps}

            >

                <GridSelected>
                    {
                        genres.map( (genre,key) => (
                            <GridSelectedItem
                                key={key}
                                onDelete={() => {

                                    const categoriesWithOneGenre = categories
                                        .filter( category => {
                                            if(genres != undefined && genres.length > 0) {
                                                const genresFromCategory = getGenresFromCategory(genres, category);

                                                if(genresFromCategory != undefined && genres.length > 0) {
                                                    return genresFromCategory.length === 1 && genres[0].id == genre.id
                                                }

                                            }

                                        });

                                    if(categoriesWithOneGenre != undefined && categoriesWithOneGenre.length > 0) {
                                        categoriesWithOneGenre.forEach( cat => removeCategory(cat));
                                    }
                                    removeItem(genre)

                                }}
                                    xs={12}
                            >
                                <Typography noWrap={true}>
                                    {genre.name}
                                </Typography>
                            </GridSelectedItem>

                        ))
                    }
                </GridSelected>
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }

            </FormControl>



        </>


    );
});

export default GenreField;

