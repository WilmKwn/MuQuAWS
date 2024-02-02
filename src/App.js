import React from 'react';
import Youtube from 'react-youtube';
import './App.css';

import { WEBSOCKET, REST } from './Links';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      typed: "",
      username: "",
      links: [],
    }
    this.socketRef = React.createRef();
  }

  updateLinks = (items) => {
    let array = [];
    for (let i = 0; i < items.length; i++) {
      let data = {link: items[i].link, id: items[i].id};
      array.push(data);
    }
    array.sort((a,b) => a.id - b.id);
    this.setState({...this.state, links: array});
  }

  setupWebSocket() {
    const URL = WEBSOCKET;
    const socket = new WebSocket(URL);
    socket.addEventListener('message', (event) => {
      let raw = event.data;
      let items = JSON.parse(raw).Items;
      this.updateLinks(items);
    });
    this.socketRef = socket;
  }
  componentWillUnmount() {
    if (this.socketRef && this.socketRef.readyState === WebSocket.OPEN) {
      this.socketRef.close();
    }
  }

  fetchData = async() => {
    var requestInit = {
      method: 'GET',
    }
    const response = await fetch(REST, requestInit);
    const bodyJSON = await response.json();
    const body = (await JSON.parse(bodyJSON.body)).Items;

    this.updateLinks(body);
  }
  postData = async(link, id) => {
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
  deleteData = async(link, id) => {
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

  signIn() {
    const setUsername = async(e) => {
      e.preventDefault();
      this.setState({username:this.state.typed});
      this.setState({typed:""});
      await this.fetchData();
      await this.setupWebSocket();
    }
    return (
      <>
        <div>
          <h1>Enter Username</h1>
          <form onSubmit={setUsername}>
            <input value={this.state.typed} onChange={(e) => this.setState({typed:e.target.value})} />
            <button type="submit">ENTER</button>
          </form>
        </div>
      </>
    )
  }

  playLink() {
    const checkEnded = async(e) => {
      if (e.target.getPlayerState() === 0) {
        await this.deleteData(this.state.links[0].link, this.state.links[0].id);
      }
    }

    let id = this.state.links.length!==0 ? this.state.links[0].id : -1;
    let url = this.state.links.length!==0 ? (String)(this.state.links[0].link) : "";
    let videoId = url.substring(url.indexOf("=")+1);

    const opts = {
      playerVars: {
        autoplay: 1,
      }
    }
    return (
      <div>
        <p>{url}</p>
        {this.state.links.length>0 ? <Youtube key={id} videoId={videoId} opts={opts} onStateChange={(e) => checkEnded(e)}/> : <h1>Enter something in the queue...🙏</h1>}
      </div>
    )
  }
  printSong(params) {
    return (
      <div>
        <p>{params.url.link}</p>
      </div>
    )
  }

  playRoom() {
    const setLink = async(e) => {
      e.preventDefault();
      if ((String)(this.state.typed).indexOf("=") !== -1) {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const id = year + month + day + hours + minutes + seconds;

        await this.postData(this.state.typed, parseInt(id));
        this.setState({typed:""});
      }
    }
    return (
      <>
        <div>
          <h1>Enter Youtube Link</h1>
        </div>
        <div>
          <form onSubmit={setLink}>
            <input value={this.state.typed} onChange={(e) => this.setState({typed:e.target.value})} />
            <button type="submit">Play</button>
          </form>
        </div>
        <div>
          {this.playLink()}
          {this.state.links.slice(1).map(link => <this.printSong key={link.id} list={this.state.links} url={link}/>)}
        </div>
      </>
    )
  }
  
  render() {
    return (
      <section>
        {this.state.username==="" ? this.signIn() : this.playRoom()}
      </section>
    );
  }
}

export default App;