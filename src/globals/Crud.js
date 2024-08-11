import axios from 'axios';
import { ENDPOINT } from '../Links';

export const fetchData = async(table) => {
    const endpoint = ENDPOINT + (table === "muqu_users" ? "users" : (table === "muqu_rooms" ? "rooms" : "links"));
    
    var requestInit = {
        method: 'GET',
    }
    const url = `${endpoint}?table=${table}`;
    
    const response = await axios.get(url, requestInit);
    const body = response.data.data;
    return body;
}

export const postData = async(arg, table) => {
    const endpoint = ENDPOINT + (table === "muqu_users" ? "users" : (table === "muqu_rooms" ? "rooms" : "links"));

    var requestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "link": arg.link, "id": arg.id, "table": table, "password": arg.password, "room": arg.room })
    }
    const response = await axios.post(endpoint, requestInit);
    console.log("POST: ", await response);
}

export const deleteData = async(arg, table) => {
    const endpoint = ENDPOINT + (table === "muqu_users" ? "users" : (table === "muqu_rooms" ? "rooms" : "links"));

    console.log(arg);
    var requestInit = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "link": arg.link, "id": arg.id, "table": table, "room": arg.room })
    }
    const response = await fetch(endpoint, requestInit);
    console.log("Delete link: ", await response.json());
}