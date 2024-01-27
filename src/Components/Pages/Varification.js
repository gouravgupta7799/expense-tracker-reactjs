import React, { useContext, useState } from "react";
import classes from './Varification.module.css'
import AuthContext from "../StoreContext/Auth-Context";
import { useNavigate } from "react-router-dom";


const id = ''

const Verifaction = () => {
  const authCtx = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const history = useNavigate()



  const submitHandler = async (event) => {
    event.preventDefault();

    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${id}`, {
      method: 'POST',
      body: JSON.stringify({
        requestType: "VERIFY_EMAIL",
        idToken: authCtx.idToken,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    if (response.ok) {
      if (data.email === email) {
        history("/welcome")
      }
    }

    if (!response.ok) {
      alert(data.error.message)
    }

  }
  return (<>
    <form onSubmit={submitHandler} className={classes['form']} >
      <input type="email" className={classes['form_input']} placeholder="email" onChange={(e) => { setEmail(e.target.value) }} value={email} />
      <button className={classes['button']}>Verify</button>
    </form>
  </>)
}
export default Verifaction