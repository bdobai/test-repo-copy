import {
    capitalLetterValidator,
    lowercaseLetterValidator,
    minCharactersValidator,
    numberValidator,
} from "_utils/validators";

export const passwordValidators = [
    {label: 'A Capital Letter', validator: capitalLetterValidator},
    {label: 'A Lowercase Letter', validator: lowercaseLetterValidator},
    {label: 'A Number', validator: numberValidator},
    {label: 'At Least Six Characters', validator: minCharactersValidator},
]

export const genders = [{label:'Male', value:'male'}, {label:'Female', value:'female'}]
