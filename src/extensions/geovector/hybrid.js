
const {
    TILE_SIDE_PX,
    resolution,
    pseudo,
    wgs84,
    scale,
    llToTl,
    tile,
    xyz
} = require('./utils');

const {map, rad} = require('../../components/utils');

const update = (ext, tela) => {
    const zoom = ext.get('zoom').now;
    const width = tela.get('w');
    const height = tela.get('h');
    const dpi = tela.get('dpi').x;
    const wgs84Center = ext.get('center').wgs84;
    const cam = ext.get('cam');
    const sun = ext.get('sun');
    const currentResolution = resolution(0, zoom);
    const viewDistance =  width > height ? height / 2 * currentResolution / Math.cos(rad(cam.fo() / 2)) : width / 2 * currentResolution / Math.cos(rad(cam.fo() / 2));
    const pseudoCenter =  pseudo(wgs84Center);
    const pseudoFrame = [
        [ pseudoCenter[0] - width / 2 * currentResolution, pseudoCenter[1] - height / 2 * currentResolution ],
        [ pseudoCenter[0] + width / 2 * currentResolution, pseudoCenter[1] + height / 2 * currentResolution ]
    ];
    const wgs84Frame = [
        wgs84(pseudoFrame[0]),
        wgs84(pseudoFrame[1])
    ];
    const tileFrame = [
        llToTl(wgs84Frame[0][0], wgs84Frame[0][1], zoom),
        llToTl(wgs84Frame[1][0], wgs84Frame[1][1], zoom)
    ];

    ext.get('center').pseudo = pseudoCenter;
    ext.get('frame').pseudo = pseudoFrame;
    ext.get('frame').wgs84 = wgs84Frame;
    ext.get('frame').tile = tileFrame;
    ext.set('resolution', currentResolution);
    ext.set('scale', scale(wgs84Center[1], zoom, dpi));
    ext.set('width', width);
    ext.set('height', height);

    cam.p([pseudoCenter[0], pseudoCenter[1], viewDistance]);
    cam.ta([pseudoCenter[0], pseudoCenter[1], 0]);
    cam.z(1 / (TILE_SIDE_PX * currentResolution) * TILE_SIDE_PX);
    sun.p([pseudoCenter[0], pseudoCenter[1], 1496000000000]);
};

const coordinates = (p, ext) => {
    const wgs84Frame = ext.get('frame').wgs84;
    const width = ext.get('width');
    const height = ext.get('height');
    const lon = map(p[0], 0, width, wgs84Frame[0][0], wgs84Frame[1][0]);
    const lat = map(p[1], height, 0, wgs84Frame[0][1], wgs84Frame[1][1]);
    return [lon, lat];
};

const position = (p, ext) => {
    const pseudoFrame = ext.get('frame').pseudo;
    const width = ext.get('width');
    const height = ext.get('height');
    const x = map(p[0], 0, width, pseudoFrame[0][0], pseudoFrame[1][0]);
    const y = map(p[1], height, 0, pseudoFrame[0][1], pseudoFrame[1][1]);
    return [x, y];
};

const styletile = (tela, ty, raw, cv) => {
    return tela.ent({ ma: 1, c: [0.1, 0.4, 0.5], sp: [1.0, 0.0, 1.0],
        mod: tela.mod({ ty, raw, cv })
    });
};

const addTile = (x, y, z, layer, tela) => {
    tile(xyz(x, y, z, layer.path), (data) => {
        data.entities.forEach((entity) => {
            let en = styletile(tela, entity.type, entity.raw, entity.cv);
            en.lw(200);
            en.c(layer.color);
            en.ma(layer.mat);
            layer.tiles.push({
                name: x + '%' + y + '%' + z,
                raw: entity.raw,
                cv: entity.cv,
                del: false,
                type: entity.type,
                ent: en
            });
        });
    });
};

const updateLayers = (ext, tela) => {

    let layers = ext.get('layers');
    const z = ext.get('zoom').now;
    const frame = ext.get('frame').tile;
    layers.forEach((layer) => {
        layer.tiles.forEach((t) => {
            let check = false;
            for (let y = frame[1][1]; y < frame[0][1] + 1; y++) {
                for (let x = frame[0][0]; x < frame[1][0] + 1; x++) {
                    if (t.name === x + '%' + y + '%' + z) {
                        check = true;
                        break;
                    }
                }
                if (check) {
                    break;
                }
            }
            if (!check) {
                t.ent.ko();
                t.del = true;
            }
        });
    });

    layers.forEach((layer) => {
        for (let y = frame[1][1]; y < frame[0][1] + 1; y++) {
            for (let x = frame[0][0]; x < frame[1][0] + 1; x++) {
                let check = false;
                let currentTile = null;
                layer.tiles.forEach((t) => {
                    if (t.name === x + '%' + y + '%' + z) {
                        check = true;
                        currentTile = t;
                    }

                    if (check && currentTile && currentTile.del) {
                        currentTile.ent = styletile(tela, currentTile.type, currentTile.raw, currentTile.cv);
                        currentTile.del = false;
                    }
                });
                if (!check) {
                    addTile(x, y, z, layer, tela);
                }
            }
        }
    });

    layers.forEach((layer) => {
        layer.tiles.forEach((t) => {
            if (t.type === 'PLL') {
                t.ent.lw(200);
            }
            t.ent.c(layer.color);
            t.ent.ma(layer.mat);
        });
    });


};

module.exports = {
    update,
    coordinates,
    position,
    updateLayers
};
