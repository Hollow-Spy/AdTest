import { _decorator, Component, Node, RigidBody, Vec3, randomRange } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RandomImpulse')
export class RandomImpulse extends Component {

    @property
    forceMultiplier: number = 10;  // Adjust this to increase or decrease the force

    private rigidBody: RigidBody = null;

    onLoad() {
        // Get the RigidBody component attached to the node
        this.rigidBody = this.node.getComponent(RigidBody);
    }

    start() {
        // Generate random x, y, and z components for the impulse
        const randomX = randomRange(-1, 1);
        const randomY = randomRange(-1, 1);
        const randomZ = randomRange(-1, 1);

        // Normalize the random direction
        const randomImpulse = new Vec3(randomX, randomY, randomZ).normalize();

        // Scale the impulse by the forceMultiplier
        randomImpulse.multiplyScalar(this.forceMultiplier);

        // Apply the impulse to the rigidbody
        this.rigidBody.applyImpulse(randomImpulse);
    }
}

