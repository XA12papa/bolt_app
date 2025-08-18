import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, SignUpButton, UserButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from './ui/button'
import { Sign } from 'crypto'

function AppBar() {
  return (
    <header className='mt-2 px-10 w-full z-[999]'>
      <SignedOut>

        <SignInButton/>
        <SignUpButton>
            <Button>Sign Up</Button>
        </SignUpButton>
      
      </SignedOut>

      <div className='flex w-full justify-between items-start'>

        <div className='logo text-xl font-extrabold'> 
            Bolt
        </div>

      <SignedIn>
        <UserButton/>
      </SignedIn>
      </div>
    </header>
  )
}

export default AppBar