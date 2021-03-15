import React, { useState } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from "../../config/firebase";

const MessagesForm = ({ messagesRef, currentChannel, currentUser }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const createMessage = () => {
    const userMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      content: message,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    };

    return userMessage;
  };

  const sendMessage = () => {
    if (message) {
      setLoading(true);
      messagesRef
        .child(currentChannel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setErrors([]);
          setMessage("");
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setErrors((prevState) => [...prevState, err]);
          setLoading(false);
        });
    } else {
      setErrors((prevState) => [
        ...prevState,
        { message: "Please add a message" },
      ]);
    }
  };

  return (
    <Segment className="message__form">
      <Input
        fluid
        value={message}
        name="message"
        label={<Button icon={"add"} />}
        labelPosition="right"
        placeholder="Write your message"
        style={{ marginBottom: "0.7rem" }}
        onChange={handleChange}
        error={errors.length ? true : false}
      />
      <Button.Group icon widths="2">
        <Button
          disabled={loading || message === ""}
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          onClick={() => sendMessage()}
        />
        <Button
          disabled={loading}
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
    </Segment>
  );
};

export default MessagesForm;
