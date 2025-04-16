import react, {useState, useEffect} from "react";
import queryString from "query-string";
import io from "socket.io-client"

import Messages from "../Messages/Messages"

import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import "./Chat.css";

let socket;

const Chat = () =>{
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const ENDPOINT = "localhost:5000"

    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket=io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit("join", {name, room}, (error) => {
            alert(error);
            if(error) {
                navigate("/");
            }
        });

        return () => {
            socket.emit("disconnect");

            socket.off();
        }

    },[ENDPOINT, location.search])

    useEffect(() => {
        socket.on("message",(message) => {
            setMessages([...messages, message]);
        })
    },[messages]);

    const sendMessage = (event) =>{
        event.preventDefault();
        if(message) {
            socket.emit("sendMessage",message, () => {
                setMessage("");
            })
        }
    }

    console.log(message,messages);

    return (
        <div>
            <Messages messages={messages} />
        <div className="outerContainer">
            <div className="container">
                <input type="text" value={message} onChange={(event)=>setMessage(event.target.value)}
                onKeyPress={event => event.key === "Enter" ? sendMessage(event) : null}
                />
            </div>
        </div>
        </div>
    )
}

export default Chat;