import { useEffect, useState } from "react";
import Posts from "../Posts.jsx";

const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${baseURL}/post`).then((res) => {
      res.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => <Posts key={post._id} {...post} />)}
    </>
  );
}
