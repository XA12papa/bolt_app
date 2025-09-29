import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, SignUpButton, UserButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from './ui/button'

function AppBar({ className = "" }: { className?: string }) {
  return (
    <div className={` px-10 w-full  absolute top-0 mt-3 z-[500]`}>

      <div className='flex w-full h-full justify-between items-start'> 

            <div className='logo text-2xl font-extrabold text-white'> 
                Bolt
            </div>

            <div className='menue flex justify-center items-center   gap-[3rem] w-5/6 '> 
              <button className='  text-md border-none bg-transparent text-gray-400  hover:text-white transition-all ease-in-out   text-bold font-roboto'>Community</button>
              <button className=' text-md border-none bg-transparent text-gray-400  hover:text-white transition-all ease-in-out   text-bold font-roboto'>Enterprise</button>
              <button className=' text-md border-none bg-transparent text-gray-400  hover:text-white transition-all ease-in-out   text-bold font-roboto'>Resources</button>
              <button className=' text-md border-none bg-transparent text-gray-400  hover:text-white transition-all ease-in-out   text-bold font-roboto'>careers</button>
            </div>

            <div className='authentication '>

                <SignedOut >
                    <div className='flex gap-3 text-lg font-semibold font-roboto' >
                        <SignInButton>
                            <Button className='bg-purple-500 hover:bg-purple-600 font-roboto                   transition-all duration-200 ease-in-out  text-md'>Sign In</Button>
                        </SignInButton>
                    
                        <SignUpButton > 
                            <Button className='text-md bg-blue-400 hover:bg-blue-500                   transition-all duration-200 ease-in-out  font-roboto'> Sign up</Button>
                        </SignUpButton>
                    </div>


                </SignedOut>

                <SignedIn>
                      <UserButton/>
                </SignedIn>
            </div>


            

      </div>
    </div>
  )
}

export default AppBar