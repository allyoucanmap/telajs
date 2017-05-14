'use strict';

var area = function area(vertices) {
    var ar = 0;
    for (var i = 0; i < vertices.length; i++) {
        var j = (i + 1) % vertices.length;
        ar += vertices[i][0] * vertices[j][1];
        ar -= vertices[j][0] * vertices[i][1];
    }
    return ar / 2;
};

var convex = function convex(pt) {
    var a = [pt[1][0] - pt[0][0], pt[1][1] - pt[0][1]];
    var b = [pt[2][0] - pt[1][0], pt[2][1] - pt[1][1]];
    if (a[0] * b[1] - a[1] * b[0] > 0) {
        return true;
    }
    return false;
};

var deg = function deg(r) {
    return r / (Math.PI / 180.0);
};

var divide = function divide(a, b, dv) {
    return [a[0] * (1 - dv) + b[0] * dv, a[1] * (1 - dv) + b[1] * dv];
};

var inside = function inside(p, a) {
    var ins = false;
    for (var i = 0, j = a.length - 1; i < a.length; j = i++) {
        if (a[i][1] > p[1] !== a[j][1] > p[1] && p[0] < (a[j][0] - a[i][0]) * (p[1] - a[i][1]) / (a[j][1] - a[i][1]) + a[i][0]) {
            ins = !ins;
        }
    }
    return ins;
};

var lerp = function lerp(a, b, am) {
    return a + (b - a) * am;
};

var map = function map(val, v1, v2, v3, v4) {
    return v3 + (v4 - v3) * ((val - v1) / (v2 - v1));
};

var max = function max(ar, p) {
    return ar.reduce(function (maxV, a) {
        return maxV >= a[p] ? maxV : a[p];
    }, -Infinity);
};

var min = function min(ar, p) {
    return ar.reduce(function (minV, a) {
        return minV <= a[p] ? minV : a[p];
    }, Infinity);
};

var normalize = function normalize(v) {
    var l = v[0] * v[0] + v[1] * v[1];
    if (l > 0) {
        l = 1 / Math.sqrt(l);
        return [v[0] * l, v[1] * l];
    }
    return v;
};

var perpendicular = function perpendicular(a, b, sd) {
    var dl = [b[0] - a[0], b[1] - a[1]];
    var dr = [sd, -1 / (dl[1] / dl[0]) * sd];
    if (dl[0] === 0) {
        dr = [sd, 0];
    } else if (dl[1] === 0) {
        dr = [0, sd];
    }
    return normalize(dr);
};

var rad = function rad(d) {
    return d * (Math.PI / 180.0);
};

var load = function load(url, f) {
    var xh = new XMLHttpRequest();
    xh.onreadystatechange = function () {
        if (this.readyState === 4) {
            var r = this.response;
            if (this.status !== 200) {
                r = {
                    status: this.status
                };
            }
            f(r);
        }
    };
    xh.open('GET', url, true);
    xh.send();
};

var loadShader = function loadShader(gl, s, t) {
    var id = gl.createShader(t);
    gl.shaderSource(id, s);
    gl.compileShader(id);
    if (!gl.getShaderParameter(id, gl.COMPILE_STATUS)) {
        console.warn('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(id));
        gl.deleteShader(id);
        return null;
    }
    return id;
};

var getShadersFromFile = function getShadersFromFile(n, sh, p, spath) {
    sh.vload = false;
    sh.fload = false;
    load(spath + n + '.vert', function (s) {
        if (s.status === undefined) {
            sh.vload = true;
            sh.vert = s;
            if (sh.fload) {
                p.set();
            }
        }
    });
    load(spath + n + '.frag', function (s) {
        if (s.status === undefined) {
            sh.fload = true;
            sh.frag = s;
            if (sh.vload) {
                p.set();
            }
        }
    });
};

module.exports = {
    area: area,
    convex: convex,
    deg: deg,
    divide: divide,
    inside: inside,
    lerp: lerp,
    map: map,
    max: max,
    min: min,
    perpendicular: perpendicular,
    rad: rad,
    load: load,
    loadShader: loadShader,
    getShadersFromFile: getShadersFromFile
};