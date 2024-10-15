import { _decorator, Component, Node, ITriggerEvent, Collider, BoxCollider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MRAIDTrigger')
export class MRAIDTrigger extends Component {
    start() {
        let collider = this.node.getComponent(BoxCollider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }

    private onTriggerEnter(event: ITriggerEvent) {

        console.log("MRAID");

    }
}

