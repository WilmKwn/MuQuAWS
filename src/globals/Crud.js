import { REST } from '../Links';

export const fetchData = async(table) => {
    var requestInit = {
        method: 'GET',
    }
    const url = `${REST}?table=${table}`;

    const response = await fetch(url, requestInit);

    const bodyJSON = await response.json();
    const body = bodyJSON.Items;

    return body;
}

export const postData = async(arg, table) => {
    var requestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "link": arg.link, "id": arg.id, "table": table, "password": arg.password, "room": arg.room })
    }
    const response = await fetch(REST, requestInit);
    console.log("POST: ", await response.json());
}

export const deleteData = async(arg, table) => {
    console.log(arg);
    var requestInit = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "link": arg.link, "id": arg.id, "table": table, "room": arg.room })
    }
    const response = await fetch(REST, requestInit);
    console.log("Delete link: ", await response.json());
}