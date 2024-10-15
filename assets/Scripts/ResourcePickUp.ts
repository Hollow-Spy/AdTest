import { _decorator, Component, Node, Vec3, RigidBody, Vec2, CCBoolean, BoxCollider, ITriggerEvent, find, Collider } from 'cc';
import { Player } from './Player';
const { ccclass, property } = _decorator;

@ccclass('ResourcePickUp')
export class ResourcePickUp extends Component {

    @property({ type: Number })
    public resourceIndex: number=0;

    public _targetPoint: Node = null;

    pickable: boolean;

    public active: boolean = false;

    @property({ type: Node })
    destructionObj: Node;

    player: Player = null;

    parentNull: Node;

    @property
    forceMultiplier: number = 10; // Adjust the force applied

    @property({ type: Collider })
    theCollider: Collider;

    @property({ type: RigidBody })
    rigidbody: RigidBody;

 

    private onTriggerStay(event: ITriggerEvent) {

        if (this.pickable) {
            this.pickablePickedUp();
            if (this.resourceIndex >= 0) {

                this.player.AddResource(this.resourceIndex);
               
            
            }
            else {
                this.player.UpgradeWeaponTier();
                this.player.canMove = true;
            }
           
        }
    }

    private pickablePickedUp() {
        this.destructionObj.active = true;
        this.destructionObj.setParent(this.parentNull);
        this.destructionObj.worldPosition = this.node.worldPosition;

        this.node.destroy();
    }

    async moveTowardsPlayer() {


        this.rigidbody = this.node.getComponent(RigidBody);

        this.parentNull = find("ParentNull");

      
        
        this.theCollider.on('onTriggerStay', this.onTriggerStay, this);

        this.player = find("Player").getComponent(Player);
        this._targetPoint = this.player.node;



        const randomX = Math.random() * 2 - 1;
        const randomY = Math.random() * 2 - 1;
        const randomZ = Math.random() * 2 - 1;

        // Create a new vector with these random components
        const randomDirection = new Vec3(randomX, randomY, randomZ);

        


        let propels = 7;

        while (propels > 0) {
            // Generate a random direction
            const randomX = Math.random() * 2 - 1; // Random number between -1 and 1
            const randomY = Math.random() * 2 - 1; // Random number between -1 and 1
            const randomZ = Math.random() * 2 - 1; // Random number between -1 and 1

            // Create a new normalized vector for the random direction
            const randomDirection = new Vec3(randomX, randomY, randomZ).normalize();

            // Propelling towards the new random direction
            this.propelTowards(randomDirection, (propels * 1.5) * 0.22, false);
            propels--;
            await this.waitForSeconds(0.0045);
        }

        await this.waitForSeconds(0.5);
        this.active = true;
        this.pickable = true;
    }


    waitForSeconds(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    incrementer: number = 20;
    update(dt: number) {
        if (this.active) {

            if (this.incrementer < 22) {
                this.propelTowardsPlayer(this._targetPoint.worldPosition, dt * this.incrementer * 1.5, false);
            }
            else {
                this.propelTowardsPlayer(this._targetPoint.worldPosition, dt * this.incrementer, true);
                this.incrementer += dt * .6;
            }
         
            this.incrementer += dt;

       
        }

        if (this.node.worldPosition.y < .8) {
            this.node.worldPosition = new Vec3(this.node.worldPosition.x, .8, this.node.worldPosition.z);
        }
    }

    propelTowards(target: Vec3, multiplier: number, setSpeed: boolean) {
        // Get the current world position of the object
        const currentPosition = this.node.worldPosition;

        // Calculate the direction to the target point by using the normalized target direction
        const direction = target; // Directly use the normalized direction

        // Check if the direction is zero to prevent any issues
        if (!direction || direction.length() === 0) {
            return; // Prevent further execution
        }

        // Calculate the force components based on the multiplier and forceMultiplier
        const forceX = direction.x * this.forceMultiplier * multiplier;
        const forceY = direction.y * this.forceMultiplier * multiplier;
        const forceZ = direction.z * this.forceMultiplier * multiplier;

        // Create a Vec3 for the force
        const force = new Vec3(forceX, forceY, forceZ);

        // Apply the force to the rigidbody
        if (setSpeed) {
            this.rigidbody.setLinearVelocity(force);
        } else {
            this.rigidbody.applyForce(force);
        }
     
    }


    propelTowardsPlayer(target: Vec3, multiplier: number, setSpeed: boolean) {
        // Get the current position of the object
        const currentPosition = this.node.worldPosition;

        let _temp: Vec3 = new Vec3(target.x, target.y, target.z);

        // Calculate the direction to the target point
        const direction = _temp.subtract(currentPosition);

        // Check if target and current positions are the same
        if (direction.length() === 0) {

            return; // Prevents further execution
        }

        // Normalize the direction vector
        const normalizedDirection = direction.normalize();

        // Calculate the force components based on the multiplier and forceMultiplier
        const forceX = normalizedDirection.x * this.forceMultiplier * multiplier;
        const forceY = normalizedDirection.y * this.forceMultiplier * multiplier;
        const forceZ = normalizedDirection.z * this.forceMultiplier * multiplier;

        // Create a Vec3 for the force
        const force = new Vec3(forceX, forceY, forceZ);

        // Apply the force to the rigidbody
        if (setSpeed) {
            this.rigidbody.setLinearVelocity(force);
        }
        else {
            this.rigidbody.applyForce(force);
        }

    }

}

