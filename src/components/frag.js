
module.exports = "" +
"precision highp float;" +

"uniform vec3 diffuse;" +
"uniform vec3 specular;" +
"uniform vec3 lcolor;" +
"uniform int material;" +
"uniform float value;" +
"uniform float time;" +

"varying vec2 vT;" +

"varying vec3 vC;" +
"varying vec3 suN;" +
"varying vec3 toL;" +

"float random(in vec2 vT) {" +
  "return fract(sin(dot(vT, vec2(12.9898, 78.233))) * 43758.5453123);" +
"}" +

"void main(void) {" +
  "vec4 color;" +

  "if (vC.x >= 0.0 && vC.x <= 1.0) {" +
    "color = vec4(vC, 1.0);" +
  "} else {" +
    "color = vec4(diffuse, 1.0);" +
  "}" +

  "float brightness = 1.0;" +
  "if (material == 0) {" +
    "brightness = max(dot(normalize(suN), normalize(toL)), 0.4);" +
    "color *= vec4(vec3(brightness), 1.0);" +
  "} else if (material == 1) {" +
    "brightness = max(dot(normalize(suN + vec3(random(vT))), normalize(toL)), 0.4);" +
    "color *= vec4(vec3(brightness), 1.0);" +
  "} else if (material == 2) {" +
    "brightness = max(dot(normalize(suN), normalize(toL)), 0.4);" +
    "color *= vec4(vec3(brightness), 1.0);" +
    "color += vec4(vec3(abs(sin(time * value))), 1.0) * vec4(specular, 1.0);" +
  "} else if (material > 2 && material < 9) {" +
    "float noise = 1.0;" +
    "if (material == 3) {" +
      "noise = mod((vT.x) * 20.0 * value, 2.0);" +
    "} else if (material == 4) {" +
      "noise = mod((vT.y) * 20.0 * value, 2.0);" +
    "} else if (material == 5) {" +
      "noise = mod((vT.x + vT.y) * 20.0 * value, 2.0);" +
    "} else if (material == 6) {" +
      "noise = mod((vT.x - vT.y) * 20.0 * value, 2.0);" +
    "} else if (material == 7) {" +
      "noise = mod((vT.x * vT.y) * 20.0 * value, 2.0);" +
    "} else if (material == 8) {" +
      "noise = mod((vT.x / vT.y) * 20.0 * value, 2.0);" +
    "}" +
    "if (noise > 1.1) {" +
      "noise = 1.0;" +
    "} else {" +
      "noise = 0.4;" +
    "}" +
    "brightness = max(dot(normalize(suN + noise), normalize(toL)), 0.4);" +
    "color *= vec4(vec3(brightness), 1.0);" +
  "}" +
  "gl_FragColor = color;" +
"}"
;
