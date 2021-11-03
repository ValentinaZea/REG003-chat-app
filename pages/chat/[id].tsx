import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState, useContext, useEffect } from "react";
import CommentChat from "../../components/Comment/Comment";
import HeaderChat from "../../components/Header_chat/HeaderChat";
import SendMessage from "../../components/SendMessage/SendMessage";
import { SocketContext } from "../../contexts/socketContext";
import { getChannelMessages } from "../../services/message";

const Home: NextPage = () => {
  const [messages, setMessages] = useState<Array<any>>([]);
  const token = localStorage.getItem("token");
  const { query } = useRouter();
  const { socket, setSocket } = useContext(SocketContext);
  let uid: any;

  if (token) {
    const payload = token.split(".")[1];
    const decodedPayload = window.atob(payload);
    const payloadJSON = JSON.parse(decodedPayload);
    uid = payloadJSON.uid;
  }

  useEffect(() => {
    token
      ? getChannelMessages(token, Number(query.id)).then((res) => {
          console.log(res.content);
          setMessages(res.content);
        })
      : "No token provided";

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("send-message", (payload: any) => {
      if (payload.channelId === Number(query.id)) {
        messages.push(payload);
        console.log(payload);
        setMessages([...messages]);
        console.log(messages);
      }
    });
  });

  return (
    <div className="container">
      <HeaderChat
        token={token}
        channelId={Number(query.id)}
        uid={Number(uid)}
        channelName={String(query.channel)}
        channelImage={String(query.channelImage)}
      ></HeaderChat>
      {messages[0] ? (
        messages.map(({ user, id, body, attachment, createdAt }) => {
          return (
            <CommentChat
              key={id}
              user={user}
              body={body}
              time={createdAt}
              attachment={attachment}
              token={token ? token : ""}
            ></CommentChat>
          );
        })
      ) : (
        <p>you dont have any message</p>
      )}

      <SendMessage
        channelId={Number(query.id)}
        uid={Number(uid)}
        username={String(query.username)}
        userImage={String(query.userImage)}
      ></SendMessage>
    </div>
  );
};

export default Home;
