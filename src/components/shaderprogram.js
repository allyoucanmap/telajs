
const {loadShader} = require('./utils');

const ShaderProgram = function(p, shader) {
    if (!p.started || !shader) {
        return null;
    }

    this.gl = p.gl;
    this.s = shader;
    this.prsid = null;
    this.vxsid = null;
    this.ftsid = null;
    this.locations = {};

    return this;
};

ShaderProgram.prototype.set = function() {
    this.vxsid = loadShader(this.gl, this.s.vert, this.gl.VERTEX_SHADER);
    this.ftsid = loadShader(this.gl, this.s.frag, this.gl.FRAGMENT_SHADER);
    this.prsid = this.gl.createProgram();
    this.gl.attachShader(this.prsid, this.vxsid);
    this.gl.attachShader(this.prsid, this.ftsid);
    for (let a in this.s.attributes) {
        if (this.s.attributes[a] !== undefined) {
            this.gl.bindAttribLocation(this.prsid, this.s.attributes[a].pos, this.s.attributes[a].name);
        }
    }
    this.gl.linkProgram(this.prsid);
    this.gl.validateProgram(this.prsid);
    for (let u in this.s.uniforms) {
        if (this.s.uniforms[u] !== undefined) {
            this.locations[this.s.uniforms[u].name] = this.gl.getUniformLocation(this.prsid, this.s.uniforms[u].name);
        }
    }
    if (!this.gl.getProgramParameter(this.prsid, this.gl.LINK_STATUS)) {
        console.warn('Unable to initialize the this.s program: ' + this.gl.getProgramInfoLog(this.prsid));
    }
};

ShaderProgram.prototype.start = function() {
    this.gl.useProgram(this.prsid);
};

ShaderProgram.prototype.stop = function() {
    this.gl.useProgram(null);
};

ShaderProgram.prototype.destroy = function() {
    this.gl.detachShader(this.prsid, this.vxsid);
    this.gl.detachShader(this.prsid, this.ftsid);
    this.gl.deleteShader(this.vxsid);
    this.gl.deleteShader(this.ftsid);
    this.gl.deleteProgram(this.prsid);
};

ShaderProgram.prototype.load = function(u, v) {
    switch (u.type) {
        case 'i':
            this.gl.uniform1i(this.locations[u.name], v);
            break;
        case 'f':
            this.gl.uniform1f(this.locations[u.name], v);
            break;
        case 'vec3':
            this.gl.uniform3fv(this.locations[u.name], new Float32Array(v));
            break;
        case 'mat4':
            this.gl.uniformMatrix4fv(this.locations[u.name], false, new Float32Array(v));
            break;
        default:
    }
};

module.exports = ShaderProgram;
