precision mediump float;

uniform vec4 u_diffuse;
uniform vec3 u_lightDirection;
uniform sampler2D u_texture;

uniform vec3 lights_position[10];

varying vec2 textcoord;
varying float constant;
varying vec3 Normal;
varying vec3 FragPos;
varying vec3 realPos;

void main () {

    gl_FragColor = vec4(0.89,0.611,0.278, pow(realPos.y, 3.0));

}