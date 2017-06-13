'use strict';

var Vector = require('./vector');

var Light = function Light(p) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if (!p.started) {
        return null;
    }

    this.id = p.lights.length;
    this.color = new Vector([1.0, 1.0, 1.0]);
    this.position = new Vector([0.0, 0.0, 100.0]);

    var opts = {
        c: 'c',
        p: 'p'
    };

    for (var o in opts) {
        if (options[o] !== undefined) {
            this[opts[o]](options[o]);
        }
    }

    p.lights.push(this);
    return this;
};
/**
 * changes color
 * @function .c
 * @param {array|number} color - [ from 0.0 to 1.0, = , = ] | from 0.0 to 1.0
 * @instance
 * @memberof .lig()
 * @returns array - this color
 */
Light.prototype.c = function (c) {
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
 * @memberof .lig()
 * @returns number - this red color value
 */
Light.prototype.cr = function (r) {
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
 * @memberof .lig()
 * @returns number - this green color value
 */
Light.prototype.cg = function (g) {
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
 * @memberof .lig()
 * @returns number - this blue color value
 */
Light.prototype.cb = function (b) {
    if (b !== undefined) {
        this.color.z(b);
    }
    return this.color.z();
};
/**
 * changes position
 * @function .p
 * @param {array|number} position - [ number, = , = ] | number
 * @instance
 * @memberof .lig()
 * @returns array - this position
 */
Light.prototype.p = function (p) {
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
 * @memberof .lig()
 * @returns number - this x position
 */
Light.prototype.px = function (x) {
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
 * @memberof .lig()
 * @returns number - this y position
 */
Light.prototype.py = function (y) {
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
 * @memberof .lig()
 * @returns number - this z position
 */
Light.prototype.pz = function (z) {
    if (z !== undefined) {
        this.position.z(z);
    }
    return this.position.z();
};

module.exports = Light;