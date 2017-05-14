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

Entity.prototype.mod = function (mod) {
    if (mod) {
        if (!mod.t) {
            this.model = mod;
        } else {
            this.model = new Model(mod);
        }
        this.model.ent(this);
    }
    return this.model;
};

Entity.prototype.ma = function (ma) {
    if (ma) {
        this.material = ma;
    }
    return this.material;
};

Entity.prototype.n = function (n) {
    if (n) {
        this.name = n;
    }
    return this.name;
};

Entity.prototype.sp = function (s) {
    if (s) {
        if (s.length > 1) {
            this.specular.all(s);
        } else {
            this.specular.all([s, s, s]);
        }
    }
    return this.specular.all();
};

Entity.prototype.c = function (c) {
    if (c) {
        if (c.length > 1) {
            this.color.all(c);
        } else {
            this.color.all([c, c, c]);
        }
    }
    return this.color.all();
};

Entity.prototype.cr = function (r) {
    if (r) {
        this.color.x(r);
    }
    return this.color.x();
};

Entity.prototype.cg = function (g) {
    if (g) {
        this.color.y(g);
    }
    return this.color.y();
};

Entity.prototype.cb = function (b) {
    if (b) {
        this.color.z(b);
    }
    return this.color.z();
};

Entity.prototype.o = function (o) {
    if (o) {
        this.origin.all(o);
    }
    return this.origin.all();
};

Entity.prototype.p = function (p) {
    if (p) {
        this.position.all(p);
    }
    return this.position.all();
};

Entity.prototype.px = function (x) {
    if (x) {
        this.position.x(x);
    }
    return this.position.x();
};

Entity.prototype.py = function (y) {
    if (y) {
        this.position.y(y);
    }
    return this.position.y();
};

Entity.prototype.pz = function (z) {
    if (z) {
        this.position.z(z);
    }
    return this.position.z();
};

Entity.prototype.r = function (r) {
    if (r) {
        this.rotation.vs = [r[0] % 360, r[1] % 360, r[2] % 360];
    }
    return this.rotation.all();
};

Entity.prototype.rx = function (x) {
    if (x) {
        this.rotation.vs[0] = x % 360;
    }
    return this.rotation.x();
};

Entity.prototype.ry = function (y) {
    if (y) {
        this.rotation.vs[1] = y % 360;
    }
    return this.rotation.y();
};

Entity.prototype.rz = function (z) {
    if (z) {
        this.rotation.vs[2] = z % 360;
    }
    return this.rotation.z();
};

Entity.prototype.rs = function (s) {
    if (s) {
        this.rsort = s;
    }
    return this.rsort;
};

Entity.prototype.s = function (s) {
    if (s) {
        if (s.length > 1) {
            this.scale.all(s);
        } else {
            this.scale.all([s, s, s]);
        }
    }
    return this.scale.all();
};

Entity.prototype.sx = function (x) {
    if (x) {
        this.scale.x(x);
    }
    return this.scale.x();
};

Entity.prototype.sy = function (y) {
    if (y) {
        this.scale.y(y);
    }
    return this.scale.y();
};

Entity.prototype.sz = function (z) {
    if (z) {
        this.scale.z(z);
    }
    return this.scale.z();
};

Entity.prototype.li = function () {
    return this.mod().line;
};

Entity.prototype.lw = function (w) {
    if (w) {
        this.lwidth = w;
    }
    return this.lwidth;
};

Entity.prototype.hi = function (h) {
    if (h) {
        this.hide = h;
    }
    return this.hide;
};

Entity.prototype.va = function (v) {
    if (v) {
        this.value = v;
    }
    return this.value;
};

Entity.prototype.de = function () {
    return 0;
};

module.exports = Entity;