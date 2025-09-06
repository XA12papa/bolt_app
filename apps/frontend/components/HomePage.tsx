"use client"
import React from 'react'
import { Textarea } from './ui/textarea'    
import { Button } from './ui/button'
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';


function HomePage() {
  const {getToken} = useAuth();
  async function getValue(){
    const textArea = document.getElementById('textArea') as HTMLInputElement
    const  token = await getToken();
    console.log(textArea.value);
    
    const  response = await axios.post("http://localhost:8082/project",{prompt : textArea.value},{headers: {Authorization: `Bearer ${token}`}});

    console.log(response);
    if(response.status === 200){
        // Make a call to llm and generate the required files 
        const llmResposne2 = await axios.post("http://localhost:8080/prompt", { prompt : textArea.value, projectId: response.data.id })

        console.log(llmResposne2.data)
        
    }
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