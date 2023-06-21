import Object from "./Object";
import mesh from 'bundle-text:../assets/terrain.obj'
class Terrain extends Object{
    speed = 0.5;
    constructor(gl, z, y) {
        super('grass', mesh, gl);
        this.transform.position.z = z;
        this.transform.position.y = y;
    }

    start()
    {
        this.transform.scale.x = 0.1;
        this.transform.scale.y = 0.03   ;
        this.transform.scale.z = 0.11;
        this.transform.rotation.z = 0;
        this.transform.position.y = -4;
    }
    update(event)
    {
        const init_pos = -100;
        if (this.transform.position.z >= -init_pos)
        {
            this.transform.position.z = init_pos;
        }

        this.transform.position.z += this.speed;
        //this.speed += 0.01
    }
    setSlow() {
        this.speed = 0.1;
    }
    setFast() {
        this.speed = 0.5;
    }
}

export default Terrain;