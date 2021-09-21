import dayjs from 'dayjs'
var utc = require('dayjs/plugin/utc') // dependent on utc plugin
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

export let mapObject = function (value, field) {
    if (!value || !value.length) {
        return '-'
    }
    field = field || 'name'
    return value.map(function (item) {
        return item[field]
    }).join(', ')
}

export let toPrice = function (value, digits, currency) {
    if (typeof currency === 'undefined') {
        currency = '$'
    }
    if (typeof digits === 'undefined') {
        digits = 0
    }
    if (typeof value === 'undefined' || value === null) {
        return '-'
    }
    return currency + parseFloat(value).toFixed(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export let truncate = function (value, length) {
    if (value.length < length) {
        return value
    }
    return value.substring(0, length) + '...'
}

export let dateFormat = function (value, format) {
    if (!value) {
        return '-'
    }
    return dayjs(value).format(format)
}

export let dateFormatLocal = function (value, format) {
    if (!value) {
        return '-'
    }
    return dayjs(value).format(format)
}

export let timeFormat = function (value, format) {
    if (!value) {
        return '-'
    }
    if (!format) {
        format = 'HH:mm'
    }
    return dayjs(value, 'HH:mm:ss').format(format)
}

// export let momentAgo = function (value) {
//     return moment(value).fromNow()
// }

export let ucfirst = function (value) {
    return value.charAt(0).toUpperCase() + value.slice(1)
}

export let percentage = function (value) {
    return parseFloat((value * 100).toFixed(1)) + '%'
}

export let beautify = function (value) {
    if (!value) {
        return value;
    }
    value = value.replace(/[_-]/g, ' ');
    value = value.toLowerCase()
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export let formatValue = function (value, currency, decimals) {
    decimals = decimals !== undefined ? decimals : 2
    if (typeof currency === 'undefined') {
        currency = '$'
    }
    if (typeof value === 'undefined' || value === null) {
        return '-'
    }
    value = parseFloat(value).toFixed(decimals).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    return currency + '' + value
}

export const getFundraiserColor = (percentate) => {
    if(percentate <= 33) {
        return '#ff6a6a';
    }
    if(percentate <= 66) {
        return '#6e89a7';
    }
    if(percentate <= 99) {
        return '#56d4fc';
    }
    if(percentate >= 100) {
        return '#4bdf77';
    }
}

export const compare = function (item1, item2) {
    return JSON.stringify(item1) === JSON.stringify(item2)
};

export function parse_query_string(query) {
    if (query.indexOf('?') > -1) {
        query = query.split('?')[1]
    }
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

export function addHttp(url){
    var prefix = 'https://';
    if (url.indexOf('://') === -1) {
        return prefix + url
    }
    return url
}
