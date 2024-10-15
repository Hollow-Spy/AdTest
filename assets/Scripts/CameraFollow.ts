import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {


    @property({ type: Node })
    playerNode: Node;

    @property({ type: Number })
    followSpeed: number;


    update(deltaTime: number) {

        let pos: Vec3 = new Vec3(0,0,0);
        Vec3.lerp(pos, this.node.position, this.playerNode.position, this.followSpeed * deltaTime);
        this.node.setPosition(pos);
    }
}

