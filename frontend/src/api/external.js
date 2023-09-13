import axios from "axios";
const NEWS_API = process.env.REACT_APP_API_KEY;

const TESLA_API_STRING = `
https://newsapi.org/v2/everything?q=tesla&from=2023-08-11&sortBy=publishedAt&apiKey=${NEWS_API}`;
const CRYPTO_API_STRING = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en`;

export const fetchTesla = async () => {
  let response;
  try {
    response = await axios.get(TESLA_API_STRING);
    return response.data.articles.slice(0, 15);
  } catch (error) {
    throw error;
  }
};

export const fetchCrypto = async () => {
  let response;
  try {
    response = await axios.get(CRYPTO_API_STRING);
    response = response.data;
  } catch (error) {
    return error;
  }
  return response;
};
