import { _decorator, Component, Node, Animation } from 'cc';
import { UIResource } from './UIResource';
const { ccclass, property } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {

    resource1Count: number = 0;
    resource2Count: number = 0;
    resourceSlot: UIResource[] = [];

    @property({ type: Animation })
    secondResourceObj: Animation = null;


    public start() {
        this.secondResourceObj.node.active = true;
        this.resourceSlot = this.node.getComponentsInChildren(UIResource);
        this.secondResourceObj.node.active = false;
    }

    increaseResource(id: number) {
        switch (id) {
            case 0:
                this.resource1Count++;
                this.resourceSlot[0].IncreaseResource(this.resource1Count);
               
                break;
            case 1:

                if (this.resource2Count == 0) {
                    this.secondResourceObj.node.active = true;
                    this.secondResourceObj.play();
                }

                this.resource2Count++;
                this.resourceSlot[1].IncreaseResource(this.resource2Count);
                break;

        }
    }

     decreaseResource(id: number, amount: number) {
        switch (id) {
            case 0:
                this.resource1Count -= amount;
                this.resourceSlot[0].DecreaseResource(this.resource1Count);

                break;
            case 1:

                this.resource2Count -= amount;
                this.resourceSlot[1].DecreaseResource(this.resource2Count);
                break;

        }
    }



    NotEnoughResources(missingResources: number[]) {

        for (let i = 0; i < missingResources.length; i++) {
            this.resourceSlot[missingResources[i]].NotEnoughResources();
        }
    }
}

