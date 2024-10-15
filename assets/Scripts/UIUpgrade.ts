import { _decorator, Component, Node, Animation } from 'cc';
import { UIResource } from './UIResource';
const { ccclass, property } = _decorator;

@ccclass('UIUpgrade')
export class UIUpgrade extends Component {


    @property({ type: Animation })
    mainAnimator: Animation = null;

    @property({ type: Animation })
    pivotAnimator: Animation = null;


    uiResources: UIResource[] = [];

    @property({ type: Node })
    costObj: Node;

    public start() {
        if (this.costObj.active) {
            this.uiResources = this.costObj.getComponentsInChildren(UIResource);
        }
     
    }

    PlayCloseAnimation() {
        this.mainAnimator.play("CloseUpgradeWindow");
    }

    PlayOpenAnimation() {
        this.mainAnimator.play("upgradeStartUp");
    }

    PlayUpgradeAnimation() {
        this.pivotAnimator.play("upgradeWindowUpgrade");
    }

    NotEnoughResources(missingResources: number[] ) {


        for (let i = 0; i < missingResources.length; i++) {
            this.uiResources[missingResources[i]].NotEnoughResources();
        }

    }

   
   
}

