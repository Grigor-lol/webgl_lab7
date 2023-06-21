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

uniform float brightness;
void main () {
    vec3 lightColor = brightness * vec3(1,1,1);
    vec3 objectColor = texture2D(u_texture, textcoord).rgb;
    // ambient
    float ambient = 0.1;

    // diffuse
    vec3 norm = normalize(Normal);
    vec3 lightDir = vec3(1,1,0);
    float diffuse = max(dot(norm, lightDir), 0.0);
    //vec3 diffuse = diff * lightColor;

    vec3 result = (ambient + diffuse) * lightColor * objectColor;

    // ---------------- <spotlight> --------------------
    vec3 spotlight_direction = vec3(0,-1,0);
    gl_FragColor = vec4(result, 1.0);

    for(int i = 0; i < 8; i++){
        vec3 light_pos = lights_position[i];
        light_pos.y = 10.0;
        light_pos.x -= sign(light_pos.x) * 4.5;
        // light_pos.z = 7.0 * float(i);
        vec3 to_frag = normalize(realPos - light_pos);
        float angle_cos = dot(normalize(spotlight_direction), normalize(to_frag));

        if(angle_cos >= 0.6) {
            gl_FragColor += pow(angle_cos,10.0) * vec4(objectColor,1) * vec4(0.2,0.1,0.1,0.001);
        }
    }
    //if(realPos.z < -80.0){
        gl_FragColor *= abs(-160.0 - realPos.z)*vec4(0.01, 0.01, 0.01, 1.0);
    //}

}