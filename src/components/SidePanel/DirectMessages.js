import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import firebase from "../../config/firebase";

const DirectMessages = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const usersRef = firebase.database().ref("users");
  const connectedRef = firebase.database().ref(".info/connected");
  const presenceRef = firebase.database().ref("presence");

  useEffect(() => {
    let loadedUsers = [];
    usersRef.on("child_added", (snap) => {
      if (currentUser.uid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        setUsers(loadedUsers);
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
  }, [currentUser.uid]);

  const addStatusToUser = (userId, connected = true) => {
    const updatedUsers = users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }

      return acc.concat(user);
    }, []);

    setUsers(updatedUsers);
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
          onClick={() => {}}
          style={{ fontStyle: "italic", opacity: 0.7 }}
        >
          <Icon name="circle" color={isUserOnline(user) ? "green" : "grey"} />@{" "}
          {user.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

export default DirectMessages;