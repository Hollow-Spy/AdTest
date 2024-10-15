import { _decorator, Component, Node, math, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Squeaker')
export class Squeaker extends Component {

    @property({ type: Animation })
    animationComponent: Animation = null;

    start() {
        // Start playing the animation at a random point in time
        this.playAnimationAtRandomTime();
    }

    playAnimationAtRandomTime() {
        // Ensure the animation component exists

            // Get the currently active animation state (assuming there's only one clip)
            const state = this.animationComponent.defaultClip;

            // Get the duration of the animation clip
            const clipDuration = state.duration;

            // Generate a random time between 0 and the animation's duration
            const randomTime = Math.random() * clipDuration;

            // Play the animation and set the time to the random point
            this.animationComponent.play();
            this.animationComponent.getState(state.name).time = randomTime;

    }
}

