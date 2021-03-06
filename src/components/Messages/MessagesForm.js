import React, { useState, useEffect } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from "../../config/firebase";
import FileModal from "./FileModal";
import { v4 as uuidv4 } from "uuid";
import ProgressBar from "./ProgressBar";

const MessagesForm = ({
  currentChannel,
  currentUser,
  isPrivateChannel,
  getMessagesRef,
}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [modal, setModal] = useState(false);
  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const storageRef = firebase.storage().ref();

  const [uploadState, setUploadState] = useState({
    uploadState: "",
    uploadTask: null,
    percentageUploaded: 0,
  });

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const createMessage = (fileUrl = null) => {
    const userMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    };

    if (fileUrl) {
      userMessage["image"] = fileUrl;
    } else {
      userMessage["content"] = message;
    }

    return userMessage;
  };

  useEffect(() => {
    if (uploadState && uploadState.uploadTask !== null) {
      uploadState.uploadTask.on(
        "state_changed",
        (snap) => {
          const percentageUploaded = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );
          setUploadState((prevState) => ({ ...prevState, percentageUploaded }));
        },
        (err) => {
          setErrors((prevState) => [...prevState, err]);
          setUploadState((prevState) => ({
            ...prevState,
            uploadState: "error",
            uploadTask: null,
          }));
        },
        () => {
          uploadState.uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              sendFileMessage(downloadURL, getMessagesRef(), currentChannel.id);
            })
            .catch((err) => {
              setErrors((prevState) => [...prevState, err]);
              setUploadState((prevState) => ({
                ...prevState,
                uploadState: "error",
                uploadTask: null,
              }));
            });
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadState.uploadTask]);

  const sendFileMessage = (url, ref, path) => {
    ref
      .child(path)
      .push()
      .set(createMessage(url))
      .then(() => {
        setUploadState((prevState) => ({ ...prevState, uploadState: "done" }));
      })
      .catch((err) => {
        console.log(err);
        setErrors((prevState) => [...prevState, err]);
      });
  };

  const uploadFile = (file, metadata) => {
    const filePath = `${getPath()}/${uuidv4()}.jpg`;
    setUploadState((prevState) => ({
      ...prevState,
      uploadState: "uploading",
      uploadTask: storageRef.child(filePath).put(file, metadata),
    }));
  };

  const getPath = () => {
    if (isPrivateChannel) {
      return `chat/private-${currentChannel.id}`;
    } else {
      return `chat/public`;
    }
  };

  const sendMessage = () => {
    if (message) {
      setLoading(true);
      getMessagesRef()
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
        placeholder="Send"
        style={{ marginBottom: "0.7rem" }}
        onChange={handleChange}
        onKeyPress={handleKeyDown}
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
          disabled={loading || uploadState.uploadState === "uploading"}
          onClick={() => setModal(true)}
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
      <FileModal
        modal={modal}
        closeModal={() => setModal(false)}
        uploadFile={uploadFile}
      />
      <ProgressBar
        uploadState={uploadState.uploadState}
        percentageUploaded={uploadState.percentageUploaded}
      />
    </Segment>
  );
};

export default MessagesForm;
