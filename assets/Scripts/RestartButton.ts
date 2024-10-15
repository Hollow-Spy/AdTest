import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RestartButton')
export class RestartButton extends Component {

     restartGame() {
        const currentScene = director.getScene().name; // Get the current scene name
        director.loadScene(currentScene); // Reload the current scene
    }
}

