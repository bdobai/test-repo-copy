export const emailValidator = {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Entered email is not valid"
}

export const zipCodeValidator = {
    value: /^[0-9]{5}(?:-[0-9]{4})?$/i,
    message: "Zipcode is not valid"
}

export const phoneValidator = {
    value: /^(?:\+971|00971|0)?(?:50|51|52|55|56|2|3|4|6|7|9)\d{7}$/i,
    message: "Phone is not a valid number"
}

export const cityValidator = {
    value: /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/i,
    message: "City is not valid"
}

export const creditCardValidator = {
    value: /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/i,
    message: "Credit card is not valid"
}

export const dayValidator = {
    value: /^(0?[1-9]|[12][0-9]|3[01])$/,
    message: "Invalid day"
}

export const monthValidator = {
    value: /^(0[1-9]|1[012])$/,
    message: "Invalid month"
}

export const yearValidator = {
    value: /^(181[2-9]|18[2-9]\d|19\d\d|2\d{3}|30[0-3]\d|304[0-8])$/,
    message: "Invalid year"
}

export const phoneNumberValidator = {
    value: /^[0-9]{9}$/,
    message: "Invalid phone number format"
};

export const birthdateValidator = {
    value: /^(0[1-9]|[12][0-9]|3[01])[-](0[1-9]|1[012])[-](19|20|21)\d\d$/,
    message: "Date format should be: DD-MM-YYYY"
};

export const requiredValidation = {
    value: true,
    message: "required"
};

export const capitalLetterValidator = text => {
    const expression = /[A-Z]/;
    return expression.test(text);
}
export const lowercaseLetterValidator = text => {
    const expression = /[a-z]/;
    return expression.test(text);
}

export const numberValidator = text => {
    const expression = /[0-9]/;
    return expression.test(text);
}

export const minCharactersValidator = text => {
    return text.length >= 6
}
