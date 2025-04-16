import react from "react";

const Message = ({message}) => {
    return (
        <p>{`${message.user}:${message.text}`}</p>
    )
}

export default Message;