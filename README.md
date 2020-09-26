# jimp-roundedcorners

Rounds the corners of a Jimp image.

## Install

```bash
npm i jimp-roundedcorners
```

## Usage

```typescript
import Jimp from 'jimp'
import { roundCorners } from 'jimp-roundcorners'

Jimp.read('inImgPath')
.then(img => {
    roundCorners(img, {
        cornerRadius: {
            topLeft: 25,
            topRight: 25,
            // bottomRight: 25,
            bottomLeft: 25,
// If any of the above is not provided, 'global' will be used instead
// In this case 'bottomRight'.
// If global is not prvided, the default value is
// Math.min(img.bitmap.width, img.bitmap.height) / 10
            global: 50
        }
    }).write('outImgPath')
})
.catch(err => console.log(err))
```
