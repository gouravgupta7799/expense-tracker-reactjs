import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import classes from './LoginSignup.module.css'
import { AuthAction } from '../../StoreContext/AuthSlice'
import { useDispatch } from 'react-redux'

export default function LoginSignup() {

  const dispatech = useDispatch()
  let navigation = useNavigate()
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [isLogInForm, setIsLogInForm] = useState(true);


  const submitFormHandler = async (event) => {
    event.preventDefault();

    let url;
    let enteredEmail;
    let enteredPassword;
    let confirmPassword;
    let AuthinactionDetails;
    try {

      if (!isLogInForm) {
        enteredEmail = emailRef.current.value
        enteredPassword = passwordRef.current.value
        confirmPassword = confirmPasswordRef.current.value

        if (enteredEmail && enteredPassword && confirmPassword) {
          if (enteredPassword !== confirmPassword) {
            let errorMessage = "Check your password again"
            throw new Error(errorMessage)
          }
          url = `http://localhost:4000/auth/signup`
          AuthinactionDetails = {
            email: enteredEmail,
            password: enteredPassword,
            confirmPassword: confirmPassword,
            returnSecureToken: true
          }
        } else {
          let errorMessage = "entered field Check again"
          throw new Error(errorMessage)
        }

      } else {
        url = `http://localhost:4000/auth/login`
        enteredEmail = emailRef.current.value
        enteredPassword = passwordRef.current.value

        AuthinactionDetails = {
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true
        }
      }

      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(AuthinactionDetails),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (res.ok) {
        const data = await res.json()
        console.log('User has successfully logged in')
        if (data.idToken && data.email) {
          dispatech(AuthAction.login({ idToken: data.idToken, email: data.email }))
        }
        navigation("/");

      } else {
        const data = await res.json()
        let errorMessage = data.error
        throw new Error(errorMessage)
      }
    }
    catch (err) {
      alert(err.message)
    }
    emailRef.current.value = null
    passwordRef.current.value = null
  }

  return (
    <div className={classes["formPage"]}>
      <form action="submit" onSubmit={submitFormHandler} className={classes['form']}>
        <h2>{isLogInForm ? 'Login' : 'Sign Up'}</h2>
        <label htmlFor="email">Email</label>
        <input id='useEmail' type='email' ref={emailRef} required />

        <label htmlFor="password" >Password</label>
        <input id='userPassword' type='password' ref={passwordRef} required />

        {!isLogInForm && <label htmlFor="confirmPassword" >confirmPassword</label>}
        {!isLogInForm && <input id='userconfirmPassword' type='password' ref={confirmPasswordRef} required />}

        {isLogInForm ? <button className={classes['button']}>Login</button> : <button className={classes['button']}>SignUp</button>}

        <div className={classes['tog']}>
          <span className={classes['toggle']} onClick={() => { setIsLogInForm(!isLogInForm) }}>{isLogInForm ? "Dont have an acount? signup" : "Have an account? Login"}</span>
          <Link to='/forgetPassword' className={classes['toggle']} style={{ textDecoration: 'none' }}>Forget Passsword</Link>
        </div>
      </form>

    </div>
  )
}
