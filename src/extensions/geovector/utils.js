
const {rad, deg} = require('../../components/utils');
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
    return Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
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

module.exports = {
    TILE_SIDE_PX,
    resolution,
    scale,
    maxTileBBox,
    llToTl,
    tlToLl,
    wgs84,
    pseudo
};
