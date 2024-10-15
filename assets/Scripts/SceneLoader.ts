import { _decorator, Component, Node, director, Vec3, RichText, assetManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneLoader')
export class SceneLoader extends Component {

    @property({ type: Node })
    public progressBar: Node = null;

    @property(RichText)
    public loadingLabel: RichText = null;

    @property(RichText)
    public assetLabel: RichText = null;  // Label to display the asset name

    start() {
        // Start loading the main scene
        this.loadMainScene();
    }

    loadMainScene() {
        const mainSceneName = 'MainScene'; // Replace with your actual scene name

        // Preload the main scene asynchronously, with progress tracking
        director.preloadScene(mainSceneName, this.onProgress.bind(this), this.onLoaded.bind(this));
    }

    onProgress(completedCount: number, totalCount: number, item: any) {
        // Update the progress bar based on loading progress
        const progress = completedCount / totalCount;
        this.progressBar.setScale(new Vec3(progress, this.progressBar.scale.y, this.progressBar.scale.z));

        // Update the loading label to show progress percentage
        this.loadingLabel.string = `Loading assets... (${Math.floor(progress * 100)}%)`;

        // Optionally: Show the name of the currently loading asset
        if (item && item.url) {
            this.assetLabel.string = `Loading: ${item.url}`;
        }
    }

    onLoaded() {
        // Once loading is done, transition to the main scene
        director.loadScene('MainScene'); // Replace with your actual main scene name
    }
}

