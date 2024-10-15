import { _decorator, Component, Node, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CamShake')
export class CamShake extends Component {

    @property({ type: Number })
    shakeDuration: number = 0.2; // Duration of the shake in seconds

    @property({ type: Number })
    shakeIntensity: number = 10; // How intense the shake should be

    private originalPosition: Vec3 = new Vec3();

    onLoad() {
        // Store the initial camera position
        this.originalPosition.set(this.node.position);
    }

    startShake() {
        this.shake(this.shakeDuration, this.shakeIntensity);
    }

    shake(duration: number, intensity: number) {
        let elapsedTime = 0;

        // Run the shake logic each frame
        const shakeUpdate = (dt: number) => {
            elapsedTime += dt;

            if (elapsedTime < duration) {
                // Generate random offsets for x and y
                const offsetX = (Math.random() - 0.5) * intensity;
                const offsetY = (Math.random() - 0.5) * intensity;

                // Apply the random offsets to the camera position
                this.node.setPosition(this.originalPosition.x + offsetX, this.originalPosition.y + offsetY, this.originalPosition.z);
            } else {
                // Once the shake duration ends, reset the camera position
                this.node.setPosition(this.originalPosition);
                this.unschedule(shakeUpdate); // Stop the shaking
            }
        };

        // Schedule the shakeUpdate function every frame
        this.schedule(shakeUpdate);
    }
}

