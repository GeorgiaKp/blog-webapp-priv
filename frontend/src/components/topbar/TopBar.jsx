import { Link } from 'react-router-dom'
import {Context} from "../../context/Context"
import {useContext} from "react"
import "./topbar.css"

export default function TopBar() {
	const { user, dispatch } = useContext(Context);
  	const PF = "http://localhost:13371/images/"

	  const handleLogout = () => {
	    dispatch({ type: "LOGOUT" });
	  }

	return (
		<div className="top">
			<div className="topLeft">HELLO!
				<i class="topIcon fas fa-paw"></i>
			</div>
			<div className="topCenter">
				<ul className="topList">
					<li><Link className="link" to="/">HOME</Link></li>
					<li><Link className="link" to="/">ABOUT</Link></li>
					<li><Link className="link" to="/">CONTACT</Link></li>
					<li><Link className="link" to="/write">WRITE</Link></li>
					<li onClick={handleLogout}>
						{user && "LOGOUT"}
					</li>
				</ul>
			</div>
			<div className="topRight">
			{
				user ? (<Link to="/settings">
						<img src={PF+user.profilePic} alt="" />
						</Link>
				) : (
					<ul className="topList">
						<li><Link className="link" to="/login">LOGIN</Link></li>
						<li><Link className="link" to="/register">REGISTER</Link></li>
					</ul>
				)
			}
				
				<i className="topSearchIcon fa fa-search"></i>
			</div>
		</div>
	)
}