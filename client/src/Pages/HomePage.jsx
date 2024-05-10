import React, { useEffect, useState } from "react";
import Post from "../components/Post";

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/post").then((response) => {
      response
        .json()
        .then((posts) => {
          console.log(posts);
          setPosts(posts);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
    });
  }, []);

  return <>{posts.length > 0 && posts.map((post) => <Post {...post} />)}</>;
};

export default HomePage;
