import { Link } from 'react-router-dom'
import { useRef, useContext } from 'react'
import axios from "axios";
import { Context } from "../../context/Context"
import "./login.css";

export default function Login() {

  const userRef = useRef()
  const passwordRef = useRef()
  const { dispatch, isFetching} = useContext(Context)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({type: "LOGIN_START"})
    try{
      const res = await axios.post("/auth/login", {
        username: userRef.current.value,
        password: passwordRef.current.value
      })
      dispatch({type: "LOGIN_SUCCESS", payload:res.data})
    } catch(err) {
      dispatch({type: "LOGIN_FAILURE"})
    }
  }

  // console.log(user)
  // console.log(isFetching)




  const handleSubmit = (e) => {
    e.preventDefault()
  }


  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <form className="loginForm" onSubmit={handleSubmit}>

        <label>Username</label>
        <input className="loginInput" 
          type="text" 
          placeholder="Enter your username."
          ref={userRef}
        />

        <label>Email</label>
        <input className="loginInput" type="email" placeholder="Enter your email..." />
        <label>Password</label>
        <input 
          className="loginInput" 
          type="password" 
          placeholder="Enter your password."
          ref={passwordRef}
        />

        <button className="loginButton" type="submit" disabled={isFetching}>Login</button>

        <button className="loginButton">Login</button>

      </form>
        <button className="loginRegisterButton" type="submit">
          <Link className="link" to="/register">Register</Link>
        </button>
    </div>
  );
}
