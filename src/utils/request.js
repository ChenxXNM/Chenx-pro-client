import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8989/admin",
  timeout: 5000
})

export default instance;
