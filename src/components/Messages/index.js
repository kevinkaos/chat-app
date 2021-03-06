import React, { useEffect, useState, useRef } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import firebase from "../../config/firebase";
import Message from "./Message";

const Messages = ({
  currentChannel,
  currentUser,
  prevChannelId,
  isPrivateChannel,
}) => {
  const privateMessagesRef = firebase.database().ref("privateMessages");
  const messagesRef = firebase.database().ref("messages");
  const [allMessages, setAllMessages] = useState([]);
  const [numUniqueUsers, setNumUniqueUsers] = useState();
  const [queryResults, setQueryResults] = useState([]);
  const [searchState, setSearchState] = useState({
    query: "",
    loading: false,
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  useEffect(() => {
    setNumUniqueUsers(countUniqueUsers(allMessages));
  }, [allMessages]);

  useEffect(() => {
    const ref = getMessagesRef();
    const setMessages = () => {
      ref.child(currentChannel.id).on("child_added", (snap) => {
        setAllMessages((prevState) => [...prevState, snap.val()]);
      });
    };

    if (currentUser && currentChannel) {
      if (currentChannel.id !== prevChannelId) {
        setAllMessages([]);
        setMessages();
      } else {
        setMessages();
      }
    }

    return () => {
      ref.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel.id]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchState((prevState) => ({
      ...prevState,
      query,
      loading: true,
    }));
  };

  useEffect(() => {
    const getSearchResults = () => {
      const regex = new RegExp(searchState.query, "gi");
      const searchResults = allMessages.reduce((acc, cur) => {
        if (
          (cur.content && cur.content.match(regex)) ||
          (cur.user.name && cur.user.name.match(regex))
        ) {
          acc.push(cur);
        }

        return acc;
      }, []);
      setQueryResults(searchResults);
      setSearchState((prevState) => ({ ...prevState, loading: false }));
    };
    setTimeout(() => {
      getSearchResults();
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState.query]);

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

  const getMessagesRef = () => {
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  return (
    <>
      <MessagesHeader
        isPrivateChannel={isPrivateChannel}
        query={searchState.query}
        handleSearchChange={handleSearchChange}
        numUniqueUsers={numUniqueUsers}
        currentChannel={currentChannel}
        loading={searchState.loading}
        setSearchState={setSearchState}
      />

      <Segment>
        <Comment.Group className="messages" style={{ maxWidth: 1500 }}>
          <Message
            messages={searchState.query ? queryResults : allMessages}
            isImage={isImage}
            isOwnMessage={isOwnMessage}
          />
          <div ref={(el) => (messagesEndRef.current = el)}></div>
        </Comment.Group>
      </Segment>

      <MessagesForm
        isPrivateChannel={isPrivateChannel}
        currentUser={currentUser}
        currentChannel={currentChannel}
        getMessagesRef={getMessagesRef}
      />
    </>
  );
};

export default Messages;
