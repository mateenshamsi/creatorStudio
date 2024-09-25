import React from 'react'
import {signIn} from 'next-auth/react'  

function Login() {
  return (
    <button className='text-white' onClick={()=>signIn('google')}>Login</button>   
  )
}

export default Login
