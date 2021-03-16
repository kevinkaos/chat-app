import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import firebase from "../../config/firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";

const DirectMessages = ({
  currentUser,
  setCurrentChannel,
  setPrivateChannel,
  isPrivateChannel,
}) => {
  const [users, setUsers] = useState([]);
  const [activeChannel, setActiveChannel] = useState("");
  const usersRef = firebase.database().ref("users");
  const connectedRef = firebase.database().ref(".info/connected");
  const presenceRef = firebase.database().ref("presence");

  useEffect(() => {
    usersRef.on("child_added", (snap) => {
      if (currentUser.uid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        setUsers((prevState) => [...prevState, user]);
      }
    });

    connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        const ref = presenceRef.child(currentUser.uid);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          if (err !== null) {
            console.log(err);
          }
        });
      }
    });

    presenceRef.on("child_added", (snap) => {
      if (currentUser.uid !== snap.key) {
        addStatusToUser(snap.key);
      }
    });

    presenceRef.on("child_removed", (snap) => {
      if (currentUser.uid !== snap.key) {
        addStatusToUser(snap.key, false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addStatusToUser = (userId, connected = true) => {
    setUsers((prevState) => {
      const newUserState = [...prevState];
      return newUserState.reduce((acc, user) => {
        if (user.uid === userId) {
          user["status"] = `${connected ? "online" : "offline"}`;
        }
        return acc.concat(user);
      }, []);
    });
  };

  const changeChannel = (user) => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name,
    };
    setCurrentChannel(channelData);
    setPrivateChannel(true);
  };

  const getChannelId = (userId) => {
    const currentUserId = currentUser.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  const isUserOnline = (user) => user.status === "online";

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> Direct Messages
        </span>{" "}
        ({users.length})
      </Menu.Item>
      {users.map((user) => (
        <Menu.Item
          key={user.uid}
          active={user.uid === activeChannel && isPrivateChannel}
          onClick={() => {
            changeChannel(user);
            setActiveChannel(user.uid);
          }}
          style={{ fontStyle: "italic", opacity: 0.7 }}
        >
          <Icon name="circle" color={isUserOnline(user) ? "green" : "grey"} />@{" "}
          {user.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

const mapStateToProps = ({ channel }) => ({
  isPrivateChannel: channel.isPrivateChannel,
});

export default connect(mapStateToProps, {
  setCurrentChannel,
  setPrivateChannel,
})(DirectMessages);
