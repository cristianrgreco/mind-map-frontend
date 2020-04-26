import axios from "axios";

const URL = process.env.REACT_APP_SERVER_URL;

export const fetchMindMap = (id) => axios(`${URL}/maps/${id}`, { validateStatus: false });

export const saveMindMap = (id, data) =>
  axios.put(`${URL}/maps/${id}`, data, { headers: { "content-type": "application/json" } });
