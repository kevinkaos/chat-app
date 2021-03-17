import React, { useRef, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import "./App.scss";
import SidePanel from "./SidePanel";
import Messages from "./Messages";

const App = ({ currentUser, currentChannel, isPrivateChannel }) => {
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevChannelId = usePrevious(currentChannel && currentChannel.id);

  return (
    <Grid className="app" columns="equal" style={{ background: "#eee" }}>
      <SidePanel
        key={currentUser && currentUser.uid}
        currentUser={currentUser}
      />
      <Grid.Column style={{ marginLeft: "18rem" }}>
        {currentChannel && (
          <Messages
            isPrivateChannel={isPrivateChannel}
            key={currentChannel.id}
            prevChannelId={prevChannelId}
            currentUser={currentUser}
            currentChannel={currentChannel}
          />
        )}
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = ({ user, channel }) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel,
  isPrivateChannel: channel.isPrivateChannel,
});

export default connect(mapStateToProps)(App);
