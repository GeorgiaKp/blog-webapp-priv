import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../../context/Context';
import { Logout } from "../../context/Actions";
import './topbar.scss';

export default function TopBar() {
  const { user, dispatch } = useContext(Context);
  const PF = "http://localhost:13371/images/";

  const handleLogout = () => {
    dispatch(Logout());
  };

  return (
    <div className="top">
      <div className="topLeft">
        HELLO!
        <i className="topIcon fas fa-paw" />
      </div>
      <div className="topCenter">
        <ul className="topList">
          <li><Link className="link" to="/">HOME</Link></li>
          <li><Link className="link" to="/">ABOUT</Link></li>
          <li><Link className="link" to="/">CONTACT</Link></li>
          <li><Link className="link" to="/write">WRITE</Link></li>
          <li onClick={handleLogout}>
            {user && 'LOGOUT'}
          </li>
        </ul>
      </div>
      <div className="topRight">
        {
			user ? (
  <Link to="/settings">
    <img src={user.profilePic ? PF + user.profilePic : PF + "default.jpeg"} alt="" />
  </Link>
			) : (
  <ul className="topList">
    <li><Link className="link" to="/login">LOGIN</Link></li>
    <li><Link className="link" to="/register">REGISTER</Link></li>
  </ul>
			)
			}

        <i className="topSearchIcon fa fa-search" />
      </div>
    </div>
  );
}
