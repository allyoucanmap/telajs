'use strict';

var _require = require('./utils'),
    rad = _require.rad;

var Vector = require('./vector');
var Matrix = require('./matrix');

var Camera = function Camera(p) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if (!p.started) {
        return null;
    }

    this.id = p.cameras.length;
    this.position = new Vector([0.0, 0.0, 5.0]);
    this.target = new Vector([0.0, 0.0, 0.0]);
    this.up = new Vector([0, 1, 0]);
    this.direction = Vector.normalize(Vector.sub(this.target, this.position));
    this.type = 'p';
    this.fov = 70.0;
    this.aspect = p.w / p.h;
    this.near = 0.5;
    this.far = 1000.0;
    this.zoom = 100;
    this.projection = new Matrix();
    this.view = new Matrix();
    this.w = p.w;
    this.h = p.h;

    this.update(options);
    this.at(options);

    p.cameras.push(this);

    return this;
};

Camera.prototype.update = function (op) {
    if (op) {
        var opts = {
            ty: 'type',
            fo: 'fov',
            as: 'aspect',
            w: 'w',
            h: 'h',
            z: 'zoom',
            ne: 'near',
            fa: 'far'
        };
        for (var o in opts) {
            if (op[o]) {
                this[opts[o]] = op[o];
            }
        }
    }
    if (this.type === 'p') {
        this.projection.all(Matrix.per(rad(this.fov), this.aspect, this.near, this.far));
    } else if (this.type === 'o') {
        this.projection.all(Matrix.ort(-(this.w / 2) / this.zoom, this.w / 2 / this.zoom, -(this.h / 2) / this.zoom, this.h / 2 / this.zoom, this.near, this.far));
    }
};

Camera.prototype.at = function (op) {
    if (op) {
        var opts = {
            p: 'position',
            ta: 'target',
            up: 'up'
        };
        for (var o in opts) {
            if (op[o] !== undefined) {
                this[opts[o]].all(op[o]);
            }
        }
    }

    this.direction = Vector.normalize(Vector.sub(this.target, this.position));
    this.view.all(Matrix.at(this.position.vs, this.target.vs, this.up.vs));
};

Camera.prototype.p = function (p) {
    if (p) {
        this.position.all(p);
        this.at();
    }
    return this.position.all();
};

Camera.prototype.px = function (x) {
    if (x) {
        this.position.x(x);
        this.at();
    }
    return this.position.x();
};

Camera.prototype.py = function (y) {
    if (y) {
        this.position.y(y);
        this.at();
    }
    return this.position.y();
};

Camera.prototype.pz = function (z) {
    if (z) {
        this.position.z(z);
        this.at();
    }
    return this.position.z();
};

Camera.prototype.ta = function (ta) {
    if (ta) {
        this.target.all(ta);
        this.at();
    }
    return this.target.all();
};

Camera.prototype.fo = function (fo) {
    if (this.type !== 'p') {
        return null;
    }
    if (fo) {
        this.fov = fo;
        this.update();
    }
    return this.fov;
};

Camera.prototype.z = function (z) {
    if (this.type !== 'o') {
        return null;
    }
    if (z) {
        this.zoom = z;
        this.update();
    }
    return this.zoom;
};

Camera.prototype.ne = function (ne) {
    if (ne) {
        this.near = ne;
        this.update();
    }
    return this.near;
};

Camera.prototype.fa = function (fa) {
    if (fa) {
        this.far = fa;
        this.update();
    }
    return this.far;
};

module.exports = Camera;