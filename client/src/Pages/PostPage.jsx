import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../context/UserContext";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/post/${id}`);
        if (response.ok) {
          const postData = await response.json();
          setPostInfo(postData);
        } else {
          throw new Error("Failed to fetch post");
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!postInfo) return null;

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{format(new Date(postInfo.createdAt), "MMM d, yyyy HH:mm")}</time>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link
            className="edit-btn"
            to={`http://localhost:5173/edit/${postInfo._id}`}
          >
            Edit this post
          </Link>
        </div>
      )}
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link
            className="edit-btn"
            to={`http://localhost:5173/delete/${postInfo._id}`}
          >
            Delete this post
          </Link>
        </div>
      )}
      <div className="image">
        <img src={`http://localhost:8080/${postInfo.cover}`} alt="" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
};

export default PostPage;
