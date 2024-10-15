import {
    _decorator, Component, Node, Vec3, Vec2, input, Input, EventKeyboard, KeyCode, SystemEvent, Quat, Mat4, CCBoolean, animation, physics, Collider, Layers, ParticleSystem
} from 'cc';
import { CamShake } from './CamShake';
import { ResourceManager } from './ResourceManager';
import { Rock } from './Rock';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    @property
    moveSpeed: number = 5;

    @property
    turnSpeed: number = 300;

    @property({ type: ResourceManager })
    resourceManager: ResourceManager;


    sparkIndex: number = 0;

    @property({ type: [ParticleSystem] })
    sparkParticle: ParticleSystem[] = [];

    @property({ type: CamShake })
    camShake: CamShake

    playerMining: boolean;

    canMove: boolean=true;

 private animator: animation.AnimationController;

    private inputDirection: Vec3 = new Vec3(0, 0, 0); // Movement direction

    allColliders: Array<Collider> = [];
    allRocks: Array<Rock> = [];

    private static _instance: Player | null = null;



    onLoad() {
       this.animator = this.node.getComponentInChildren(animation.AnimationController)

        // Register input events
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

    }

    public start() {
        // Iterate through all root nodes in the scene

        const rootNodes = this.node.scene!.children;



        rootNodes.forEach(rootNode => {
            // Get all child nodes and their colliders
            rootNode.getComponentsInChildren(Collider).forEach(collider => {
                // Check if the collider's node is in the specified layer

                if (collider.node.layer == this.rockLayer) {

                    this.allColliders.push(collider);
                    this.allRocks.push(collider.getComponentInChildren(Rock));
                }
            });
        });
    }


    AddResource(id:number) {
        this.resourceManager.increaseResource(id);
    }

    onDestroy() {
        // Unregister input events
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    
    }

    update(dt: number) {
        if (this.canMove) {
            this.updateLook(dt);
            this.updateMovement(dt);
        }
        else {
            this.animator.setValue("Running", false);
            this.animator.setValue("Attacking", false);
            this.inputDirection.z = 0;
            this.inputDirection.x = 0;
        }

      
      
    }

    // Key down handler
    private isForwardPressed: boolean;
    private isBackPressed: boolean;
    private isLeftPressed: boolean;
    private isRightPressed: boolean;


    onKeyDown(event: EventKeyboard) {
        if (!this.canMove) return;

        switch (event.keyCode) {
            case KeyCode.KEY_W: // Forward
                this.inputDirection.z = -1;
                this.isForwardPressed = true;
           
                break;
            case KeyCode.KEY_S: // Backward
                this.inputDirection.z = 1;
                this.isBackPressed = true;
       
                break;
            case KeyCode.KEY_A: // Left
                this.inputDirection.x = -1;
                this.isLeftPressed = true;
           
                break;
            case KeyCode.KEY_D: // Right
                this.inputDirection.x = 1;
                this.isRightPressed = true;
    
                break;
        }

        if (this.inputDirection.x != 0 || this.inputDirection.z != 0) {

            if (this.currentWeaponTier < 2) {
                this.animator.setValue("Running", true);
            }
    
        }
    }

    // Key up handler
    onKeyUp(event: EventKeyboard) {
        if (!this.canMove) return;
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this.isForwardPressed = false;
         
                if (this.isBackPressed) {
                    this.inputDirection.z = 1;
                }
                else {
                    this.inputDirection.z = 0;
                   
                }

                break;
            case KeyCode.KEY_S:
                this.isBackPressed = false;
        
                if (this.isForwardPressed) {
                    this.inputDirection.z = -1;
                }
                else {
                    this.inputDirection.z = 0;
                }
                break;
            case KeyCode.KEY_A:
                this.isLeftPressed = false;
   
                if (this.isRightPressed) {
                    this.inputDirection.x = 1;
                }
                else {
                    this.inputDirection.x = 0;
                }
                break;
            case KeyCode.KEY_D:
                this.isRightPressed = false;
         
                if (this.isLeftPressed) {
                    this.inputDirection.x = -1;
                }
                else {
                    this.inputDirection.x = 0;
                }
                break;
        }


        
        if (this.inputDirection.z == 0 && this.inputDirection.x == 0)
        { 
            if (this.currentWeaponTier < 2) {
                this.animator.setValue("Running", false);
            }
        }
    }


    ToIso(inputVector: Vec3): Vec3
    {
        // Create a quaternion representing a rotation of 45 degrees around the Y-axis
        const rotationQuaternion = Quat.fromEuler(new Quat(), 0, 315, 0);

        // Create a 4x4 matrix from the quaternion
        const _isoMatrix = new Mat4();
        Mat4.fromQuat(_isoMatrix, rotationQuaternion);

        // Create a new Vec3 to hold the result
        const result = new Vec3();

        // Use Vec3's transformMat4 method to multiply the input vector by the matrix
        Vec3.transformMat4(result, inputVector, _isoMatrix);

        return result;
    }

    rotateTowards(current: Quat, target: Quat, maxDegreesDelta: number): Quat {
        // Calculate the dot product of the current and target quaternions
        const dot = Quat.dot(current, target);

        // If the dot product is negative, the quaternions point in opposite directions
        // so we negate the current quaternion to get the shortest path
        if (dot < 0.0) {
            current = new Quat(-current.x, -current.y, -current.z, -current.w);
        }

        // Calculate the angle between the quaternions in radians
        const angle = Math.acos(Math.min(Math.abs(dot), 1.0));

        // If the angle is less than the maximum delta, return the target quaternion
        if (angle <= maxDegreesDelta * (Math.PI / 180)) { // Convert degrees to radians
            return target.clone(); // Return a clone to avoid modifying the original
        }

        // Calculate the fraction of the rotation to apply
        const t = maxDegreesDelta * (Math.PI / 180) / angle; // Convert degrees to radians

        // Slerp from current to target quaternion
        const result = new Quat();
        Quat.slerp(result, current, target, t);

        return result; // Return the resulting quaternion
    }


    updateLook(dt: number) {

        if (this.inputDirection.equals(new Vec3(0,0,0))) {
            return;
        }

        const rotation = new Quat();
        Quat.fromViewUp(rotation, this.ToIso(this.inputDirection), Vec3.UP);

        this.node.setRotation(this.rotateTowards(this.node.rotation, rotation, this.turnSpeed*dt));

    }



    // Update player movement based on input
    updateMovement(dt: number) {
        const inputDir: number = this.inputDirection.normalize().length() * this.moveSpeed * dt;
        const propelDir: Vec3 = this.node.forward;
        propelDir.multiply3f(inputDir, inputDir, inputDir);

        this.node.setPosition(this.node.position.subtract(propelDir));
    }

    currentMinedRock: Node;
    currentlyMinedRockPosition: Vec3;
    currentlyMinedRockDistance: number = 99;

    @property({ type: Node })
    modelObject: Node;

    @property
    rockTurnSpeed: number = 100;

   

    rotatingTowardsRock: boolean
    rockLookingCoroutineOff: boolean = true;

    rotatingTowardsNothing: boolean
    nothingLookingCoroutineOff: boolean = true;

    Mining(rockPos: Vec3, rock: Node) {

        let distance: number = Vec3.distance(rockPos, this.node.worldPosition);

        if (distance < this.currentlyMinedRockDistance) {

            this.currentlyMinedRockDistance = distance;
            this.currentlyMinedRockPosition = new Vec3(rockPos.x, this.node.worldPosition.y, rockPos.z);
            this.currentMinedRock = rock;

            this.rotatingTowardsRock = true;
            if (this.rockLookingCoroutineOff) {
                this.rotatingTowardsNothing = false;
                this.LookTowardsRockCoroutine();

              this.animator.setValue("Attacking", true);
            }


        }

    }


    StopMining(rock: Node) {

        if (rock == this.currentMinedRock) {
            this.rotatingTowardsRock = false;
            this.rotatingTowardsNothing = true;
            this.currentlyMinedRockDistance = 99;

            if (this.nothingLookingCoroutineOff) {
                this.LookTowardsNothing();
            this.animator.setValue("Attacking", false);
            }
        }

     
    }

    @property({ type: Node })
    damagePoint: Node;

    @property
    damageRadius: number = 1;

    @property
    public rockLayer: number = 1; // Specify the layer to filter by


    @property
    currentWeaponTier: number = 0; 


    @property({ type: [Node] })
    weapons: Node[] = [];

    UpgradeWeaponTier() {
        this.currentWeaponTier++;
        if (this.currentWeaponTier == 1) {
            this.animator.setValue("Drill", true);
            this.weapons[0].active = false;
            this.weapons[1].active = true;

        }
        else {
            this.animator.setValue("Drill", false);
            this.weapons[1].active = false;
            this.weapons[2].active = true;
            this.animator.setValue("Jack", true);
        }
    }


    AttackAnimationEvent() {
      
        this.checkOverlap();
    }

    

    checkOverlap() {
        // Create an empty array to hold overlapping colliders
        let shook = false;
        for (let i = 0; i < this.allColliders.length; i++) {
            // Get all child nodes and their colliders
       
            // Check if the collider's node is in the specified layer
            if (this.allColliders[i] && this.allColliders[i].node) {
                // Calculate the distance from the center point to the collider's node position
                const distance = Vec3.distance(this.damagePoint.worldPosition, this.allColliders[i].node.worldPosition);
                if (distance <= this.damageRadius) {
                    this.sparkParticle[this.sparkIndex].play();
                    this.sparkIndex++;

                    if (this.sparkIndex == this.sparkParticle.length) {
                        this.sparkIndex = 0;
                    }
                    if (!shook) {
                        this.camShake.startShake();
                        shook = true;
                    }
                  
                    this.allRocks[i].Damaged(this.currentWeaponTier);
                }
            }
            else {
                this.allColliders.splice(i, 1);
                this.allRocks.splice(i, 1);
                i--;
            }
       
        }

    }


    // Simulate IEnumerator with async/await
    async LookTowardsRockCoroutine() {
        this.rockLookingCoroutineOff = false;
        const waitTime: number = 0.05;
        while (this.rotatingTowardsRock) {
           
            // Calculate the direction from player to target
            const direction = new Vec3();
            Vec3.subtract(direction, this.currentlyMinedRockPosition, this.node.worldPosition);
            direction.normalize(); // Normalize to get only direction (no distance)

            // Create a quaternion to face the direction
            const targetRotation = new Quat();
            Quat.fromViewUp(targetRotation, direction, Vec3.UP);
           
            // Rotate towards the target rotation smoothl
            const newRotation = this.rotateTowardsRock(this.modelObject.worldRotation, targetRotation, this.rockTurnSpeed, waitTime);
      
            // Apply the new rotation to the player
            this.modelObject.setWorldRotation(newRotation);

          
         
            await this.waitForSeconds(waitTime);  // Wait for 2 seconds
            // Continue logic here
        }
  
        this.rockLookingCoroutineOff = true;

    }


    // Simulate IEnumerator with async/await
    async LookTowardsNothing() {
        this.nothingLookingCoroutineOff = false;
        const waitTime: number = 0.03;
        let progress: number = 0;
        while (this.rotatingTowardsNothing && progress < .6) {

            const targetRotation = new Quat(0, 0, 0, 1); // Target rotation (identity quaternion)


            const lerpedRotation = new Quat();
            Quat.slerp(lerpedRotation, this.modelObject.rotation, targetRotation, progress/.6 ); // Interpolate towards target

            this.modelObject.setRotation(lerpedRotation); // Apply the lerped rotation
       
            progress += waitTime;
     

            await this.waitForSeconds(waitTime);  // Wait for 2 seconds
            // Continue logic here
        }
        if (this.rotatingTowardsNothing) {
            this.modelObject.setRotationFromEuler(new Vec3(0, 0, 0));
        }
       

        this.nothingLookingCoroutineOff = true;

    }


    waitForSeconds(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }


    rotateTowardsRock(current: Quat, target: Quat, maxDegreesDelta: number, dt: number): Quat {
        // Calculate the maximum rotation in radians
        const maxRadiansDelta = maxDegreesDelta * (Math.PI / 180) * dt;
        // Calculate the dot product between the quaternions
        const dot = Quat.dot(current, target);
      
        if (dot > 0.9995) {
            return target.clone(); // Target reached
        }

        // Perform a spherical linear interpolation
        const result = new Quat();
        Quat.slerp(result, current, target, Math.min(1, maxRadiansDelta));
        return result;
    }

  
}

