
module.exports = "" +
"precision highp float;" +

"attribute vec3 p;" +
"attribute vec2 t;" +
"attribute vec3 n;" +
"attribute vec3 c;" +

"uniform mat4 mvp;" +
"uniform mat4 mmx;" +
"uniform mat4 vmx;" +
"uniform mat4 pmx;" +
"uniform vec3 light;" +
"uniform int line;" +
"uniform float lwidth;" +
"uniform vec3 origin;" +

"varying vec2 vT;" +
"varying vec3 suN;" +
"varying vec3 toL;" +
"varying vec3 vC;" +

"void main(void) {" +
  "vT = t;" +
  "vC = c;" +
  "if (line == 0) {" +
    "vec3 wP = (mmx * vec4(p, 1.0)).xyz;" +
    "suN = (mmx * vec4(n, 0.0)).xyz;" +
    "toL = light - wP;" +
    "gl_Position = mvp * vec4(p - origin, 1.0);" +
  "} else {" +
    "vec4 wP = mmx * vec4(p, 1.0);" +
    "suN = (mmx * vec4(vec3(0.0, 0.0, n.z), 0.0)).xyz;" +
    "toL = light - wP.xyz;" +
    "vec4 delta = vmx * mmx * vec4(n.xy * lwidth, 0.0, 0.0);" +
    "vec4 pos = vmx * wP;" +
    "gl_Position = pmx * (pos + delta);" +
  "}" +
"}"
;
