import "./singlepost.css"
import { Link } from 'react-router-dom'
import { useLocation } from "react-router"
import { useContext, useEffect, useState } from "react"
import axios from "axios"

export default function SinglePost() {
	const location = useLocation()
	const path = location.pathname.split("/")[2]
	const [post, setPost] = useState({});
	
	useEffect(() => {
		const getPost = async () =>{
			const res = await axios.get("/posts/"+path)
			setPost(res.data)
		}
		getPost()
	},[path])

	return (
		<div className="singlePost">
			<div className="singlePostWrapper">
				{post.photo &&
					<img className="singlePostImg" src={post.photo} alt="" />
				}
				<h1 className="singlePostTitle">{post.title}
					<div className="singlePostEdit">
						<i className="singlePostIcon far fa-edit"></i>
						<i className="singlePostIcon far fa-trash-alt"></i>
					
					</div>
				</h1>
				<div className="singlePostInfo">
					<span className="singlePostAuthor">Author: <Link className="link" to={`/?user=${post.username}`}><b>{post.username}</b></Link>
					</span>
					<span className="singlePostDate"><i>{new Date(post.createdAt).toDateString()}</i></span>
				</div>
				<p className="singlePostDesc">
					{post.desc}
				</p>
			</div>
		</div>
	)
}