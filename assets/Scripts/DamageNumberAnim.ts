import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DamageNumberAnim')
export class DamageNumberAnim extends Component {


    start() {
        const randomNumber = Math.floor(Math.random() * 3);
        let animator = this.getComponent(Animation);

        switch (randomNumber) {
            case 0:
                animator.play("NumberAnim1");
                break;
            case 1:
                animator.play("NumberAnim2");

                break;
            case 2:
                animator.play("NumberAnim3");

                break;
        }
    }


}

