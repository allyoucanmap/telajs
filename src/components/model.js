
const {perpendicular, inside, convex, max, min, map} = require('./utils');
const Vector = require('./vector');

const Model = function(p, options = {}) {

    let opts = {
        raw: 'raw',
        str: 'structure',
        ty: 'type',
        cv: 'cv'
    };

    if (!p.started) {
        return null;
    }

    this.id = p.models.length;
    this.line = 0;
    this.del = false;
    this.entities = [];
    this.type = 'CUB';
    this.gl = p.gl;

    this.vs = {
        i: [],
        p: [],
        t: [],
        n: [],
        c: []
    };

    this.bu = {
        i: null,
        p: null,
        t: null,
        n: null
    };

    for (let o in opts) {
        if (options[o]) {
            this[opts[o]] = options[o];
        }
    }

    switch (this.type) {
        case 'EQU':
            this.vs = {
                i: [0, 1, 2],
                p: [0.0, p.SQRT3 / 3, 0.0, -0.5, -p.SQRT3 / 6, 0.0, 0.5, -p.SQRT3 / 6, 0.0],
                t: [0.5, p.SQRT3 / 2, 0.0, 0.0, 1.0, 0.0],
                n: [0, 0, 1, 0, 0, 1, 0, 0, 1],
                c: [-1, -1, -1, -1, -1, -1, -1, -1, -1]
            };
            break;
        case 'TRI':
            this.vs = {
                i: [0, 1, 2],
                p: [-0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, 0.5, 0.0],
                t: [0, 1, 0, 0, 1, 1],
                n: [0, 0, 1, 0, 0, 1, 0, 0, 1],
                c: [-1, -1, -1, -1, -1, -1, -1, -1, -1]
            };
            break;
        case 'REC':
            this.vs = {
                i: [0, 1, 3, 3, 1, 2],
                p: [-0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0],
                t: [0, 1, 0, 0, 1, 0, 1, 1],
                n: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                c: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
            };
            break;
        case 'CUB':
            this.vs = {
                i: [0, 1, 3, 3, 1, 2, 4, 5, 7, 7, 5, 6, 8, 9, 11, 11, 9, 10, 12, 13, 15, 15, 13, 14, 16, 17, 19, 19, 17, 18, 20, 21, 23, 23, 21, 22],
                p: [-0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5],
                t: [0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1],
                n: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0],
                c: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
            };
            break;
        case 'STR':
            this.vs = this.structure;
            break;
        case 'PLL':
            this.line = 1;
            this.vs = Model.polylines(this.raw, this.cv);
            break;
        case 'PLG':
            this.vs = Model.polygons(this.raw, this.cv);
            break;
        default:
    }

    this.bucreate();
    this.bubind();

    p.models.push(this);

    return this;
};

Model.prototype.size = function() {
    return this.vs.i.length;
};

Model.prototype.ent = function(e) {
    if (e) {
        this.entities.push(e);
    }
    return this.entities;
};

Model.prototype.bucreate = function() {
    this.del = false;
    this.bu.i = this.gl.createBuffer();
    this.bu.p = this.gl.createBuffer();
    this.bu.t = this.gl.createBuffer();
    this.bu.n = this.gl.createBuffer();
    if (this.vs.c) {
        this.bu.c = this.gl.createBuffer();
    }
};

Model.prototype.bubind = function() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bu.i);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vs.i), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bu.p);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vs.p), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bu.t);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vs.t), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bu.n);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vs.n), this.gl.STATIC_DRAW);
    if (this.vs.c) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bu.c);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vs.c), this.gl.STATIC_DRAW);
    }
};

Model.prototype.budelete = function() {
    this.del = true;
    this.gl.deleteBuffer(this.bu.i);
    this.gl.deleteBuffer(this.bu.p);
    this.gl.deleteBuffer(this.bu.t);
    this.gl.deleteBuffer(this.bu.n);
    if (this.vs.c) {
        this.gl.deleteBuffer(this.bu.c);
        this.bu.c = null;
    }
    this.bu.i = null;
    this.bu.p = null;
    this.bu.t = null;
    this.bu.n = null;
};

Model.prototype.destroy = function() {
    if (!this.del) {
        this.budelete();
    }
};

Model.polylines = function(rw, cv) {
    let vs = {
        i: [],
        p: [],
        t: [],
        n: [],
        c: []
    };
    for (let i = 0, k = 0; i < rw.length; i++) {
        for (let j = 0; j < rw[i].length - 1; j++, k += 4) {
            let ca;
            let cb;
            if (cv) {
                ca = cv[i][j]; // color
                cb = cv[i][j + 1]; // color
            }

            let a = rw[i][j]; // point a
            let b = rw[i][j + 1]; // point b
            let r = perpendicular(a, b, 1); // right side
            let l = perpendicular(a, b, -1); // left side
            let s = 0.005; // 1 -> m scale
            let d = s; // direction
            if (b[1] - a[1] <= 0) {
                if (b[0] - a[0] < 0 && b[1] - a[1] === 0) {
                    // placeholder
                } else {
                    d = -1 * s;
                }
            }
            let az = 0.0;
            let bz = 0.0;
            if (a[2] !== undefined) {
                az = a[2];
            }
            if (b[2] !== undefined) {
                bz = b[2];
            }
            vs.i = vs.i.concat([k, k + 1, k + 3, k + 3, k + 1, k + 2]);
            vs.p = vs.p.concat([
                a[0] + l[0] * d, a[1] + l[1] * d, az,
                a[0] + r[0] * d, a[1] + r[1] * d, az,
                b[0] + r[0] * d, b[1] + r[1] * d, bz,
                b[0] + l[0] * d, b[1] + l[1] * d, bz
            ]);
            vs.t = vs.t.concat([0, 0, 1, 0, 1, 1, 0, 1]);
            vs.n = vs.n.concat([l[0] * d, l[1] * d, 1, r[0] * d, r[1] * d, 1, r[0] * d, r[1] * d, 1, l[0] * d, l[1] * d, 1]);

            if (cv) {
                vs.c = vs.c.concat([
                    ca[0], ca[1], ca[2],
                    ca[0], ca[1], ca[2],
                    cb[0], cb[1], cb[2],
                    cb[0], cb[1], cb[2]
                ]);
            } else {
                vs.c = vs.c.concat([
                    -1.0, -1.0, -1.0,
                    -1.0, -1.0, -1.0,
                    -1.0, -1.0, -1.0,
                    -1.0, -1.0, -1.0
                ]);
            }
        }
    }
    return vs;
};

Model.polygons = function(rw, cv) {
    let vs = {
        i: [],
        p: [],
        t: [],
        n: [],
        c: []
    };
    let cnt = 0;
    let tmpmax = [];
    let tmpmin = [];
    for (let i = 0; i < rw.length; i++) {
        tmpmax.push([max(rw[i], '0'), max(rw[i], '1')]);
        tmpmin.push([min(rw[i], '0'), min(rw[i], '1')]);
    }
    let minx = min(tmpmin, [0]);
    let maxx = max(tmpmax, [0]);
    let miny = min(tmpmin, [1]);
    let maxy = max(tmpmax, [1]);
    let tx = 1;
    let ty = 1;
    let ratio = (maxx - minx) / (maxy - miny);
    if (ratio > 1) {
        ty = 1.0 / ratio;
    } else {
        tx = 1.0 * ratio;
    }
    for (let i = 0; i < rw.length; i++) {
        let p = rw[i].map(function(a) {
            return a.slice(0);
        });
        let c;

        if (cv) {
            c = cv[i].map(function(a) {
                return a.slice(0);
            })[0];
        }

        while (p.length > 2) {
            let e = Model.ear(p);
            p.splice(e[0], 1);
            vs.i = vs.i.concat([cnt + 1, cnt, cnt + 2]);
            if (e[1][2] !== undefined && e[2][2] !== undefined && e[3][2] !== undefined) {
                vs.p = vs.p.concat([e[1][0], e[1][1], e[1][2], e[2][0], e[2][1], e[2][2], e[3][0], e[3][1], e[3][2]]);
                let n = Vector.normalize(Vector.snormal(new Vector(e[3]), new Vector(e[2]), new Vector(e[1])));
                vs.n = vs.n.concat([n.x(), n.y(), n.z(), n.x(), n.y(), n.z(), n.x(), n.y(), n.z()]);
            } else {
                vs.p = vs.p.concat([e[1][0], e[1][1], 0.0, e[2][0], e[2][1], 0.0, e[3][0], e[3][1], 0.0]);
                vs.n = vs.n.concat([0, 0, 1, 0, 0, 1, 0, 0, 1]);
            }
            vs.t = vs.t.concat([
                map(e[1][0], minx, maxx, 0, tx),
                map(e[1][1], miny, maxy, 0, ty),
                map(e[2][0], minx, maxx, 0, tx),
                map(e[2][1], miny, maxy, 0, ty),
                map(e[3][0], minx, maxx, 0, tx),
                map(e[3][1], miny, maxy, 0, ty)
            ]);

            if (c) {
                vs.c = vs.c.concat([c[0], c[1], c[2], c[0], c[1], c[2], c[0], c[1], c[2]]);
            } else {
                vs.c = vs.c.concat([-1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0]);
            }

            cnt += 3;
        }
    }

    return vs;
};

Model.ear = function(p) {
    let e = [];
    for (let i = 0; i < p.length; i++) {
        let ia = i - 1;
        let ib = i;
        let ic = i + 1;
        let ch = true;
        if (i === 0) {
            ia = p.length - 1;
            ib = 0;
            ic = 1;
        }
        if (i === p.length - 1) {
            ia = p.length - 2;
            ib = p.length - 1;
            ic = 0;
        }
        if (convex([p[ia], p[ib], p[ic]])) {
            for (let j = 0; j < p.length; j++) {
                if (j !== ia && j !== ib && j !== ic) {
                    if (inside(p[j], [p[ia], p[ib], p[ic], p[ia]])) {
                        ch = false;
                    }
                }
            }
        }
        if (ch) {
            e = [ib, p[ia].slice(0), p[ib].slice(0), p[ic].slice(0)];
            break;
        }
    }
    return e;
};

module.exports = Model;
