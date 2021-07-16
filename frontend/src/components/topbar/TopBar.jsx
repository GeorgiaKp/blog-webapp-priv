import { Link } from 'react-router-dom'
import "./topbar.css"

export default function TopBar() {
	const user = true;
	return (
		<div className="top">
			<div className="topLeft">Hello!</div>
			<div className="topCenter">
				<ul className="topList">
					<li className="topListItem">
						<Link className="link" to="/">HOME</Link>
					</li>
					<li className="topListItem"><Link className="link" to="/">ABOUT</Link></li>
					<li className="topListItem"><Link className="link" to="/">CONTACT</Link></li>
					<li className="topListItem"><Link className="link" to="/write">WRITE</Link></li>
					<li className="topListItem">
						{user && "LOGOUT"}
					</li>
				</ul>
			</div>
			<div className="topRight">
			{
				user ? ( 
					<img className="topImg" src="https://static.scientificamerican.com/sciam/cache/file/32665E6F-8D90-4567-9769D59E11DB7F26_source.jpg?w=590&h=800&7E4B4CAD-CAE1-4726-93D6A160C2B068B2" alt="img" />
				) : (
					<ul className="topList">
						<li className="topListItem">
							<Link className="link" to="/login">LOGIN</Link>
						</li>
						<li className="topListItem">
						<Link className="link" to="/register">REGISTER</Link>
						</li>
					</ul>
				)
			}
				
				<i className="topSearchIcon fa fa-search"></i>
			</div>
		</div>
	)
}