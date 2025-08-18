/*
    <boltArtifact>
        <boltAction type="shell">
            npm run start
        </boltAction>
        <boltAction type="file" filePath="src/index.js">
            console.log("Hello, world!");
        </boltAction>
    </boltArtifact>
*/

export class responseProcessor {
    public currentArtifact: string;
    private onFlieContent  : (filePath :string, fileContent :string) => void;
    private onShellCommand : (shellCommand :string) => void;

    constructor(currentArtifact : string, onFlieContent  : (filePath :string, fileContent :string) => void, onShellCommand : (shellCommand :string) => void) {
        this.currentArtifact = currentArtifact;
        this.onFlieContent = onFlieContent;
        this.onShellCommand = onShellCommand;

    }

    append(artifact: string) {
        this.currentArtifact += artifact;
    }

    parse() {
        const latestActionStart = this.currentArtifact.split("\n").findIndex((line) => line.includes("<boltAction type="));
        const latestActionEnd = this.currentArtifact.split("\n").findIndex((line) => line.includes("</boltAction>")) ?? (this.currentArtifact.split("\n").length - 1);
 
    }
}