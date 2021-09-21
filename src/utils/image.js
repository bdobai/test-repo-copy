import React from 'react'
import { baseurl } from '../config/settings'

const format = 'jpg';

export const getPlaceholder = ($params) => {
    let width = $params.width ? $params.width.toFixed(0) : '';
    let height = $params.height ? $params.height.toFixed(0) : '';
    return baseurl + '/media/placeholder' + '__w' + width + '_h' + height + ($params.bg ? '_b' . $size['bg'] : '') + '.' + format;
};

export const getImage = (image, width, height, contain, bg, overlay) => {
    let image_url = image;
    if (typeof image === "object") {
        if(image && typeof image.file !== "undefined") {
            image_url = image.file;
        }else{
            image_url = null;
        }
    }
    if (!image_url) {
        return getPlaceholder({
            width,
            height,
            bg,
        });
    }
    return computeImage({
        image_url,
        width,
        height,
        contain,
        bg,
        overlay,
    });
};

const computeImage = ($params) => {
    let width = $params.width !== undefined ? $params.width.toFixed(0) * 2 : '';
    let height = $params.height !== undefined ? $params.height.toFixed(0) * 2 : '';
    let contain = $params.contain !== undefined ? $params.contain : true;
    let filename = $params.image_url.split('.');
    let ext = filename.pop();

    let url = baseurl + filename + '__w' + width + '_h' + height + (contain ? '_c' : '') + ($params.bg ? '_b' . $params.bg : '') + ($params.overlay ? '_o' . $params.overlay : '') + '.' + format;
    return url;
}

