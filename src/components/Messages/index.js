import React, { useEffect, useState } from "react";
import { Segment, Comment, Image } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import firebase from "../../config/firebase";
import moment from "moment";

const Messages = ({ currentChannel, currentUser, prevChannelId }) => {
  const messagesRef = firebase.database().ref("messages");
  const [allMessages, setAllMessages] = useState([]);
  const [numUniqueUsers, setNumUniqueUsers] = useState();

  useEffect(() => {
    setNumUniqueUsers(countUniqueUsers(allMessages));
  }, [allMessages]);

  useEffect(() => {
    const setNewMessages = () => {
      messagesRef.child(currentChannel.id).on("child_added", (snap) => {
        setAllMessages((prevState) => [...prevState, snap.val()]);
      });
    };

    if (currentUser && currentChannel) {
      if (currentChannel.id !== prevChannelId) {
        setAllMessages([]);
        setNewMessages();
      } else {
        setNewMessages();
      }
    }

    return () => {
      messagesRef.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel.id]);

  const countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, cur) => {
      if (!acc.includes(cur.user.name)) {
        acc.push(cur.user.name);
      }
      return acc;
    }, []);

    return `${uniqueUsers.length} User${uniqueUsers.length > 1 ? "s" : ""}`;
  };

  const isImage = (message) =>
    message.hasOwnProperty("image") && !message.hasOwnProperty("content");

  const isOwnMessage = (message) => {
    return currentUser.uid === message.user.id ? "message__self" : "";
  };

  const convertTimestampToDate = (timestamp) => moment(timestamp).fromNow();

  return (
    <>
      <MessagesHeader
        numUniqueUsers={numUniqueUsers}
        currentChannel={currentChannel}
      />

      <Segment>
        <Comment.Group className="messages" style={{ maxWidth: 1500 }}>
          {allMessages.length
            ? allMessages.map((message, i) => (
                <Comment key={message.timestamp + i}>
                  <Comment.Avatar src={message.user.avatar} />
                  <Comment.Content className={isOwnMessage(message)}>
                    <Comment.Author as="a">{message.user.name}</Comment.Author>
                    <Comment.Metadata>
                      <div>{convertTimestampToDate(message.timestamp)}</div>
                    </Comment.Metadata>
                    {isImage(message) ? (
                      <Image src={message.image} className="message__image" />
                    ) : (
                      <Comment.Text>{message.content}</Comment.Text>
                    )}
                  </Comment.Content>
                </Comment>
              ))
            : null}
        </Comment.Group>
      </Segment>

      <MessagesForm
        messagesRef={messagesRef}
        currentUser={currentUser}
        currentChannel={currentChannel}
      />
    </>
  );
};

export default Messages;
