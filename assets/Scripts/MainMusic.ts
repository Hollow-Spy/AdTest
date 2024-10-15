import { _decorator, Component, Node , AudioSource} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainMusic')
export class MainMusic extends Component {


    music: AudioSource;
    savedMusicTime: number=0;

    public start() {
        this.music = this.node.getComponent(AudioSource);
    }

    update(deltaTime: number) {
        if (this.music.playing) {
            this.savedMusicTime = this.music.currentTime;
        }
        else {
            this.music.currentTime = this.savedMusicTime; // Set it to the saved time
            this.music.play();
        }
            
    }
}

