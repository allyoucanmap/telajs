
const {rad} = require('./utils');
const Vector = require('./vector');
const Matrix = require('./matrix');

const Camera = function(p, options = {}) {

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
/**
 * updates projection matrix
 * @function .update
 * @param {object} options - { ty, fo, as, w, h, z, ne, fa } see camera options above
 * @instance
 * @memberof .cam()
 */
Camera.prototype.update = function(op) {
    if (op !== undefined) {
        let opts = {
            ty: 'type',
            fo: 'fov',
            as: 'aspect',
            w: 'w',
            h: 'h',
            z: 'zoom',
            ne: 'near',
            fa: 'far'
        };
        for (let o in opts) {
            if (op[o] !== undefined) {
                this[opts[o]] = op[o];
            }
        }
    }
    if (this.type === 'p') {
        this.projection.all(Matrix.per(rad(this.fov), this.aspect, this.near, this.far));
    } else if (this.type === 'o') {
        this.projection.all(Matrix.ort(-(this.w / 2) / this.zoom, this.w / 2 / this.zoom, -(this.h / 2) / this.zoom, this.h / 2 / this.zoom,
            this.near,
            this.far
        ));
    }
};
/**
 * updates view matrix
 * @function .at
 * @param {object} options - { p, ta, up } see camera options above
 * @instance
 * @memberof .cam()
 */
Camera.prototype.at = function(op) {
    if (op !== undefined) {
        let opts = {
            p: 'position',
            ta: 'target',
            up: 'up'
        };
        for (let o in opts) {
            if (op[o] !== undefined) {
                this[opts[o]].all(op[o]);
            }
        }
    }

    this.direction = Vector.normalize(Vector.sub(this.target, this.position));
    this.view.all(Matrix.at(this.position.vs, this.target.vs, this.up.vs));
};
/**
 * changes position
 * @function .p
 * @param {array|number} position - [ number, = , = ] | number
 * @instance
 * @memberof .cam()
 * @returns array - this position
 */
Camera.prototype.p = function(p) {
    if (p !== undefined) {
        this.position.all(p);
        this.at();
    }
    return this.position.all();
};
/**
 * changes x position
 * @function .px
 * @param {number} x
 * @instance
 * @memberof .cam()
 * @returns number - this x position
 */
Camera.prototype.px = function(x) {
    if (x !== undefined) {
        this.position.x(x);
        this.at();
    }
    return this.position.x();
};
/**
 * changes y position
 * @function .py
 * @param {number} y
 * @instance
 * @memberof .cam()
 * @returns number - this y position
 */
Camera.prototype.py = function(y) {
    if (y !== undefined) {
        this.position.y(y);
        this.at();
    }
    return this.position.y();
};
/**
 * changes z position
 * @function .pz
 * @param {number} z
 * @instance
 * @memberof .cam()
 * @returns number - this z position
 */
Camera.prototype.pz = function(z) {
    if (z !== undefined) {
        this.position.z(z);
        this.at();
    }
    return this.position.z();
};
/**
 * changes target
 * @function .ta
 * @param {array} target - [ number, = , = ]
 * @instance
 * @memberof .cam()
 * @returns number - this target
 */
Camera.prototype.ta = function(ta) {
    if (ta !== undefined) {
        this.target.all(ta);
        this.at();
    }
    return this.target.all();
};
/**
 * changes fov
 * @function .fo
 * @param {number} fov
 * @instance
 * @memberof .cam()
 * @returns number - this fov
 */
Camera.prototype.fo = function(fo) {
    if (this.type !== 'p') {
        return null;
    }
    if (fo !== undefined) {
        this.fov = fo;
        this.update();
    }
    return this.fov;
};
/**
 * changes zoom (only type ortho)
 * @function .z
 * @param {number} zoom
 * @instance
 * @memberof .cam()
 * @returns number - this zoom
 */
Camera.prototype.z = function(z) {
    if (this.type !== 'o') {
        return null;
    }
    if (z !== undefined) {
        this.zoom = z;
        this.update();
    }
    return this.zoom;
};
/**
 * changes near plane position
 * @function .ne
 * @param {number} near
 * @instance
 * @memberof .cam()
 * @returns number - this near position
 */
Camera.prototype.ne = function(ne) {
    if (ne !== undefined) {
        this.near = ne;
        this.update();
    }
    return this.near;
};
/**
 * changes far plane position
 * @function .fa
 * @param {number} far
 * @instance
 * @memberof .cam()
 * @returns number - this far position
 */
Camera.prototype.fa = function(fa) {
    if (fa !== undefined) {
        this.far = fa;
        this.update();
    }
    return this.far;
};

module.exports = Camera;
