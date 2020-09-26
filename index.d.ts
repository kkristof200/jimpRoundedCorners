
import { ImageCallback } from '@jimp/core';
import Jimp from 'jimp'

export interface Jimp {
    roundCorners(options?: {
        cornerRadius?: {
        topLeft?: number,
        topRight?: number,
        bottomRight?: number,
        bottomLeft?: number,
        global?: number
    }
    }, cb?: ImageCallback<this>): this;
}

Jimp.prototype.roundCorners = function(
    options?: {
        cornerRadius?: {
            topLeft?: number,
            topRight?: number,
            bottomRight?: number,
            bottomLeft?: number,
            global?: number
        }
    },
    cb?: ImageCallback<this>
): this {
    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
      
    const _defaultRadius = Math.min(this.bitmap.width, this.bitmap.height) / 10;
    options.cornerRadius = options.cornerRadius ?? { global: _defaultRadius };
    options.cornerRadius.global = options.cornerRadius.global ?? 0;
    const cornerRadius = {
        topLeft: options.cornerRadius.topLeft ?? options.cornerRadius.global,
        topRight: options.cornerRadius.topRight ?? options.cornerRadius.global,
        bottomRight: options.cornerRadius.bottomRight ?? options.cornerRadius.global,
        bottomLeft: options.cornerRadius.bottomLeft ?? options.cornerRadius.global
    };
    this.scanQuiet(0, 0, this.bitmap.width, this.bitmap.height, function (x: number, y: number, idx: number) {
        const a = this.bitmap.width / 2;
        const b = this.bitmap.height / 2;

        const _x = x - a;
        const _y = y - b;

        const cr = _x >= 0 ? (_y < 0 ? cornerRadius.topRight : cornerRadius.bottomRight) : (_y < 0 ? cornerRadius.topLeft : cornerRadius.bottomLeft);

        const modX = _x >= 0 ? _x : -_x;
        const modY = _y >= 0 ? _y : -_y;

        const xres = (modX < a - cr) ? 0 : Math.pow((modX - (a - cr)) / cr, 2);
        const yres = (modY < b - cr) ? 0 : Math.pow((modY - (b - cr)) / cr, 2);
        const res = xres + yres;

        this.bitmap.data[idx + 3] = res > 1 ? 0 : 255;
    });

    if ((0, _utils.isNodePattern)(cb)) {
        cb.call(this, null, this);
    };

    return this;
}

// export default function(): RoundCorners;