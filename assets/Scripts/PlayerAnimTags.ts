import { _decorator, Component, Node, find, AudioSource } from 'cc';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('PlayerAnimTags')
export class PlayerAnimTags extends Component {

/*    @property({ type: Player })*/
    player: Player;


    @property({ type: [AudioSource] })
    pickaxeSounds: AudioSource[] = [];

    @property({ type: [AudioSource] })
    swingSounds: AudioSource[] = [];

    @property({ type: [AudioSource] })
    foostepSounds: AudioSource[] = [];

    public start() {
        this.player = find("Player").getComponent(Player);
    }


    AttackAnimationEvent() {
        this.player.AttackAnimationEvent();
    }

    PickaxeHitEvent() {
        const min = 0;
        const max = this.pickaxeSounds.length - 1;
        const randomPos = Math.floor(Math.random() * (max - min + 1)) + min;

        this.pickaxeSounds[randomPos].play();
    }

    SwingEvent() {
        const min = 0;
        const max = this.swingSounds.length - 1;
        const randomPos = Math.floor(Math.random() * (max - min + 1)) + min;

        this.swingSounds[randomPos].play(); 
    }

    FootstepEvent() {
        const min = 0;
        const max = this.foostepSounds.length - 1;
        const randomPos = Math.floor(Math.random() * (max - min + 1)) + min;

        this.foostepSounds[randomPos].play();
    }

}

