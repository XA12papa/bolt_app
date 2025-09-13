import { expect, test } from "bun:test";
import { onFileUpdate,onShellCommand } from "./os"; 
import { ArtifactProcessor } from "./phraser";


function main(){

    const boltAction = 
    `
      <boltArtifact id="tinder-clone-nextjs" title="Simple Tinder Clone (Next.js + TypeScript)">
  <boltAction type="file" filePath="package.json">
{
  "name": "tinder-clone-nextjs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack --port 8081",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.2.2-canary.3",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-tinder-card": "^1.4.1"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.2.2-canary.3",
    "@eslint/eslintrc": "^3"
  }
}
  </boltAction>

  <boltAction type="shell">
    npm install
  </boltAction>

  <boltAction type="file" filePath="types/react-tinder-card.d.ts">
declare module "react-tinder-card" {
  import * as React from "react";

  type Direction = "left" | "right" | "up" | "down";

  interface Props {
    preventSwipe?: Direction[];
    flickThreshold?: number;
    onSwipe?: (dir: Direction) => void;
    onCardLeftScreen?: (dir: Direction) => void;
    className?: string;
    style?: React.CSSProperties;
    key?: React.Key;
    children?: React.ReactNode;
  }

  const TinderCard: React.FC<Props>;
  export default TinderCard;
}
  </boltAction>

  <boltAction type="file" filePath="data/profiles.ts">
</boltArtifact>
    `

    const artifactProcessor = new ArtifactProcessor(boltAction,(filePath , fileContent ) => onFileUpdate(filePath,fileContent), (shellCommand) => {
        onShellCommand(shellCommand)
    });                 

    artifactProcessor.parse();
    artifactProcessor.parse();
    artifactProcessor.parse();
    artifactProcessor.parse();

}

main()