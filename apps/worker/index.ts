import OpenAI from "openai";
import { systemPrompt } from "./systemPrompt";
import { prismaClient } from "db/client";

import express from "express";
import cors from "cors";

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

    const porject = await prismaClient.project.findUnique({
        where : {
            id : projectId
        }
    })

    if(!porject){
        return res.status(400).json({ error: "Project not found" });
    }

    const promptDb = await prismaClient.prompt.create({
        data : {
            projectId : projectId,
            prompt : prompt,
            role : "USER"
        }
    })

    const allPrompts  = await prismaClient.prompt.findMany({
        where :{
            projectId
        },
        orderBy :{
            createdAt : "asc"
        }
    })

    const client = new OpenAI();

    const response = await client.responses.create({
        model : "gpt-5-mini",
        reasoning : {effort : "high"},
        instructions :systemPrompt("NEXTJS"),
        input : allPrompts.map((p)=> {
            return {

                // is the user asking the question or the llm asking the question
                role : p.role === "USER" ? "user" : "assistant",
                content : p.prompt

            }
        }),
        store : false,
        stream : true,
        max_output_tokens : 8000,
    });

    for await (const chunk of response) {
        // Todo : make the artifact processor
    }
})


