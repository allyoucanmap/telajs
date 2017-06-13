'use strict';

var Vector = require('./vector');
var Model = require('./model');

var Entity = function Entity(p) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if (!p.started) {
        return null;
    }

    this.id = p.entities.length;
    this.name = '';
    this.model = null;
    this.material = 0;
    this.lwidth = 1;
    this.color = new Vector([0.5, 0.4, 0.6]);
    this.specular = new Vector([1.0, 1.0, 1.0]);
    this.origin = new Vector([0.0, 0.0, 0.0]);
    this.position = new Vector([0.0, 0.0, 0.0]);
    this.rotation = new Vector([0.0, 0.0, 0.0]);
    this.scale = new Vector([1.0, 1.0, 1.0]);
    this.rsort = ['rx', 'ry', 'rz'];
    this.hide = false;
    this.value = 1.0;

    var opts = {
        c: 'c',
        mod: 'mod',
        ma: 'ma',
        n: 'n',
        o: 'o',
        p: 'p',
        r: 'r',
        rs: 'rs',
        s: 's',
        sp: 'sp',
        va: 'va'
    };

    for (var o in opts) {
        if (options[o] !== undefined) {
            this[opts[o]](options[o]);
        }
    }

    p.entities.push(this);
    return this;
};
/**
 * adds model to entity
 * @function .mod
 * @param {tela.mod()} model - model
 * @instance
 * @memberof .ent()
 * @returns tela.mod() - this model
 */
Entity.prototype.mod = function (mod) {
    if (mod !== undefined && this.model === null) {
        if (!mod.t) {
            this.model = mod;
        } else {
            this.model = new Model(mod);
        }
        this.model.ent(this);
    }
    return this.model;
};
/**
 * changes texture material
 * @function .ma
 * @param {number} material - from -1 to 9
 * @instance
 * @memberof .ent()
 * @returns number - this texture material
 */
Entity.prototype.ma = function (ma) {
    if (ma !== undefined) {
        this.material = ma;
    }
    return this.material;
};
/**
 * changes name
 * @function .n
 * @param {string} name
 * @instance
 * @memberof .ent()
 * @returns string - this name
 */
Entity.prototype.n = function (n) {
    if (n !== undefined) {
        this.name = n;
    }
    return this.name;
};
/**
 * changes specular color
 * @function .sp
 * @param {array|number} color - [ from 0.0 to 1.0, = , = ] | from 0.0 to 1.0
 * @instance
 * @memberof .ent()
 * @returns array - this specular color
 */
Entity.prototype.sp = function (s) {
    if (s !== undefined) {
        if (s.length > 1) {
            this.specular.all(s);
        } else {
            this.specular.all([s, s, s]);
        }
    }
    return this.specular.all();
};
/**
 * changes color
 * @function .c
 * @param {array|number} color - [ from 0.0 to 1.0, = , = ] | from 0.0 to 1.0
 * @instance
 * @memberof .ent()
 * @returns array - this color
 */
Entity.prototype.c = function (c) {
    if (c !== undefined) {
        if (c.length > 1) {
            this.color.all(c);
        } else {
            this.color.all([c, c, c]);
        }
    }
    return this.color.all();
};
/**
 * changes red value of color
 * @function .cr
 * @param {number} red - from 0.0 to 1.0
 * @instance
 * @memberof .ent()
 * @returns number - this red color value
 */
Entity.prototype.cr = function (r) {
    if (r !== undefined) {
        this.color.x(r);
    }
    return this.color.x();
};
/**
 * changes green value of color
 * @function .cg
 * @param {number} green - from 0.0 to 1.0
 * @instance
 * @memberof .ent()
 * @returns number - this green color value
 */
Entity.prototype.cg = function (g) {
    if (g !== undefined) {
        this.color.y(g);
    }
    return this.color.y();
};
/**
 * changes blue value of color
 * @function .cb
 * @param {number} blue - from 0.0 to 1.0
 * @instance
 * @memberof .ent()
 * @returns number - this blue color value
 */
Entity.prototype.cb = function (b) {
    if (b !== undefined) {
        this.color.z(b);
    }
    return this.color.z();
};
/**
 * changes origin position
 * @function .o
 * @param {array|number} origin - [ number, = , = ] | number
 * @instance
 * @memberof .ent()
 * @returns array - this origin position
 */
Entity.prototype.o = function (o) {
    if (o !== undefined) {
        this.origin.all(o);
    }
    return this.origin.all();
};
/**
 * changes position
 * @function .p
 * @param {array|number} position - [ number, = , = ] | number
 * @instance
 * @memberof .ent()
 * @returns array - this position
 */
Entity.prototype.p = function (p) {
    if (p !== undefined) {
        this.position.all(p);
    }
    return this.position.all();
};
/**
 * changes x position
 * @function .px
 * @param {number} x
 * @instance
 * @memberof .ent()
 * @returns number - this x position
 */
Entity.prototype.px = function (x) {
    if (x !== undefined) {
        this.position.x(x);
    }
    return this.position.x();
};
/**
 * changes y position
 * @function .py
 * @param {number} y
 * @instance
 * @memberof .ent()
 * @returns number - this y position
 */
Entity.prototype.py = function (y) {
    if (y !== undefined) {
        this.position.y(y);
    }
    return this.position.y();
};
/**
 * changes z position
 * @function .pz
 * @param {number} z
 * @instance
 * @memberof .ent()
 * @returns number - this z position
 */
Entity.prototype.pz = function (z) {
    if (z !== undefined) {
        this.position.z(z);
    }
    return this.position.z();
};
/**
 * changes rotation
 * @function .r
 * @param {array|number} rotation - [ from 0.0 to 360.0, = , = ] | from 0.0 to 360.0
 * @instance
 * @memberof .ent()
 * @returns number - this rotation
 */
Entity.prototype.r = function (r) {
    if (r !== undefined) {
        this.rotation.vs = [r[0] % 360, r[1] % 360, r[2] % 360];
    }
    return this.rotation.all();
};
/**
 * changes x rotation
 * @function .rx
 * @param {number} x - from 0.0 to 360.0
 * @instance
 * @memberof .ent()
 * @returns number - this x rotation
 */
Entity.prototype.rx = function (x) {
    if (x !== undefined) {
        this.rotation.vs[0] = x % 360;
    }
    return this.rotation.x();
};
/**
 * changes y rotation
 * @function .ry
 * @param {number} y - from 0.0 to 360.0
 * @instance
 * @memberof .ent()
 * @returns number - this y rotation
 */
Entity.prototype.ry = function (y) {
    if (y !== undefined) {
        this.rotation.vs[1] = y % 360;
    }
    return this.rotation.y();
};
/**
 * changes z rotation
 * @function .rz
 * @param {number} z - from 0.0 to 360.0
 * @instance
 * @memberof .ent()
 * @returns number - this z rotation
 */
Entity.prototype.rz = function (z) {
    if (z !== undefined) {
        this.rotation.vs[2] = z % 360;
    }
    return this.rotation.z();
};
/**
 * sorts rotations order
 * @function .rs
 * @param {array} sort - [ 'rx' | 'ry' | 'rz', = , = ]
 * @instance
 * @memberof .ent()
 * @returns number - this rotations order
 */
Entity.prototype.rs = function (s) {
    if (s !== undefined) {
        this.rsort = s;
    }
    return this.rsort;
};
/**
 * changes scale
 * @function .s
 * @param {array|number} scale - [ number, = , = ] | number
 * @instance
 * @memberof .ent()
 * @returns number - this scale
 */
Entity.prototype.s = function (s) {
    if (s !== undefined) {
        if (s.length > 1) {
            this.scale.all(s);
        } else {
            this.scale.all([s, s, s]);
        }
    }
    return this.scale.all();
};
/**
 * changes x scale
 * @function .sx
 * @param {number} x
 * @instance
 * @memberof .ent()
 * @returns number - this x scale
 */
Entity.prototype.sx = function (x) {
    if (x !== undefined) {
        this.scale.x(x);
    }
    return this.scale.x();
};
/**
 * changes y scale
 * @function .sy
 * @param {number} y
 * @instance
 * @memberof .ent()
 * @returns number - this y scale
 */
Entity.prototype.sy = function (y) {
    if (y !== undefined) {
        this.scale.y(y);
    }
    return this.scale.y();
};
/**
 * changes z scale
 * @function .sz
 * @param {number} y
 * @instance
 * @memberof .ent()
 * @returns number - this z scale
 */
Entity.prototype.sz = function (z) {
    if (z !== undefined) {
        this.scale.z(z);
    }
    return this.scale.z();
};

Entity.prototype.li = function () {
    return this.mod().line;
};
/**
 * changes line width (polylines type)
 * @function .lw
 * @param {number} width
 * @instance
 * @memberof .ent()
 * @returns number - this line width
 */
Entity.prototype.lw = function (w) {
    if (w !== undefined) {
        this.lwidth = w;
    }
    return this.lwidth;
};
/**
 * hides the entity
 * @function .hi
 * @param {boolean} hide
 * @instance
 * @memberof .ent()
 * @returns number - this hide
 */
Entity.prototype.hi = function (h) {
    if (h !== undefined) {
        this.hide = h;
    }
    return this.hide;
};
/**
 * changes texture value of material
 * @function .va
 * @param {number} value
 * @instance
 * @memberof .ent()
 * @returns number - this value
 */
Entity.prototype.va = function (v) {
    if (v !== undefined) {
        this.value = v;
    }
    return this.value;
};
/**
 * removes the entity from render
 * @function .ko
 * @instance
 * @memberof .ent()
 */
Entity.prototype.ko = function () {
    this.model.budelete();
};

module.exports = Entity;