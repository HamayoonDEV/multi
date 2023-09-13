import React from "react";
import styles from "./Blog.module.css";
import { useEffect, useState } from "react";
import { getAllBlogs } from "../../api/internal";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    (async function getBlog() {
      const response = await getAllBlogs();
      if (response.status === 200) {
        setBlogs(response.data.blogs);
      }
    })();
  }, []);
  return (
    <div className={styles.main}>
      {blogs.map((blog) => (
        <div className={styles.card}>
          <h1>{blog.title}</h1>
          <span>{blog.createdAt}</span>
          <img src={blog.photopath} />
          <p>{blog.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Blog;
