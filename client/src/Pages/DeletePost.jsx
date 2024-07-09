import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeletePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const deletePost = async () => {
      try {
        const response = await fetch(`http://localhost:8080/post/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (response.ok) {
          setRedirect(true);
        } else {
          throw new Error("Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    };

    deletePost();
  }, [id]);

  useEffect(() => {
    if (redirect) {
      navigate("/");
    }
  }, [redirect, navigate]);

  return (
    <div>
      <h1>Deleting Post...</h1>
      {/* Optionally, add a loading indicator or message */}
    </div>
  );
};

export default DeletePost;
