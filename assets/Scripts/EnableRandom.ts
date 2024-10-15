import { _decorator, Component, Node, random } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnableRandom')
export class EnableRandom extends Component {


    @property({ type: [Node] })
    objects: Node[] = [];

    start() {
       const min = 0;
        const max = this.objects.length-1;
        const randomPos = Math.floor(Math.random() * (max - min + 1)) + min;

        this.objects[randomPos].active = true;
    }

}

