import axios from "axios";

// todo from configuration
const url = 'http://localhost:8000';

export const fetchMindMap = id =>
    axios(`${url}/${id}`, {validateStatus: false})

export const saveMindMap = (id, data) =>
    axios.put(`${url}/${id}`, data, {headers: {'content-type': 'application/json'}});
