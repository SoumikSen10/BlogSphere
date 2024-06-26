import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Post = ({ _id, title, summary, content, cover, createdAt, author }) => {
  return (
    <div className="post">
      <div className="image">
        <Link to={`http://localhost:5173/post/${_id}`}>
          <img src={"http://localhost:8080/" + cover} alt="" />
        </Link>
      </div>

      <div className="texts">
        <Link to={`http://localhost:5173/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <span className="author">{author.username}</span>
          <time>{format(new Date(createdAt), "MMM d, yyyy HH:mm")}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
};

export default Post;
