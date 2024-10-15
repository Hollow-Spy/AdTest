import { _decorator, Component, Node, BoxCollider, ITriggerEvent, Animation, CCBoolean, find, animation } from 'cc';
import { Player } from './Player';
import { ResourceManager } from './ResourceManager';
import { UpgradeManager } from './UpgradeManager';
const { ccclass, property } = _decorator;

@ccclass('UpgradeShop')
export class UpgradeShop extends Component {


 

    @property({ type: ResourceManager })
    resourceManager: ResourceManager;

    @property({ type: UpgradeManager })
    upgrademanager: UpgradeManager;



    currentUpgrade: number;

    private animator: animation.AnimationController;


    public start() {
    
        let collider = this.node.getComponent(BoxCollider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        collider.on('onTriggerExit', this.onTriggerExit, this);
        this.animator = this.getComponentInChildren(animation.AnimationController);
    }


    private onTriggerEnter(event: ITriggerEvent) {
      
        this.upgrademanager.OpenWindow();
        
    }

    private onTriggerExit(event: ITriggerEvent) {
      
        this.upgrademanager.CloseWindow();
    }

    playUpgradeAnimation() {
        this.animator.setValue("Work", true);
      
    }


}



