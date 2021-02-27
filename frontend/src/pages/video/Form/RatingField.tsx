// @flow 
import * as React from 'react';
import {Box, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup} from "@material-ui/core";
import {FormControlLabelProps} from "@material-ui/core/FormControlLabel";
import Rating from "../../../components/Rating";
import {FormControlProps} from "@material-ui/core/FormControl";


interface RatingFieldProps {
    value:string;
    setValue: (value) => void;
    disabled?: boolean;
    error: any;
    FormControlProps?:FormControlProps

};

const ratings: FormControlLabelProps[] = [
    {value: 'L', control:<Radio color={"primary"}/>, label: <Rating rating={"L"} /> , labelPlacement: "top"},
    {value: '10', control:<Radio color={"primary"}/>, label: <Rating rating={"10"} /> , labelPlacement: "top"},
    {value: '12', control:<Radio color={"primary"}/>, label: <Rating rating={"12"} /> , labelPlacement: "top"},
    {value: '14', control:<Radio color={"primary"}/>, label: <Rating rating={"14"} /> , labelPlacement: "top"},
    {value: '16', control:<Radio color={"primary"}/>, label: <Rating rating={"16"} /> , labelPlacement: "top"},
    {value: '18', control:<Radio color={"primary"}/>, label: <Rating rating={"18"} /> , labelPlacement: "top"},

];
export const RatingField:React.FC<RatingFieldProps> = (props) => {
    const {value, setValue, disabled, error } = props;
    return (
        <FormControl
            error={error !== undefined}
            disabled={disabled === true}
            {...props.FormControlProps}
        >
            <FormLabel component={"legend"}>Classificaçāo</FormLabel>
            <Box paddingTop={1}>
                <RadioGroup
                    name="rating"
                    onChange={ (e) => {
                        setValue(  e.target.value);
                    }}
                    value={value}
                    row

                >

                    {
                        ratings.map(
                            (props: FormControlLabelProps, key:number) =>  <FormControlLabel key={key} {...props} />
                        )
                    }



                </RadioGroup>
            </Box>
            {
                error &&  <FormHelperText id="type-helper-text">{error.message}</FormHelperText>

            }
        </FormControl>
    );
};