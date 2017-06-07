
const {rad, deg, load} = require('../../components/utils');
const TILE_SIDE_PX = 256;
const EARTH_RADIUS = 6378137.0;
const EARTH_CIRCUMFERENCE = 2 * Math.PI * EARTH_RADIUS;
// const ABS_MAX_LAT = 85.0511;

const resolution = (lat, z) => {
    return EARTH_CIRCUMFERENCE * Math.cos(lat * Math.PI / 180) / Math.pow(2, z + 8);
};

const scale = (lat, z, dpi) => {
    return dpi * 39.37 * resolution(lat, z);
};

const maxTileBBox = (z) => {
    return [[0, Math.pow(2, z) - 1], [Math.pow(2, z) - 1, 0]];
};

const lnToTx = (lon, z) => {
    return Math.floor((lon + 180) / 360 * Math.pow(2, z));
};

const ltToTy = (lat, z) => {
    return Math.floor((1 - Math.log(Math.tan(rad(lat)) + 1 / Math.cos(rad(lat))) / Math.PI) / 2 * Math.pow(2, z));
};

const txToLn = (x, z) => {
    return x / Math.pow(2, z) * 360 - 180;
};

const tyToLt = (y, z) => {
    let n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
};

const llToTl = (lon, lat, z) => {
    return [lnToTx(lon, z), ltToTy(lat, z)];
};

const tlToLl = (x, y, z) => {
    return [txToLn(x, z), tyToLt(y, z)];
};

const xToLon = (x) => {
    return deg(x / EARTH_RADIUS);
};

const yToLat = (y) => {
    return deg(2 * Math.atan(Math.exp(y / EARTH_RADIUS)) - Math.PI / 2);
};

const lonToX = (lon) => {
    return rad(lon) * EARTH_RADIUS;
};

const latToY = (lat) => {
    return Math.log(Math.tan(rad(lat) / 2 + Math.PI / 4)) * EARTH_RADIUS;
};

const wgs84 = (coord) => {
    return [xToLon(coord[0]), yToLat(coord[1])];
};

const pseudo = (coord) => {
    return [lonToX(coord[0]), latToY(coord[1])];
};

const shape = (features) => {
    let entities = {};
    entities.type = '';
    entities.entities = [];
    entities.cv = [];
    entities.raw = [];
    features.forEach((fe) => {
        if (fe.geometry && fe.geometry.type === 'Polygon') {
            let coordinates = [];
            let h = Math.random() * 10;
            let color = [Math.random(), Math.random(), Math.random()];
            let colors = [];

            fe.geometry.coordinates[0].forEach((coord, i) => {
                coordinates.push([...coord, h]);
                colors.push([...color]);
                if (i < fe.geometry.coordinates[0].length - 1) {
                    entities.raw.push([
                        [...fe.geometry.coordinates[0][i + 1], h],
                        [...fe.geometry.coordinates[0][i], h],
                        [...fe.geometry.coordinates[0][i], 0],
                        [...fe.geometry.coordinates[0][i + 1], 0]
                    ]);
                    entities.cv.push([
                        color,
                        color,
                        color,
                        color
                    ]);
                }
            });
            entities.raw.push(coordinates);
            entities.cv.push(colors);
            entities.type = 'PLG';
        } else if (fe.geometry && fe.geometry.type === 'LineString') {
            let coordinates = [];
            let color = [Math.random(), Math.random(), Math.random()];
            let colors = [];
            fe.geometry.coordinates.forEach((coord) => {
                coordinates.push(coord);
                colors.push([...color]);
            });
            entities.raw.push(coordinates);
            entities.cv.push(colors);
            entities.type = 'PLL';
        }
    });

    return entities;
};

const tile = (path, f) => {
    let store = {};
    load(path, (data) => {
        let threshold = 100;
        store.status = data.status;
        store.entities = [];
        if (!data.status) {
            let json = JSON.parse(data);
            for (let i = 0; i < json.features.length; i += threshold ) {
                let temp = [].concat(json.features);
                store.entities.push(shape(temp.splice(i, threshold)));
            }
        }
        if (f) {
            f(store);
        }
    });

    return store;
};

const path = (layer) => {
    let url = '';
    if (layer && layer.type === 'wmts') {
        const params = {
            REQUEST: 'GetTile',
            SERVICE: 'WMTS',
            VERSION: '1.0.0',
            LAYER: layer.name,
            STYLE: '',
            TILEMATRIX: layer.gridset + ':{z}',
            TILEMATRIXSET: layer.gridset,
            FORMAT: layer.format,
            TILECOL: '{x}',
            TILEROW: '{y}'
        };

        url = layer.url + '?';
        for (let param in params) {
            if (params[param]) {
                url = url + param + '=' + params[param] + '&';
            }
        }
        url = url.slice(0, -1);
    }
    return url;
};

const xyz = (x, y, z, url) => {
    let u = url;
    [{r: /\{x\}/g, v: x}, {r: /\{y\}/g, v: y}, {r: /\{z\}/g, v: z}].forEach((c) => {
        u = u.replace(c.r, c.v);
    });
    return u;
};

module.exports = {
    TILE_SIDE_PX,
    resolution,
    scale,
    maxTileBBox,
    llToTl,
    tlToLl,
    wgs84,
    pseudo,
    tile,
    path,
    xyz
};
