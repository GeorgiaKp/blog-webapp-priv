import { Link } from 'react-router-dom'
import "./login.css";

export default function Login() {

  const userRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <form className="loginForm" onSubmit={handleSubmit}>
        <label>Email</label>
        <input className="loginInput" type="email" placeholder="Enter your email..." />
        <label>Password</label>
        <input 
          className="loginInput" 
          type="password" 
          placeholder="Enter your password."
          ref={passwordRef}
        />
        <button className="loginButton">Login</button>
      </form>
        <button className="loginRegisterButton" type="submit">
          <Link className="link" to="/register">Register</Link>
        </button>
    </div>
  );
}
