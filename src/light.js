import Object from "./Object";
import Vector3 from "./Vector3";
import ConeObject from "./light_cone";

class Light extends Object{
    /**
     * @private
     * @type {number}
     */
    speed = 0.5;
    xPositions = [0,10,-10]
    constructor(id, mesh, gl) {
        super(id, mesh, gl);
        this.lightCone = new ConeObject(gl);

    }

    start(){
        //this.transform.rotation.y = Math.PI;
        this.transform.scale = new Vector3(0.02,0.03,0.02);
        this.lightCone.transform.scale = new Vector3(5,10,5);

        this.lightCone.transform.position = new Vector3(10,10,10);
        this.afterDraw = function (lightpos, view, perspective_projection, cameraPos, cameraFront, cameraUp){
            this.lightCone.draw(lightpos, view, perspective_projection, cameraPos, cameraFront, cameraUp)
        };

    }

    update(){
        const init_pos = -100;


        if (this.transform.position.z >= -init_pos)
        {
            this.transform.position.z = init_pos;
        }

        this.transform.position.z += this.speed;


        const pos = this.transform.position;
        this.lightCone.transform.position = new Vector3(pos.x - 4.5 * Math.sign(pos.x), pos.y, pos.z);
        this.lightCone.transform.position.y = 4;
    }
    setSlow() {
        this.speed = 0.1;
    }
    setFast() {
        this.speed = 0.5;
    }
}

export default Light;