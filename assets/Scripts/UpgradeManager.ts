import { _decorator, Component, Node, CCBoolean, AudioSource, find } from 'cc';
import { Player } from './Player';
import { ResourceManager } from './ResourceManager';
import { UIUpgrade } from './UIUpgrade';
import { UpgradeShop } from './UpgradeShop';
const { ccclass, property } = _decorator;

@ccclass('UpgradeManager')
export class UpgradeManager extends Component {


    @property({ type: AudioSource })
    denySound: AudioSource = null;

    @property({ type: AudioSource })
    openMenuSound: AudioSource = null;

    @property({ type: AudioSource })
    menuCloseSound: AudioSource = null;

    @property({ type: AudioSource })
    buttonClickSound: AudioSource = null;

    @property({ type: AudioSource })
    upgradeAcceptedSound: AudioSource = null;

    @property({ type: ResourceManager })
    resourcemanager: ResourceManager = null;

    @property({ type: Node })
    mainWindowObj: Node = null;

    @property({ type: [UIUpgrade] }) 
    upgradeScripts: UIUpgrade[] = [];

    @property({ type: UpgradeShop })
    walterBotScript: UpgradeShop = null;

    isClosing: boolean;

    currentUpgrade: number = 0;

    player: Player;

    public start() {
        this.player = find("Player").getComponent(Player);

    }

    closeButtonPressed() {
        this.buttonClickSound.play();
        this.CloseWindow();
    }

    AttemptUpgrade() {

        this.buttonClickSound.play();

        switch (this.currentUpgrade) {
            case 0:
                if (this.resourcemanager.resource1Count >= 10) { //change this
                    this.player.canMove = false;
                    this.upgradeScripts[this.currentUpgrade].PlayUpgradeAnimation();
                    this.waitingUpgrade();
                    this.upgradeAcceptedSound.play();


                  
                    this.resourcemanager.decreaseResource(0,10);
                }
                else {
                    let missingResources: number[] = [1];
                    missingResources[0] = 0;
                    this.upgradeScripts[this.currentUpgrade].NotEnoughResources(missingResources);
                    this.resourcemanager.NotEnoughResources(missingResources);
                    this.denySound.play();
                }

                break;

            case 1:

                if (this.resourcemanager.resource1Count >= 20 && this.resourcemanager.resource2Count >= 20) { //change this
                    this.player.canMove = false;
                    this.upgradeScripts[this.currentUpgrade].PlayUpgradeAnimation();
                    this.waitingUpgrade();
                    this.upgradeAcceptedSound.play();

                    
                    this.resourcemanager.decreaseResource(0, 20);
                    this.resourcemanager.decreaseResource(1, 20);
                }
                else {

                    let missingResources: number[] = [];

                    if (this.resourcemanager.resource1Count < 20) {
                        missingResources.push(0);
                    }

                    if (this.resourcemanager.resource2Count < 20) {
                        missingResources.push(1);
                    }

                   
                    this.upgradeScripts[this.currentUpgrade].NotEnoughResources(missingResources);
                    this.resourcemanager.NotEnoughResources(missingResources);
                    this.denySound.play();
                }

                break;
        }
    }


    OpenWindow() {
        this.isClosing = false;

        this.mainWindowObj.active = true;

        this.upgradeScripts[this.currentUpgrade].node.active = true;

        this.upgradeScripts[this.currentUpgrade].PlayOpenAnimation();

        this.openMenuSound.play();
    }

    CloseWindow() {
        if (!this.mainWindowObj.active) return;
        
        this.isClosing = true;

        this.upgradeScripts[this.currentUpgrade].PlayCloseAnimation();

        this.CloseFully();


        this.menuCloseSound.play();
    }


    private async CloseFully() {
        await this.waitForSeconds(.4);
        if (this.isClosing) {
            this.shutDownWindow();
        }

    }

    private shutDownWindow() {
        this.isClosing = false;
        this.mainWindowObj.active = false;
        this.upgradeScripts[this.currentUpgrade].node.active = false;
    }


    private async waitingUpgrade() {
        await this.waitForSeconds(4.5);
        this.shutDownWindow();
        this.walterBotScript.playUpgradeAnimation();
  
        this.currentUpgrade++;

       
    }

    waitForSeconds(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

  
}

