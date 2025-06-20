import axios from "axios";

let dmsApi = axios.create({
  baseURL: "https://demodms.aitalkx.com/webapi/",
  //baseURL: "https://100.78.102.25:5001/",
  //baseURL: 'https://localhost:44325/',
  headers: {
    "Content-Type": "application/json",
  },
});

export { dmsApi };
