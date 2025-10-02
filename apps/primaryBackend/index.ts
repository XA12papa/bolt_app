import {prismaClient} from "db/client";
import express, { type Request, type Response, type NextFunction } from "express";
import { middleware } from "./middleware";
import cors from "cors";
import dotenv from "dotenv";
import {ApiError, ApiResponse, asyncHandler} from "helper"

dotenv.config({
    path: "./.env"
});
const app = express();

app.use(express.json());
app.use(cors());


app.get("/projects",middleware, asyncHandler( async (req :Request,res :Response ,next :NextFunction) =>{
    try {
        const response = await prismaClient.project.findMany();
        res.status(200).json(response);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}));

app.post("/project",middleware,asyncHandler ( async (req, res) => {
    try {
        const {prompt} = req.body;
        const userId = req.userId;
        if(!prompt){
            res.status(400).json({ error: "Prompt is required" });
            return;
        }
        if(!userId ){
            res.status(400).json( new ApiResponse(400,null,"User does not exits please login"));
            return;
        }
        // 1. Asign user a aws machine 
        // 2. give link of the aws machine 
        // 3. direct user to the code editor page

        const response = await prismaClient.project.create({
            // here we will push the prompt in prompt array .
            data :{
                description : prompt,
                userId : userId,
            }
        })

        if (!response?.id){
            res.status(500).json(new ApiResponse(500,response,"Error while creating project"))
        }


        res.status(200).json(new ApiResponse(200,response,"Project created successfull"));
    } catch (error) {
        res.status(500).json(new ApiResponse(500,null,"Internal server  Error . Plesase Try again later "));
    }
}));

app.post("/getPrompts",asyncHandler( async (req,res) =>{
    try {
        const {projectId} =  req.body;

        const response = await prismaClient.prompt.findMany(
            {
                where :{
                    projectId : projectId
                }
            }
        );
        if(!response){
            res.status(500).json(new ApiResponse(500,null,"Cant fetch teh prompts"))
            return
        }
        res.status(200).json(new ApiResponse(200,response,"Prompts fetched succcessfully"));

    } catch (error) {
        console.error(error)
    }
}));

app.post("/createPrompte",middleware,asyncHandler( async (req, res)=>{
    try {
        const  {prompt,projectId,role} = req.body;
        const response  = await prismaClient.prompt.create(
            {
                data :{
                    prompt,
                    projectId,
                    role
                }
            }
        )

        if(!response?.id){
            res.send(500).json(new ApiResponse(500,response, "Internal Error while creating prompt"))
            return;
        }

        res.send(200).json(new ApiResponse(200,response,"Prompt created sucessfully"))
    } catch (error) {
        throw new ApiError(500,"Error while creating prompt ",error)
    }
}));

app.post("/",middleware,(req, res) => {
    res.send("Hello World!");
});


app.listen(8082 , () => {
    console.log("Server started on port 8082");
});