import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";

const SidePanel = ({ currentUser }) => {
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: "#4c3c4c", fontSize: "1.2rem" }}
    >
      <UserPanel currentUser={currentUser} />
      <Channels currentUser={currentUser} />
      <DirectMessages key={currentUser.uid} currentUser={currentUser} />
    </Menu>
  );
};

export default SidePanel;
