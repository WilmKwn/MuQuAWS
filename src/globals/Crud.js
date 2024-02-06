import { REST } from '../Links';

export const fetchData = async() => {
    var requestInit = {
        method: 'GET',
    }
    const response = await fetch(REST, requestInit);
    const bodyJSON = await response.json();
    const body = (await JSON.parse(bodyJSON.body)).Items;

    return body;
}
export const postData = async(link, id) => {
    var requestInit = {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({"link": link, "id": id})
    }
    const response = await fetch(REST, requestInit);
    console.log("POST: ", await response.json());
}
export const deleteData = async(link, id) => {
    var requestInit = {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({"link": link, "id": id})
    }
    const response = await fetch(REST, requestInit);
    console.log("Delete link: ", await response.json());
}