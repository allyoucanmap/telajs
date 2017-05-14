
const {
    TILE_SIDE_PX,
    wgs84
} = require('./utils');

const {
    update,
    coordinates
} = require('./hybrid');

const geovector = {
    name: 'geovector',
    settings: {
        center: {
            pseudo: [0.0, 0.0],
            wgs84: [9.0, 45.0]
        },
        frame: {
            pseudo: [[0.0, 0.0], [0.0, 0.0]],
            wgs84: [[0.0, 0.0], [0.0, 0.0]],
            tile: [[0, 0], [0, 0]]
        },
        layers: [],
        position: [0.0, 0.0],
        resolution: 0.0,
        scale: 0.0,
        sensitivity: 2,
        visible: [],
        zoom: {
            now: 14,
            max: 19,
            min: 0
        }
    },
    set: {
        now: (ext, tela) => {
            const cam = tela.cam({ ty: 'o'});
            ext.set('cam', cam);

            update(ext, tela);

            /* testing tile size and movements with rectangle model */
            const center = ext.get('center').pseudo;
            const rect = tela.mod({ ty: 'REC' });
            const res = ext.get('resolution');
            tela.ent({ ma: -1, c: [1.0, 0.0, 1.0], mod: rect, p: [center[0], center[1], 1], s: TILE_SIDE_PX * res * 0.99 });
        }
    },
    play: {
        before: () => {},
        now: (ext, tela) => {
            if (tela.get('e').scroll
            || tela.get('e').drag) {
                update(ext, tela);
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
        now: () => {} // not implemented yet
    },
    events: {
        click: () => {},
        drag: (p, ext) => {
            const res = ext.get('resolution');
            const sens = ext.get('sensitivity');
            const center = ext.get('center').pseudo;
            ext.get('center').wgs84 = wgs84([center[0] + p[0] * sens * res, center[1] + p[1] * sens * res]);
        },
        move: (p, ext) => {
            const position = coordinates(p, ext);
            ext.set('position', position);
        },
        scroll: (ev, p, ext) => {
            const zooms = ext.get('zoom');
            const zoom = zooms.now === zooms.max && ev > 0 || zooms.now === zooms.min && ev < 0 ? zooms.now : zooms.now + ev;
            ext.get('zoom').now = zoom;
        }
    }
};

module.exports = geovector;
