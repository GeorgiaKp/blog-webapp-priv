import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css"

export default function Sidebar() {
	const [cats, setCats] = useState([])

	useEffect(() => {
		const getCats = async() => {
			const res = await axios.get("/categories")
			setCats(res.data)
		}
		getCats()
	},[])
	return (
		<>
			<div className="sidebar">
			
				<div className="sidebarItem">
					<span className="sidebarTitle">ABOUT ME</span>
					<img src="https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/slideshows/is_my_cat_normal_slideshow/1800x1200_is_my_cat_normal_slideshow.jpg" alt="" />
					<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
					</p>
				</div>
				<div className="sidebarItem">
					<span className="sidebarTitle">CATEGORIES</span>
					<ul className="sidebarList">
						{cats.map((c) =>(
							<Link className="link" to={`/?cat=${c.name}`} >
							<li>{c.name}</li>
							</Link>
						))}
					</ul>
				</div>

			</div>
		</>
	)
}