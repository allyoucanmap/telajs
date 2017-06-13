'use strict';

var _require = require('./utils'),
    rad = _require.rad;

var identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

var Matrix = function Matrix() {
    var mx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;

    this.mx = mx;
    return this;
};

Matrix.prototype.all = function (mx) {
    if (mx !== undefined) {
        this.mx = mx;
    }
    return this.mx;
};

Matrix.prototype.m = function (i, m) {
    if (m !== undefined) {
        this.mx[i] = m;
    }
    return this.mx[i];
};

Matrix.at = function (ey, ce, up) {
    if (Math.abs(ey[0] - ce[0]) < 0.000001 && Math.abs(ey[1] - ce[1]) < 0.000001 && Math.abs(ey[2] - ce[2]) < 0.000001) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
    var z0 = ey[0] - ce[0];
    var z1 = ey[1] - ce[1];
    var z2 = ey[2] - ce[2];
    var len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    var x0 = up[1] * z2 - up[2] * z1;
    var x1 = up[2] * z0 - up[0] * z2;
    var x2 = up[0] * z1 - up[1] * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }
    var y0 = z1 * x2 - z2 * x1;
    var y1 = z2 * x0 - z0 * x2;
    var y2 = z0 * x1 - z1 * x0;
    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }
    return [x0, y0, z0, 0, x1, y1, z1, 0, x2, y2, z2, 0, -(x0 * ey[0] + x1 * ey[1] + x2 * ey[2]), -(y0 * ey[0] + y1 * ey[1] + y2 * ey[2]), -(z0 * ey[0] + z1 * ey[1] + z2 * ey[2]), 1];
};

Matrix.per = function (fo, as, ne, fa) {
    var f = 1.0 / Math.tan(fo / 2);
    var nf = 1 / (ne - fa);
    return [f / as, 0, 0, 0, 0, f, 0, 0, 0, 0, (fa + ne) * nf, -1, 0, 0, 2 * fa * ne * nf, 0];
};

Matrix.ort = function (le, ri, bo, to, ne, fa) {
    var lr = 1 / (le - ri);
    var bt = 1 / (bo - to);
    var nf = 1 / (ne - fa);
    return [-2 * lr, 0, 0, 0, 0, -2 * bt, 0, 0, 0, 0, 2 * nf, 0, (le + ri) * lr, (to + bo) * bt, (fa + ne) * nf, 1];
};

Matrix.frot = function (an, ax) {
    var s = Math.sin(an);
    var c = Math.cos(an);
    var mx = [];
    switch (ax) {
        case 'rx':
            mx = [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
            break;
        case 'ry':
            mx = [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
            break;
        case 'rz':
            mx = [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            break;
        default:
            mx = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
    return new Matrix(mx);
};

Matrix.translate = function (mx, v) {
    return new Matrix([mx.m(0), mx.m(1), mx.m(2), mx.m(3), mx.m(4), mx.m(5), mx.m(6), mx.m(7), mx.m(8), mx.m(9), mx.m(10), mx.m(11), mx.m(0) * v[0] + mx.m(4) * v[1] + mx.m(8) * v[2] + mx.m(12), mx.m(1) * v[0] + mx.m(5) * v[1] + mx.m(9) * v[2] + mx.m(13), mx.m(2) * v[0] + mx.m(6) * v[1] + mx.m(10) * v[2] + mx.m(14), mx.m(3) * v[0] + mx.m(7) * v[1] + mx.m(11) * v[2] + mx.m(15)]);
};

Matrix.mul = function (ma, mb) {
    return new Matrix([mb.m(0) * ma.m(0) + mb.m(1) * ma.m(4) + mb.m(2) * ma.m(8) + mb.m(3) * ma.m(12), mb.m(0) * ma.m(1) + mb.m(1) * ma.m(5) + mb.m(2) * ma.m(9) + mb.m(3) * ma.m(13), mb.m(0) * ma.m(2) + mb.m(1) * ma.m(6) + mb.m(2) * ma.m(10) + mb.m(3) * ma.m(14), mb.m(0) * ma.m(3) + mb.m(1) * ma.m(7) + mb.m(2) * ma.m(11) + mb.m(3) * ma.m(15), mb.m(4) * ma.m(0) + mb.m(5) * ma.m(4) + mb.m(6) * ma.m(8) + mb.m(7) * ma.m(12), mb.m(4) * ma.m(1) + mb.m(5) * ma.m(5) + mb.m(6) * ma.m(9) + mb.m(7) * ma.m(13), mb.m(4) * ma.m(2) + mb.m(5) * ma.m(6) + mb.m(6) * ma.m(10) + mb.m(7) * ma.m(14), mb.m(4) * ma.m(3) + mb.m(5) * ma.m(7) + mb.m(6) * ma.m(11) + mb.m(7) * ma.m(15), mb.m(8) * ma.m(0) + mb.m(9) * ma.m(4) + mb.m(10) * ma.m(8) + mb.m(11) * ma.m(12), mb.m(8) * ma.m(1) + mb.m(9) * ma.m(5) + mb.m(10) * ma.m(9) + mb.m(11) * ma.m(13), mb.m(8) * ma.m(2) + mb.m(9) * ma.m(6) + mb.m(10) * ma.m(10) + mb.m(11) * ma.m(14), mb.m(8) * ma.m(3) + mb.m(9) * ma.m(7) + mb.m(10) * ma.m(11) + mb.m(11) * ma.m(15), mb.m(12) * ma.m(0) + mb.m(13) * ma.m(4) + mb.m(14) * ma.m(8) + mb.m(15) * ma.m(12), mb.m(12) * ma.m(1) + mb.m(13) * ma.m(5) + mb.m(14) * ma.m(9) + mb.m(15) * ma.m(13), mb.m(12) * ma.m(2) + mb.m(13) * ma.m(6) + mb.m(14) * ma.m(10) + mb.m(15) * ma.m(14), mb.m(12) * ma.m(3) + mb.m(13) * ma.m(7) + mb.m(14) * ma.m(11) + mb.m(15) * ma.m(15)]);
};

Matrix.scale = function (mx, v) {
    return new Matrix([mx.m(0) * v[0], mx.m(1) * v[0], mx.m(2) * v[0], mx.m(3) * v[0], mx.m(4) * v[1], mx.m(5) * v[1], mx.m(6) * v[1], mx.m(7) * v[1], mx.m(8) * v[2], mx.m(9) * v[2], mx.m(10) * v[2], mx.m(11) * v[2], mx.m(12), mx.m(13), mx.m(14), mx.m(15)]);
};

Matrix.mmx = function (ent) {
    return Matrix.scale(Matrix.mul(Matrix.mul(Matrix.mul(Matrix.translate(new Matrix(), ent.p()), Matrix.frot(rad(ent[ent.rsort[0]]()), ent.rsort[0])), Matrix.frot(rad(ent[ent.rsort[1]]()), ent.rsort[1])), Matrix.frot(rad(ent[ent.rsort[2]]()), ent.rsort[2])), ent.s());
};

Matrix.mvp = function (mmx, vmx, pmx) {
    return Matrix.mul(Matrix.mul(pmx, vmx), mmx);
};

module.exports = Matrix;