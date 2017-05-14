
const {
    TILE_SIDE_PX,
    resolution,
    pseudo,
    wgs84,
    scale,
    llToTl
} = require('./utils');

const {map} = require('../../components/utils');

const update = (ext, tela) => {
    const zoom = ext.get('zoom').now;
    const width = tela.get('w');
    const height = tela.get('h');
    const dpi = tela.get('dpi').x;
    const wgs84Center = ext.get('center').wgs84;
    const currentResolution = resolution(0, zoom);
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

    const cam = ext.get('cam');
    cam.p([pseudoCenter[0], pseudoCenter[1], 5]);
    cam.ta([pseudoCenter[0], pseudoCenter[1], 0]);
    cam.z(1 / (TILE_SIDE_PX * currentResolution) * TILE_SIDE_PX);
};

const coordinates = (p, ext) => {
    const wgs84Frame = ext.get('frame').wgs84;
    const width = ext.get('width');
    const height = ext.get('height');
    const lon = map(p[0], 0, width, wgs84Frame[0][0], wgs84Frame[1][0]);
    const lat = map(p[1], height, 0, wgs84Frame[0][1], wgs84Frame[1][1]);
    return [lon, lat];
};

module.exports = {
    update,
    coordinates
};
