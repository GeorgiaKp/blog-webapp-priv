import React from "react";
import { Link } from "react-router-dom";
import "./post.css";

export default function Post({ post }) {
  const PF = "http://localhost:13371/images/";
  return (
    <div className="post">
      {post.photo && <img className="postImg" src={PF + post.photo} alt="postimg" />}
      <div className="postInfo">
        <div className="postCats">
          {post.categories.map((c) => (
            <span className="postCat" key={`key-${c}`}>{c}</span>
          ))}
        </div>
      </div>
      <Link className="link" to={`/post/${post._id}`}>
        <span className="postTitle">{post.title}</span>
      </Link>
      <hr />
      <span className="postDate">
        {new Date(post.createdAt).toDateString()}
      </span>
      <p className="postDesc">{post.desc}</p>
    </div>
  );
}
