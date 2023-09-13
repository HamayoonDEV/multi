import React from "react";
import { fetchTesla } from "../../api/external";
import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import Loading from "../Loading/Loading";

const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    (async function getArticles() {
      try {
        const response = await fetchTesla();
        setArticles(response);
      } catch (error) {
        console.log("Articles not found", error);
      }
    })();
  }, []);
  const handleFull = (url) => {
    window.open(url, "_blank");
  };
  if (articles.length == 0) {
    return <Loading text={"Loading Home Pages"} />;
  }
  return (
    <div className={styles.main}>
      <h1>Articles</h1>
      <div className={styles.grid}>
        {articles.map((article) => (
          <div
            className={styles.card}
            key={article.title}
            onClick={() => handleFull(article.url)}
          >
            <img src={article.urlToImage} />
            <h1>{article.title}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
