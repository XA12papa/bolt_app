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

export class ArtifactProcessor {
     public currentArtifact : string;
     private onFileContent : (filePath : string, fileContent : string ) =>void ;
     private onShellCommand : (shellCommand : string) => void;


     constructor(currentArtifact : string , onFileContent : ( filePath : string, fileContent : string) => void , onShellCommand : (shellCommand : string) => void) {
        this.currentArtifact = currentArtifact,
        this.onFileContent = onFileContent,
        this.onShellCommand = onShellCommand
     }

     append(artifact : string ){
         this.currentArtifact += artifact;
     }

     parse(){
        // Todo : make your own parser

        // working :  this line splits the string on the basis of line  and  finds the index of line that has the subString <boltAction type=>
        const latestActionStart = this.currentArtifact.split("\n").findIndex((line) => line.includes("<boltAction type="));

        // working : this line splits the string same as above criteria and finds the index if the line that contains subString <boltAction> 

        const latestActionEnd = this.currentArtifact.split("\n").findIndex((line) => line.includes("</boltAction>")) ?? (this.currentArtifact.split("\n").length  -1 );

        if (latestActionStart === -1){ 
            return;
        }
        // working : current action type here 
        const latestActionType  = this.currentArtifact.split("\n")[latestActionStart]?.split("type=")[1]?.split(">")[0];

        // working : seperates the latest action code  over here  
        const latestActionContent = this.currentArtifact.split("\n").slice(latestActionStart,latestActionEnd + 1 ).join("\n");


        try{
            if (latestActionType === "\"shell\""){

                let shellCommand = latestActionContent.split('\n').slice(1).join('\n');

                if( shellCommand.includes("</boltAction>")){
                    shellCommand = shellCommand.split("</boltAction>")[0] || "";
                    this.currentArtifact = this.currentArtifact.split(latestActionContent)[1] || "";
                    this.onShellCommand(shellCommand);
                }
            }else if ( latestActionType === "\"file\""){
                const filePath = this.currentArtifact.split("\n")[latestActionStart]?.split("filePath")[1]?.split(">")[0];

                let fileContent = latestActionContent.split("\n").slice(1).join("\n");

                if (fileContent.includes("</boltAction>")){
                    fileContent = fileContent.split(latestActionType)[0] || "";
                    this.currentArtifact = this.currentArtifact.split(latestActionContent)[1] || "";
                    this.onFileContent(filePath?.split("\"")[1] || "",fileContent);

                }
            }
        }catch(e){
             
        }
     }
}
