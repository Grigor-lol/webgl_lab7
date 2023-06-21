import fragShaderSource from './cone_object_fragment_shader.frag'
import vertexShaderSource from './cone_object_vertex_shader.vert'
import Vector3 from "./Vector3";
import Vertex from "./Vertex";
import Transform from "./transform";
import mesh from "bundle-text:../assets/mathcone.obj"


class ConeObject{
    /**
     * @type {WebGL2RenderingContext}
     * */
    gl;
    /**
     * @type {WebGLProgram}
     */
    program;
    uniformLocations;
    textureHandle;

    /**
     * @type {Array.<Vertex>}>}
     */
    vertices = [];
    indices;

    /**
     * @type {Transform}
     */
    transform;

    /**
     *
     * @param gl
     */
    constructor(gl) {
        this.transform = new Transform(new Vector3(0,0,0), new Vector3(1,1,1), new Vector3(0,0,0))
        this.gl = gl;

        this.SetupMesh(mesh);

        this.gl.enable(this.gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    SetupMesh(mesh) {
        const gl = this.gl;
        this.meshProgramInfo = webglUtils.createProgramInfo(gl, [vertexShaderSource, fragShaderSource]);

        const data = this.parseOBJ(mesh);
        console.log(data);
        this.bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);

        this.cameraTarget = [0, 0, 0];
        this.cameraPosition = [30, 15, -15];
        this.zNear = 0.1;
        this.zFar = 180;

        gl.useProgram(this.meshProgramInfo.program);
    }

    ReadVectorsFromFile(meshFile){
        const infile = meshFile.split(' ').join('\n').split('\n');
        const positions = [];
        const normals = [];
        const uvs = [];
        //console.log(meshFile, 'meshFile')
        //console.log(infile, 'infile')
        for (let index = 0; index < infile.length;) {
            const descr = infile[index++];
            //console.log(descr, 'descr');
            if (descr === "v")
            {
                const x = parseFloat(infile[index++]);
                const y = parseFloat(infile[index++]);
                const z = parseFloat(infile[index++]);
                positions.push(new Vector3(x,y,z));
            }
            else if (descr === "vt")
            {
                const x = parseFloat(infile[index++]);
                const y = parseFloat(infile[index++]);
                uvs.push(new Vector3(x,y,0));
            }
            else if (descr === "vn")
            {
                const x = parseFloat(infile[index++]);
                const y = parseFloat(infile[index++]);
                const z = parseFloat(infile[index++]);
                normals.push(new Vector3(x,y,z));
            }
            else if (descr === "f")
            {
                // get triangle
                for (let i = 0; i < 3; i++)
                {
                    const tr = infile[index++].split('/');

                    // read vertex index
                    const p_ind = parseInt(tr[0]);
                    // read uv index
                    const uv_ind = parseInt(tr[1]);
                    // read normal index
                    const n_ind = parseInt(tr[2]);

                    this.vertices.push(new Vertex( positions[p_ind - 1],normals[n_ind - 1],uvs[uv_ind - 1] ));
                }
            }
        }

        this.indices = new Array(this.vertices.length);

        for (let i = 0; i < this.indices.length; i++)
        {
            this.indices[i] = i;
        }
        console.log(this.vertices.length, 'this.vertices.length')
    }

    getShader(type, src) {
        let shader = this.gl.createShader(type)
        this.gl.shaderSource(shader, src)
        this.gl.compileShader(shader)
        return shader
    }

    degToRad(deg) {
        return deg * Math.PI / 180;
    }

    /**
     *
     * @param lightpos {Vector3}
     * @param view {Vector3}
     * @param perspective_projection {(number)[]}
     * @param cameraPos {Vector3}
     * @param cameraFront {Vector3}
     * @param cameraUp {Vector3}
     */
    draw(lightpos, view, perspective_projection, cameraPos, cameraFront, cameraUp){
        const gl = this.gl;
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);


        const fieldOfViewRadians = this.degToRad(60);
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const r = 1.089;
        const projection = m4.perspective(fieldOfViewRadians, 1.5, this.zNear, this.zFar);

        const up = [0, 1, 0];
        // Compute the camera's matrix using look at.
        const camera = m4.lookAt(this.cameraPosition, this.cameraTarget, up);

        // Make a view matrix from the camera matrix.
        const view2 = m4.inverse(camera);

        const sharedUniforms = {
            u_lightDirection: m4.normalize([-1, 3, 5]),
            u_view: view2,
            u_projection: projection,
            position: this.transform.position.getArray(),
            rotation: this.transform.rotation.getArray(),
            scale: this.transform.scale.getArray(),
            u_texture : this.texture
        };

        gl.useProgram(this.meshProgramInfo.program);

        // calls gl.uniform
        webglUtils.setUniforms(this.meshProgramInfo, sharedUniforms);

        // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
        webglUtils.setBuffersAndAttributes(gl, this.meshProgramInfo, this.bufferInfo);

        // calls gl.uniform
        webglUtils.setUniforms(this.meshProgramInfo, {
            u_world: m4.yRotation(2),
            u_diffuse: [1, 0.7, 0.5, 1],
            lights_position:[10,30,70,0,0,1]
        });

        webglUtils.drawBufferInfo(gl, this.bufferInfo);

    }

    /**
     *
     * @param position {Vector3}
     * @param target {Vector3}
     * @param worldUp {Vector3}
     * @returns {(number)[]}
     */
    calculate_lookAt_matrix(position, target, worldUp) {
        // 1. Position = known
        // 2. Calculate cameraDirection
        /**
         * @type {Vector3}
         */
        const zaxis = Vector3.normalize(new Vector3(position.x - target.x, position.y - target.y, position.z - target.z));
        // 3. Get positive right axis vector
        /**
         * @type {Vector3}
         */
        const xaxis = Vector3.normalize(Vector3.cross(Vector3.normalize(worldUp), zaxis));
        // 4. Calculate camera up vector
        /**
         * @type {Vector3}
         */
        const yaxis = Vector3.cross(zaxis, xaxis);

        // Create translation and rotation matrix
        // In JavaScript we access elements as mat[row][col] due to row-major layout
        const translation = [0, 0, 0, -position.x, 0, 0, 0, -position.y, 0, 0, 0, -position.z, 0, 0, 0, 0];
        const rotation = [xaxis.x, xaxis.y, xaxis.z,
            0,
            yaxis.x, yaxis.y, yaxis.z,
            0,
            zaxis.x, zaxis.y, zaxis.z, 0, 0, 0, 0, 0];

        const res = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
        res[3] = rotation[0] * translation[3] + rotation[1] * translation[7] + rotation[2] * translation[11];
        res[7] = rotation[4] * translation[3] + rotation[5] * translation[7] + rotation[6] * translation[11];
        res[11] = rotation[8] * translation[3] + rotation[9] * translation[7] + rotation[10] * translation[11];

        const viewMatrix = [
            xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.y, 0,
            -Vector3.dot(xaxis, position), -Vector3.dot(yaxis, position), -Vector3.dot(zaxis, position),  1
        ];
        // Return lookAt matrix as combination of translation and rotation matrix
        return viewMatrix; // Remember to read from right to left (first rotation then translation)
    }

    parseOBJ(text) {
        // because indices are base 1 let's just fill in the 0th data
        const objPositions = [[0, 0, 0]];
        const objTexcoords = [[0, 0]];
        const objNormals = [[0, 0, 0]];

        // same order as `f` indices
        const objVertexData = [
            objPositions,
            objTexcoords,
            objNormals,
        ];

        // same order as `f` indices
        let webglVertexData = [
            [],   // positions
            [],   // texcoords
            [],   // normals
        ];

        function addVertex(vert) {
            const ptn = vert.split('/');

            ptn.forEach(
                /**
                 *
                 * @param objIndexStr {string}
                 * @param i
                 */
                (objIndexStr, i) => {
                    if (!objIndexStr) {
                        return;
                    }
                    const objIndex = parseInt(objIndexStr);
                    const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
                    webglVertexData[i].push(...objVertexData[i][index]);
                });
        }

        const keywords = {
            v(parts) {
                objPositions.push(parts.map(parseFloat));
            },
            vn(parts) {
                objNormals.push(parts.map(parseFloat));
            },
            vt(parts) {
                // should check for missing v and extra w?
                objTexcoords.push(parts.map(parseFloat));
            },
            f(parts) {
                const numTriangles = parts.length - 2;
                for (let tri = 0; tri < numTriangles; ++tri) {
                    addVertex(parts[0]);
                    addVertex(parts[tri + 1]);
                    addVertex(parts[tri + 2]);
                }
            },
        };

        const keywordRE = /(\w*)(?: )*(.*)/;
        const lines = text.split('\n');
        for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
            const line = lines[lineNo].trim();
            if (line === '' || line.startsWith('#')) {
                continue;
            }
            const m = keywordRE.exec(line);
            if (!m) {
                continue;
            }
            const [, keyword, unparsedArgs] = m;
            const parts = line.split(/\s+/).slice(1);
            const handler = keywords[keyword];
            if (!handler) {
                console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
                continue;
            }
            handler(parts, unparsedArgs);
        }

        return {
            position: webglVertexData[0],
            texcoord: webglVertexData[1],
            normal: webglVertexData[2],
        };
    }

    perspective(r) {
        return [
            1,0,0,0,
            0,1,0,0,
            0,0,1,-1.0/r,
            0,0,0,1
        ];
    }

    start(){}

    update(){}
}

export default ConeObject;