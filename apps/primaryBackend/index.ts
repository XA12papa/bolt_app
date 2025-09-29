import {prismaClient} from "db/client";
import express from "express";
import { middleware } from "./middleware";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});
const app = express();

app.use(express.json());
app.use(cors());


app.get("/projects", async (req, res) => {
    try {
        const response = await prismaClient.project.findMany();
        res.status(200).json(response);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

app.post("/project",middleware,async (req, res) => {
    try {
        const {prompt} = req.body;
        const userId = req.userId;
        if(!prompt){
            return res.status(400).json({ error: "Prompt is required" });
        }
        if(!userId ){
            return res.status(400).json({ error: "User id is required" });
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





        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        console.error("error while creating project",error);
        res.status(500).json({ error: "Internal server error" });
    }
})


app.post("/",middleware,(req, res) => {
    res.send("Hello World!");
});


app.listen(8082 , () => {
    console.log("Server started on port 8082");
});