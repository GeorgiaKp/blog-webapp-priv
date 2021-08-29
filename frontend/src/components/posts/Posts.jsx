import React from "react";
import Post from "../post/Post";
import "./posts.css";

export default function Posts({ posts }) {
  return (
    <div className="posts">
      {posts.map((p) => (
        <span key={`key-${p._id}`}>
          <Post post={p} />
        </span>
      ))}
    </div>
  );
}
