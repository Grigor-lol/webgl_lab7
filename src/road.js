import Object from "./Object";
import mesh from 'bundle-text:../assets/road.obj'
import RoadObject from "./road_object";
class Road extends RoadObject{
    speed = 0.5;
    constructor(gl, z, y) {
        super('road', mesh, gl);
        this.transform.position.z = z;
        this.transform.position.y = y;
    }

    start()
    {
        this.transform.scale.x = 1;
        this.transform.scale.y = 1;
        this.transform.scale.z = 1.6;
        this.transform.rotation.z = 3.1415;
    }
    update(event)
    {
        const init_pos = -130;
        if (this.transform.position.z >= -init_pos)
        {
            this.transform.position.z = init_pos;
        }

        this.transform.position.z += this.speed;
    }
    setSlow() {
        this.speed = 0.1;
    }
    setFast() {
        this.speed = 0.5;
    }
}

export default Road;