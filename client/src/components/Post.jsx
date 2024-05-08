import React from "react";

const Post = () => {
  return (
    <div className="post">
      <div className="image">
        <img
          src="https://techcrunch.com/wp-content/uploads/2024/05/Automate-Blog-Key-Image.jpg?w=1390&crop=1"
          alt=""
        />
      </div>

      <div className="texts">
        <h2>
          Alphabet-owned Intrinsic incorporates Nvidia tech into robotics
          platform
        </h2>
        <p className="info">
          <a className="author">Soumik Sen</a>
          <time>2023-01-06 16:45</time>
        </p>
        <p className="summary">
          The first bit of news out of the Automate conference this year arrives
          by way of Alphabet X spinout Intrinsic. The firm announced at the
          Chicago event on Monday that it is incorporating a number of Nvidia
          offerings into its Flowstate robotic app platform. That includes Isaac
          Manipulator, a collection of foundational models designed to create
          workflows for robot arms. The offering launched at GTC back in March,
          with some of the biggest names in industrial automation already on
          board. The list includes Yaskawa, Solomon, PickNik Robotics, Ready
          Robotics, Franka Robotics and Universal Robots.
        </p>
      </div>
    </div>
  );
};

export default Post;
