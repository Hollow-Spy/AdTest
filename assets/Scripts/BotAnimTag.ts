import { _decorator, Component, Node, ParticleSystem, Animation } from 'cc';
import { ResourcePickUp } from './ResourcePickUp';
const { ccclass, property } = _decorator;

@ccclass('BotAnimTag')
export class BotAnimTag extends Component {



    @property({ type: ParticleSystem })
    smokeParticles: ParticleSystem = null;

    @property({ type: ParticleSystem })
    spawnParticles: ParticleSystem = null;

    @property({ type: Node })
    lightObj: Node = null;

    @property({ type: Node })
    upgradesMainObj: Node = null;

    pickableUpgrades: ResourcePickUp[] = [];

    currentIndex: number = 0;

    @property({ type: Animation })
    cutsceneAnimation: Animation;

    public start() {
        this.upgradesMainObj.active = true;
        this.pickableUpgrades = this.upgradesMainObj.getComponentsInChildren(ResourcePickUp);
        for (let i = 0; i < this.pickableUpgrades.length; i++) {

            this.pickableUpgrades[i].node.active = false;
        }
       
    }

    enableLightAndSmoke() {

        this.cutsceneAnimation.play("CutsceneOn");

        this.smokeParticles.play();
        this.lightObj.active = true;
    }

    disableLight() {
        this.lightObj.active = false;
        this.smokeParticles.stop();
    }

    enableUpgrade() {

        this.pickableUpgrades[this.currentIndex].node.active = true;
        this.spawnParticles.play();
        this.sendPickUp();
    }


    private async sendPickUp() {
        await this.waitForSeconds(1.5);
        this.pickableUpgrades[this.currentIndex].moveTowardsPlayer();
        this.currentIndex++;
        this.cutsceneAnimation.play("CutseneOff");

    }

    waitForSeconds(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

}

