"use client"

import React from 'react'
import {
    Drawer,
    DrawerContent,

  } from "@/components/ui/drawer"
import { Button } from "./ui/button"
import axios from 'axios'


interface projects{
    id :string,
    description :string,
    createdAt :string,
    updatedAt :string
}

function Sidesbar() {
    const [openState, changeOpenState] = React.useState(false); 
    const [position,setMousePosition] = React.useState({x:0,y:0});

    const [projects,setProjects] = React.useState<projects[] | []>([])

    
    
    React.useEffect(() => {
        const updateMousePosition = (e : MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", updateMousePosition);

        // Cleanup on unmount
        return () => {
        window.removeEventListener("mousemove", updateMousePosition);
        };
    }, []);

    React.useEffect(() => {
        if(position.x < 20 && !openState){
        changeOpenState(true)
        }if(position.x > 400 && openState){
        changeOpenState(false)
        }
    }, [position]);

    React.useEffect(() => {
        async function getProjects(){
            try {
                const response = await axios.get("http://localhost:8082/projects");
                setProjects(response.data);
            } catch (error) {
                console.error(error);   
            }
        }

        getProjects();
    }, []);

  return (
    <Drawer direction="left" open={openState}>
    <DrawerContent className='px-2'>
        <div className='mt-10 px-3'>
            <Button className='drawer-button w-full '>start New Chat</Button>
            
            <div className='w-full flex items-center justify-center'>
                my app project 
            </div>
            
            <div className='projects'>
                {
                    projects.map((project : projects,index : number) => (
                        <Button key={index} className='drawer-button w-full mt-2'>{project.description}</Button>
                    ))
                }
            </div>

        </div>
    </DrawerContent>
  </Drawer>
  )
}

export default Sidesbar