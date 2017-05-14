'use strict';

var Vector = require('./vector');

var Light = function Light(p) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if (!p.started) {
        return null;
    }

    this.id = p.lights.length;
    this.color = new Vector([1.0, 1.0, 1.0]);
    this.position = new Vector([5.0, 5.0, 5.0]);

    var opts = {
        c: 'c',
        p: 'p'
    };

    for (var o in opts) {
        if (options[o]) {
            this[opts[o]](options[o]);
        }
    }

    p.lights.push(this);
    return this;
};

Light.prototype.c = function (c) {
    if (c) {
        if (c.length > 1) {
            this.color.all(c);
        } else {
            this.color.all([c, c, c]);
        }
    }
    return this.color.all();
};

Light.prototype.cr = function (r) {
    if (r) {
        this.color.x(r);
    }
    return this.color.x();
};

Light.prototype.cg = function (g) {
    if (g) {
        this.color.y(g);
    }
    return this.color.y();
};

Light.prototype.cb = function (b) {
    if (b) {
        this.color.z(b);
    }
    return this.color.z();
};

Light.prototype.p = function (p) {
    if (p) {
        this.position.all(p);
    }
    return this.position.all();
};

Light.prototype.px = function (x) {
    if (x) {
        this.position.x(x);
    }
    return this.position.x();
};

Light.prototype.py = function (y) {
    if (y) {
        this.position.y(y);
    }
    return this.position.y();
};

Light.prototype.pz = function (z) {
    if (z) {
        this.position.z(z);
    }
    return this.position.z();
};

module.exports = Light;