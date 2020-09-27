import { ImageCallback } from '@jimp/core';
import { isNodePattern } from "@jimp/utils";
import Jimp from 'jimp'
import fs from 'fs'

export async function roundCornersFromPath(
    inImgPath: string,
    options?: {
        outImgPath?: string,
        cornerRadius?: {
            topLeft?: number,
            topRight?: number,
            bottomRight?: number,
            bottomLeft?: number,
            global?: number
        }
    }
) {
    return new Promise<{
        img: Jimp,
        path?: string
    }>((resolve, reject) => {
        Jimp.read(inImgPath)
        .then(inImg => {
            const img = roundCorners(inImg, options && options.cornerRadius ? { cornerRadius: options.cornerRadius } : null)

            if (options.outImgPath) img.write(options.outImgPath)

            resolve({
                img: img,
                path: (options.outImgPath && fs.existsSync(options.outImgPath)) ? options.outImgPath : null
            })
        })
        .catch(err => reject(err))
    })

/**
 * Rounds the corners of an image
 * @param {function(Error, Jimp)} options (optional) cornerRadius
 * @param {function(Error, Jimp)} cb (optional) a callback for when complete
 * @returns {Jimp} this for chaining of methods
 */
export function roundCorners(
    img: Jimp,
    options?: {
        cornerRadius?: {
            topLeft?: number,
            topRight?: number,
            bottomRight?: number,
            bottomLeft?: number,
            global?: number
        }
    },
    cb?: ImageCallback<Jimp>
): Jimp {
    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
      
    const _defaultRadius = Math.min(img.bitmap.width, img.bitmap.height) / 10;
    options.cornerRadius = options.cornerRadius ?? { global: _defaultRadius };
    options.cornerRadius.global = options.cornerRadius.global ?? 0;
    const cornerRadius = {
        topLeft: options.cornerRadius.topLeft ?? options.cornerRadius.global,
        topRight: options.cornerRadius.topRight ?? options.cornerRadius.global,
        bottomRight: options.cornerRadius.bottomRight ?? options.cornerRadius.global,
        bottomLeft: options.cornerRadius.bottomLeft ?? options.cornerRadius.global
    };
    img.scanQuiet(0, 0, img.bitmap.width, img.bitmap.height, function (x: number, y: number, idx: number) {
        const a = img.bitmap.width / 2;
        const b = img.bitmap.height / 2;

        const _x = x - a;
        const _y = y - b;

        const cr = _x >= 0 ? (_y < 0 ? cornerRadius.topRight : cornerRadius.bottomRight) : (_y < 0 ? cornerRadius.topLeft : cornerRadius.bottomLeft);

        const modX = _x >= 0 ? _x : -_x;
        const modY = _y >= 0 ? _y : -_y;

        const xres = (modX < a - cr) ? 0 : Math.pow((modX - (a - cr)) / cr, 2);
        const yres = (modY < b - cr) ? 0 : Math.pow((modY - (b - cr)) / cr, 2);
        const res = xres + yres;

        img.bitmap.data[idx + 3] = res > 1 ? 0 : 255;
    });

    if (cb && isNodePattern(cb)) {
        cb.call(img, null, img);
    };

    return img
}