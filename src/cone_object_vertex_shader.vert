attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;

uniform vec3 position;
uniform vec3 rotation;
uniform vec3 scale;



varying vec2 textcoord;
varying float constant;
varying vec3 Normal;
varying vec3 FragPos;
varying vec3 realPos;

void main() {
    mat4 rotate_matr = mat4(
        1,  0,                0,            0,
        0,cos(rotation.r),-sin(rotation.r),0,
        0,sin(rotation.r),cos(rotation.r),0,
        0,0,                0,              1)
    *  mat4(
        cos(rotation.y),    0,  sin(rotation.y),    0,
        0,                  1,      0,   0,
        -sin(rotation.y),   0,  cos(rotation.y),    0,
        0,                  0,                 0,  1)
    *  mat4(
        cos(rotation.z),    -sin(rotation.z),  0,    0,
        sin(rotation.z),  cos(rotation.z),  0,   0,
        0,                          0,      1,      0,
        0,              0,                  0,      1);

    mat4 scale_matr = mat4(
        scale.x,0,0,0,
        0,scale.y,0,0,
        0,0,scale.z,0,
        0,0,0,1); // scale

    vec4 pos = scale_matr * rotate_matr * a_position + vec4(position,0);

    pos = u_projection * u_view * u_world * pos;
    gl_Position = pos;
    textcoord = a_texcoord;
    constant = 1.0;
    FragPos = pos.rgb;
    vec4 n = vec4(a_normal,1) * rotate_matr;
    Normal = n.rgb;
    realPos = a_position.xyz;
}