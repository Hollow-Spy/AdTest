import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AutoDelete')
export class AutoDelete extends Component {

    @property
    time: number = 0;

    start() {
        this.Deleting();
    }



    async Deleting() {
        await this.waitForSeconds(this.time);
        this.node.destroy();

    }


    waitForSeconds(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
}

