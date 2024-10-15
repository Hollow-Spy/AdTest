import { _decorator, Component, Node, BoxCollider, ITriggerEvent, CCBoolean, Vec3, animation, Animation, find, Scene, Prefab, instantiate } from 'cc';
import { Player } from './Player';
import { ResourcePickUp } from './ResourcePickUp';
const { ccclass, property } = _decorator;

@ccclass('Rock')
export class Rock extends Component {

    player: Player = null;

    @property({ type: Node })
    healhBarObj: Node;

    @property({ type: Node })
    healhBarPivot: Node;

    @property({ type: Animation })
    shakeAnimation: Animation;

    @property
    pickupNumber: number = 0;

    @property({ type: Prefab })
    pickupPrefab: Prefab;

    @property({ type: Animation })
    warningText: Animation;

    @property
    resistanceTier: number = 0; 

    @property
    health: number = 20; 

    private maxHealth: number;

    checkingDistance: boolean
    coroutineOff: boolean = true;

    parentNull: Node;


    // Reference to the prefab you want to instantiate
    @property({ type: Prefab })
    hitParticles: Prefab = null;

    @property({ type: Prefab })
    hitParticlesDeath: Prefab = null;

    @property({ type: [Node] }) 
    hitParticlePositions: Node[] = [];


    @property({ type: [Prefab] })
    damageNumbers: Prefab[] = [];

    damageNumberPosIndex: number = 0;

    public start() {
        this.maxHealth = this.health;
        let collider = this.node.getComponent(BoxCollider);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
        collider.on('onTriggerExit', this.onTriggerExit, this);

        this.player = find("Player").getComponent(Player);


        this.parentNull = find("ParentNull");
 

    }


    private summonDamageNumber(index: number) {
        const _newInstance = instantiate(this.damageNumbers[index]);
        _newInstance.setParent(this.parentNull);
        _newInstance.setWorldPosition(this.hitParticlePositions[this.damageNumberPosIndex].worldPosition);
    }

    public Damaged(weaponTier: number) {
        let damage: number;
        if (weaponTier >= this.resistanceTier) {
            this.healhBarObj.active = true;

          

            switch (weaponTier) {
                case 0:
                    damage = 3;

                    this.summonDamageNumber(0);

                    break;
                case 1:
                    damage = 2;
                    this.summonDamageNumber(1);

                    break;
                case 2:
                    damage = 4;
                    this.summonDamageNumber(2);

                    break;
            }

            this.damageNumberPosIndex++;
            if (this.damageNumberPosIndex == this.hitParticlePositions.length) {
                this.damageNumberPosIndex = 0;
            }

            this.shakeAnimation.play();
            this.health -= damage;




            if (this.health <= 0) {

                for (let i = 0; i < this.hitParticlePositions.length; i++) {

                    const newInstance = instantiate(this.hitParticlesDeath);
                    newInstance.setParent(this.parentNull);
                    newInstance.setWorldPosition(this.hitParticlePositions[i].worldPosition);
                    let scal = newInstance.worldScale.x * 2.5;
                    newInstance.worldScale = new Vec3(scal,scal,scal);
                }


                this.health = 0;
                this.healhBarPivot.scale = new Vec3(this.health / this.maxHealth, 1, 1);



                let pickupPosIndex=0;

           

                for (let i = 0; i < this.pickupNumber; i++) {

                    const newInstance = instantiate(this.pickupPrefab);
                    newInstance.setParent(this.parentNull);
                    newInstance.setWorldPosition(this.hitParticlePositions[pickupPosIndex].worldPosition);
                    newInstance.getComponent(ResourcePickUp).moveTowardsPlayer();
     
                 

                    pickupPosIndex++;
                    if (pickupPosIndex == this.hitParticlePositions.length) {
                        pickupPosIndex = 0;
                    }

                }

                this.StopTrigger();
                this.node.parent.destroy();

            }
            else {

                for (let i = 0; i < this.hitParticlePositions.length; i++) {

                    const newInstance = instantiate(this.hitParticles);
                    newInstance.setParent(this.parentNull);
                    newInstance.setWorldPosition(this.hitParticlePositions[i].worldPosition);
                }
            }

            this.healhBarPivot.scale = new Vec3(this.health / this.maxHealth, 1, 1);
        }
        else {
            if (!this.warningText.node.active) {
                this.warningText.node.active = true;
                this.warningText.play();
                this.warningOff();
            }
           
        }
       
    }




    private onTriggerEnter(event: ITriggerEvent) {

        this.checkingDistance = true;
        if (this.coroutineOff) {
            this.performAction();
        }
        
        
    }

    async warningOff() {

        await this.waitForSeconds(2);  // Wait for 2 seconds
        this.warningText.node.active = false;
    }

    // Simulate IEnumerator with async/await
    async performAction() {
        this.coroutineOff = false;
        while (this.checkingDistance) {

        
            this.player.Mining(this.node.worldPosition, this.node);
        

            await this.waitForSeconds(0.1);  // Wait for 2 seconds
        // Continue logic here
        }
        this.coroutineOff = true;
     
    }

    waitForSeconds(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    private onTriggerExit(event: ITriggerEvent) {

        this.StopTrigger();
    }

    private StopTrigger() {
        this.checkingDistance = false;
        this.player.StopMining(this.node);
    }

}

