const style = require('./style');

const {
    // TILE_SIDE_PX,
    resolution,
    wgs84,
    path
} = require('./utils');

const {
    update,
    coordinates,
    position,
    updateLayers
} = require('./hybrid');

const geovector = {
    name: 'geovector',
    settings: {
        style,
        center: {
            pseudo: [0.0, 0.0],
            wgs84: [10.5039, 43.8440]
        },
        frame: {
            pseudo: [[0.0, 0.0], [0.0, 0.0]],
            tile: [[0, 0], [0, 0]],
            wgs84: [[0.0, 0.0], [0.0, 0.0]]
        },
        layers: [{
            url: 'http://localhost:8080/geoserver/gwc/service/wmts',
            name: 'osm:roads',
            gridset: 'EPSG:900913',
            format: 'application/json;type=geojson',
            type: 'wmts',
            tiles: [],
            color: [0.5, 0.6, 0.6],
            mat: 1
        },
        {
            url: 'http://localhost:8080/geoserver/gwc/service/wmts',
            name: 'osm:water',
            gridset: 'EPSG:900913',
            format: 'application/json;type=geojson',
            type: 'wmts',
            tiles: [],
            color: [0.3, 0.6, 0.6],
            mat: 1
        },
        {
            url: 'http://localhost:8080/geoserver/gwc/service/wmts',
            name: 'osm:buildings',
            gridset: 'EPSG:900913',
            format: 'application/json;type=geojson',
            type: 'wmts',
            tiles: [],
            color: [0.0, 1.0, 1.0],
            mat: 1
            // 0.5, 0.5, 0.6 violet
            // 0.4, 0.5, 0.1 green
        }],
        position: {
            pseudo: [0.0, 0.0],
            px: [0, 0],
            wgs84: [0.0, 0.0]
        },
        resolution: 0.0,
        scale: 0.0,
        sensitivity: 2,
        visible: [],
        zoom: {
            now: 15,
            max: 19,
            min: 15
        }
    },
    set: {
        now: (ext, tela) => {
            const cam = tela.cam({ ty: 'p', fa: 100000000});
            const sun = tela.lig();
            ext.set('cam', cam);
            ext.set('sun', sun);

            update(ext, tela);

            let layers = ext.get('layers');

            layers.forEach((layer) => {
                layer.path = path(layer);
            });

            updateLayers(ext, tela);
        }
    },
    play: {
        before: () => {},
        now: (ext, tela) => {
            if (tela.get('e').scroll) {
                update(ext, tela);
                updateLayers(ext, tela);
            }

            if (tela.get('e').drag) {
                update(ext, tela);
            }

            if (tela.get('e').dragend) {
                updateLayers(ext, tela);
            }
        },
        after: () => {}
    },
    stop: {
        now: () => {} // not implemented yet
    },
    pause: {
        now: () => {} // not implemented yet
    },
    resize: {
        now: (ext, tela) => {
            update(ext, tela);
            updateLayers(ext, tela);
        }
    },
    events: {
        click: () => {},
        drag: (p, ext) => {
            const res = ext.get('resolution');
            const sens = ext.get('sensitivity');
            const center = ext.get('center').pseudo;
            ext.get('center').wgs84 = wgs84([center[0] - p[0] * sens * res, center[1] + p[1] * sens * res]);
        },
        move: (p, ext) => {
            ext.get('position').px = p;
            ext.get('position').pseudo = position(p, ext);
            ext.get('position').wgs84 = coordinates(p, ext);
        },
        scroll: (ev, p, ext) => {
            const zooms = ext.get('zoom');
            const zoom = zooms.now === zooms.max && ev > 0 || zooms.now === zooms.min && ev < 0 ? zooms.now : zooms.now + ev;
            const width = ext.get('width');
            const height = ext.get('height');
            const delta = [width / 2 - p[0], - (height / 2 - p[1])];
            const res = resolution(0, zoom);
            const pos = position(p, ext);
            ext.get('zoom').now = zoom;
            ext.get('center').wgs84 = wgs84([pos[0] + delta[0] * res, pos[1] + delta[1] * res]);
        }
    }
};

module.exports = geovector;
