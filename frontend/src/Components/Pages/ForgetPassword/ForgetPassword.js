import React, { useRef } from 'react'
import classes from './ForgetPassword.module.css'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ForgetPassword() {

  const history = useNavigate()

  const emailInputRef = useRef()

  const isTheme = useSelector((state) => state.authRdx.isDarkMode)
  const idToken = useSelector(state => state.authRdx.idToken);

  const submitHandler = async (e) => {
    e.preventDefault()

    const enteredEmail = emailInputRef.current.value

    const res = await fetch(`http://localhost:4000/password/forgotpassword`, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken
      }
    })

    const data = await res.json()
    console.log(data)
    if (res.ok) {
      alert('Password changing link send to your mail successfully')
      console.log(data)
      setTimeout(() => {
        history('/')
      }, 2000)
    }
    else {
      alert(data.error.message)
    }

  }

  return (
    <div>  <form className={`${classes.form} ${isTheme ? classes.dark : ''}`} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='email' style={isTheme ? { color: 'white' } : { color: 'black' }}>Email Id</label>
        <input type='email' id='email' ref={emailInputRef} />
      </div>
      <div className={`${classes.action} ${isTheme ? classes.dark : ''}`}>
        <button>Change Password</button>
      </div>
    </form></div>
  )
}
