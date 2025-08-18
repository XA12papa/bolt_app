"use client"
import React from 'react'
import { Textarea } from './ui/textarea'    
import { Button } from './ui/button'
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { headers } from 'next/headers';
// import {prismaClient} from "db/client";
function HomePage() {
  const {getToken} = useAuth();
  async function getValue(){
    const textArea = document.getElementById('textArea') as HTMLInputElement
    const  token = await getToken();
    console.log(textArea.value);
    const  response = await axios.post("http://localhost:8080/project",{prompt : textArea.value},{headers: {Authorization: `Bearer ${token}`}});
    console.log(response.data);
  }

     return (
        <div className='w-full h-full flex  items-center justify-around'>
          <div className='flex flex-col gap-2'>
            <Textarea id='textArea'  className='w-xl h-px' placeholder="Make a Bolt app ..." />
            <Button  onClick={()=>{getValue()}}>Submit</Button>         
          </div>
        </div>
      )
}
    
    export default HomePage