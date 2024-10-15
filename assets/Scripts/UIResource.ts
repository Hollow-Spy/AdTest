import { _decorator, Component, Node, RichText, Animation, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIResource')
export class UIResource extends Component {



    @property({ type: [RichText] })
    resourceText1: RichText[] = [];

    @property({ type: Animation })
    resource1Animation: Animation = null;

    @property({ type: [Sprite] })
    sprite: Sprite;

    public start() {
        this.resourceText1[1].string = `<color=#000000>0</color>`;

    }

     IncreaseResource(resourceNumb: number) {

        let _text: string = resourceNumb.toString();
        this.resourceText1[0].string = _text
         this.resourceText1[1].string = `<color=#000000>${_text}</color>`;

         this.GreenFlash();
        this.resource1Animation.play();
    }

    DecreaseResource(resourceNumb: number) {

        let _text: string = resourceNumb.toString();
        this.resourceText1[0].string = _text
        this.resourceText1[1].string = `<color=#000000>${_text}</color>`;

        this.RedFlash();
        this.resource1Animation.play();
    }


    NotEnoughResources() {

        this.RedFlash();
        this.resource1Animation.play();


    }


    async GreenFlash() {
        this.sprite.grayscale = true;
        this.sprite.color = new Color(0, 255, 0);

        const myText = this.resourceText1[1].string;
        // Wrap the string in <color> tag to make it green
        this.resourceText1[1].string = `<color=#00FF00>${myText}</color>`;

        await this.waitForSeconds(.1);

        this.returnColorNormal(myText);
    }

    private returnColorNormal(myText:string) {
        this.resourceText1[1].string = `<color=#FFFFFF>${myText}</color>`;

        this.sprite.grayscale = false;
        this.sprite.color = new Color(255, 255, 255);
    }

    async RedFlash() {
        this.sprite.grayscale = true;
        this.sprite.color = new Color(255, 0, 0);

        const myText = this.resourceText1[1].string;
        // Wrap the string in <color> tag to make it green
        this.resourceText1[1].string = `<color=#FF0000>${myText}</color>`;

        await this.waitForSeconds(.1);

        this.returnColorNormal(myText);
    }




    waitForSeconds(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
}

