"use strict";

var Vector = function Vector() {
    var vs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0.0, 0.0, 0.0];

    this.vs = vs;
    return this;
};

Vector.prototype.all = function (vs) {
    if (vs) {
        this.vs = vs;
    }
    return this.vs;
};

Vector.prototype.x = function (x) {
    if (x) {
        this.vs[0] = x;
    }
    return this.vs[0];
};

Vector.prototype.y = function (y) {
    if (y) {
        this.vs[1] = y;
    }
    return this.vs[1];
};

Vector.prototype.z = function (z) {
    if (z) {
        this.vs[2] = z;
    }
    return this.vs[2];
};

Vector.add = function (a, b) {
    return new Vector([a.vs[0] + b.vs[0], a.vs[1] + b.vs[1], a.vs[2] + b.vs[2]]);
};

Vector.cross = function (a, b) {
    return new Vector([a.vs[1] * b.vs[2] - a.vs[2] * b.vs[1], a.vs[2] * b.vs[0] - a.vs[0] * b.vs[2], a.vs[0] * b.vs[1] - a.vs[1] * b.vs[0]]);
};

Vector.div = function (a, b) {
    return new Vector([a.vs[0] / b.vs[0], a.vs[1] / b.vs[1], a.vs[2] / b.vs[2]]);
};

Vector.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

Vector.mul = function (a, b) {
    return new Vector([a.vs[0] * b.vs[0], a.vs[1] * b.vs[1], a.vs[2] * b.vs[2]]);
};

Vector.snormal = function (a, b, c) {
    return Vector.cross(Vector.sub(b, a), Vector.sub(c, a));
};

Vector.sub = function (a, b) {
    return new Vector([a.vs[0] - b.vs[0], a.vs[1] - b.vs[1], a.vs[2] - b.vs[2]]);
};

Vector.normalize = function (v) {
    var l = v.x() * v.x() + v.y() * v.y() + v.z() * v.z();
    if (l > 0) {
        l = Math.sqrt(l);
        return new Vector([v.x() / l, v.y() / l, v.z() / l]);
    }
    return v;
};

module.exports = Vector;