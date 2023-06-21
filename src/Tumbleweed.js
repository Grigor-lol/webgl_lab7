import Object from './Object'
import mesh from 'bundle-text:../assets/Tumbleweed.obj'
import Vector3 from "./Vector3";

class Tumbleweed extends Object{
    initYrot = 0;

    _move_objects;
    _setSlowEvent;
    _isSlow = false;
    _isInAir = false;
    /**
     *
     * @param step
     * @private
     */
    ClampYRotate(step = 0.005) {
        if (Math.abs(this.initYrot - this.transform.rotation.y) > step)
        {
            this.transform.rotation.y += Math.sign(this.initYrot - this.transform.rotation.y) * 0.005;
        }
    }
    ClampYPosition(step = 0.4) {
        if (Math.abs(this.initYpos - this.transform.position.y) > step)
        {
            this.transform.position.y += Math.sign(this.initYpos - this.transform.position.y) * 0.4;
        }
    }

    /**
     *
     * @param gl
     * @param obstacles {Array<Obstacle>}
     */
    constructor(gl, obstacles, loseEvent, setSlowEvent, setFastEvent) {
        super("tumbleweed", mesh, gl);
        this._obstacles = obstacles;
        this._loseEvent = loseEvent;
        this._setSlowEvent = setSlowEvent;
        this._setFastEvent = setFastEvent;

    }
    /**
     * @public
     */
    start(){
        this.transform.scale.x = 0.012;
        this.transform.scale.y = 0.012;
        this.transform.scale.z = 0.012;
        this.transform.position.z = 10;
        this.transform.position.y = 3.5;
        this.initYpos = this.transform.position.y;
    }

    /**
     * @public
     */
    update(event){
        // smooth movement
        switch (event){
            case 'd':
                this.transform.position.x += 0.05;
                this.transform.rotation.y = 0.08;
                break;
            case 'a':
                this.transform.position.x -= 0.05;
                this.transform.rotation.y = -0.08;
                break;
            case ' ':
                    this.transform.position.y += 1.5;
                break;
        }
        this.transform.rotation.x += this._isSlow? 0.01 : 0.05;
        this.ClampYRotate();
        this.ClampYPosition();

        // obstacles
        for (const obstacle of this._obstacles) {
            const tempVec = this.transform.position;
            const pos = new Vector3(tempVec.x , tempVec.y, tempVec.z - 4);
            if (Vector3.distance(obstacle.transform.position, pos) < 6){
                this._loseEvent();
            }
        }

        // set slow

        if(Math.abs(this.transform.position.x) > 13 ){
            this._isSlow = true;
            this._setSlowEvent();
        }
        else if(this._isSlow){
            this._isSlow = false;
            this._setFastEvent();
        }
    }
}

export default Tumbleweed;