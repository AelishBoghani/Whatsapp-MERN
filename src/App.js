import "./App.css";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "./axios";


function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    axios.get("/messages/sync").then((responce) => {
      setMessages(responce.data);
    });
  }, []);
  useEffect(() => {
    const pusher = new Pusher("f7d0ea5289e4d74a033a", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessage) => {
      setMessages([...messages, newMessage]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);
  console.log(messages);
  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
