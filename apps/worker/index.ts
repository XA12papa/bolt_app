import OpenAI from "openai";
import { systemPrompt } from "./systemPrompt";
import { prismaClient } from "db/client";

import express, { text } from "express";
import cors from "cors";
import { ArtifactProcessor } from "./phraser";
import { onShellCommand , onFileUpdate } from "./os";
const app = express();
app.use(express.json());
app.use(cors());


app.post('/prompt',async (req,res)=>{
    // 1 . Take projectId and prompt from user 
    // 2. fetch project from the prisma client
    // 3. pull all the history of chats from the prisma client
    // 4. make a request to openai
    // 5. while getting response from openai , parse the data and make changes in the vs code 
    // 6. after all the parsing and editing comples add the new response data to the chat history 
    const {prompt,projectId} = req.body;
    console.log(req.body);
    const project = await prismaClient.project.findUnique({
        where : {
            id : projectId
        }
    })
    if(!project){
        return res.status(400).json({ error: "Project not found" });
    }

    console.log(project)
    // store the current user prompt in database 
    await prismaClient.prompt.create({
        data : { 
            projectId : projectId,
            prompt : prompt,
            role : "USER"
        }
    })


    // get all the previous conversation with user and llm 
    const allPrompts  = await prismaClient.prompt.findMany({
        where :{
            projectId
        },
        
        orderBy :{
            createdAt : "asc"
        }
    })

    let artifactProcessor = new ArtifactProcessor("",(filePath , fileContent ) => onFileUpdate(filePath,fileContent),(shellCommand)=>onShellCommand(shellCommand));

    let artifact = "";
    // dump all the conversation the llm and streme the response  from the llm
    const client = new OpenAI();

    const response = await client.responses.create({
        model : "gpt-5-mini",
        reasoning : {effort : "high"},
        instructions :systemPrompt("NEXTJS"),
        input : allPrompts.map((p)=> {
            // This will return an array of objects of conversation . ex - [{ role : "USER", content : " ...."},{role : "USER", content : " ......"}]

            return {

                // is the user asking the question or the llm asking the question
                role : p.role === "USER" ? "user" : "assistant",
                content : p.prompt

            }
        }),
        store : false,
        stream : true,
        // max_output_tokens : 8000,
    });


    for await (const chunk of response) {
        if(chunk.type === "response.output_text.delta"){
            // chunk.delta contains all the response generation
            // console.log(chunk.delta)
            artifactProcessor.append(chunk.delta);
            artifactProcessor.parse();
            artifact += chunk.delta;
        }
        
    }

    //  store response from the llm to database attachig the prompt 

    const finalMessage  =  await prismaClient.prompt.create({
        data :{
            prompt : artifact,
            projectId,
            role : "SYSTEM"
        }
    });
    console.log("final response ", finalMessage)
    if(!finalMessage){
        return res.status(400).json({ message: "Failed to store the final message" });
    }

    return res.status(200).json({ message: "Prompt stored successfully" });
})

app.listen(3002,()=>{
    console.log("App is running on the port 3002 !! ", )
})