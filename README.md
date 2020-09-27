# jimp-roundedcorners

Rounds the corners of a Jimp image.

## Install

```bash
npm i jimp-roundedcorners
```

## Usage

```typescript
import Jimp from 'jimp'
import { roundCornersFromPath, roundCorners } from 'jimp-roundcorners'

roundCornersFromPath('inPath', {
    outImgPath: 'outPath',
    cornerRadius: {
        topLeft: 25,
        topRight: 25,
        // bottomRight: 25,
        bottomLeft: 25,
        // If any of the above is not provided,
        // 'global' will be used instead
        // In this case 'bottomRight'.
        // If global is not prvided, the default value is
        // Math.min(img.bitmap.width, img.bitmap.height) / 10
        global: 50
    }
})
.then(res => { console.log(res.img, res.path) })
.catch(err => console.log(err))

Jimp.read('inPath')
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
    }).write('outPath')
})
.catch(err => console.log(err))
```
