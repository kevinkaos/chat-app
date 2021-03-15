import React, { useEffect, useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import firebase from "../../config/firebase";
import moment from "moment";

const Messages = ({ currentChannel, currentUser, prevChannelId }) => {
  const messagesRef = firebase.database().ref("messages");
  const [allMessages, setAllMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentChannel) {
      if (currentChannel.id !== prevChannelId) {
        setAllMessages([]);
        messagesRef.child(currentChannel.id).on("child_added", (snap) => {
          setAllMessages((prevState) => [...prevState, snap.val()]);
          setMessagesLoading(false);
        });
      } else {
        messagesRef.child(currentChannel.id).on("child_added", (snap) => {
          setAllMessages((prevState) => [...prevState, snap.val()]);
          setMessagesLoading(false);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel.id]);

  const isOwnMessage = (message) => {
    return currentUser.uid === message.user.id ? "message__self" : "";
  };

  const convertTimestampToDate = (timestamp) => moment(timestamp).fromNow();

  return (
    <>
      <MessagesHeader currentChannel={currentChannel} />

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
                    <Comment.Text>{message.content}</Comment.Text>
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
