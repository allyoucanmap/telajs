
const area = (vertices) => {
    let ar = 0;
    for (let i = 0; i < vertices.length; i++) {
        let j = (i + 1) % vertices.length;
        ar += vertices[i][0] * vertices[j][1];
        ar -= vertices[j][0] * vertices[i][1];
    }
    return ar / 2;
};

const convex = (pt) => {
    let a = [pt[1][0] - pt[0][0], pt[1][1] - pt[0][1]];
    let b = [pt[2][0] - pt[1][0], pt[2][1] - pt[1][1]];
    if (a[0] * b[1] - a[1] * b[0] > 0) {
        return true;
    }
    return false;
};

const deg = (r) => {
    return r / (Math.PI / 180.0);
};

const divide = (a, b, dv) => {
    return [a[0] * (1 - dv) + b[0] * dv, a[1] * (1 - dv) + b[1] * dv];
};

const inside = (p, a) => {
    let ins = false;
    for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
        if (a[i][1] > p[1] !== a[j][1] > p[1] && p[0] < (a[j][0] - a[i][0]) * (p[1] - a[i][1]) / (a[j][1] - a[i][1]) + a[i][0]) {
            ins = !ins;
        }
    }
    return ins;
};

const lerp = (a, b, am) => {
    return a + (b - a) * am;
};

const map = (val, v1, v2, v3, v4) => {
    return v3 + (v4 - v3) * ((val - v1) / (v2 - v1));
};

const max = (ar, p) => {
    return ar.reduce((maxV, a) => {
        return maxV >= a[p] ? maxV : a[p];
    }, -Infinity);
};

const min = (ar, p) => {
    return ar.reduce((minV, a) => {
        return minV <= a[p] ? minV : a[p];
    }, Infinity);
};

const normalize = (v) => {
    let l = v[0] * v[0] + v[1] * v[1];
    if (l > 0) {
        l = 1 / Math.sqrt(l);
        return [v[0] * l, v[1] * l];
    }
    return v;
};

const perpendicular = (a, b, sd) => {
    let dl = [b[0] - a[0], b[1] - a[1]];
    let dr = [sd, -1 / (dl[1] / dl[0]) * sd];
    if (dl[0] === 0) {
        dr = [sd, 0];
    } else if (dl[1] === 0) {
        dr = [0, sd];
    }
    return normalize(dr);
};

const rad = (d) => {
    return d * (Math.PI / 180.0);
};

const load = (url, f) => {
    let xh = new XMLHttpRequest();
    xh.onreadystatechange = function() {
        if (this.readyState === 4) {
            let r = this.response;
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

const loadShader = (gl, s, t) => {
    let id = gl.createShader(t);
    gl.shaderSource(id, s);
    gl.compileShader(id);
    if (!gl.getShaderParameter(id, gl.COMPILE_STATUS)) {
        console.warn('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(id));
        gl.deleteShader(id);
        return null;
    }
    return id;
};

const getShadersFromFile = (n, sh, p, spath) => {
    sh.vload = false;
    sh.fload = false;
    load(spath + n + '.vert', (s) => {
        if (s.status === undefined) {
            sh.vload = true;
            sh.vert = s;
            if (sh.fload) {
                p.set();
            }
        }
    });
    load(spath + n + '.frag', (s) => {
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
    area,
    convex,
    deg,
    divide,
    inside,
    lerp,
    map,
    max,
    min,
    perpendicular,
    rad,
    load,
    loadShader,
    getShadersFromFile
};
