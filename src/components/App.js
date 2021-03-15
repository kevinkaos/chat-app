import React, { useRef, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import "./App.scss";
import ColorPanel from "./ColorPanel";
import SidePanel from "./SidePanel";
import Messages from "./Messages";
import MetaPanel from "./MetaPanel";

//TODO: add key prop for components?????

const App = ({ currentUser, currentChannel }) => {
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
      <ColorPanel />
      <SidePanel currentUser={currentUser} />
      <Grid.Column style={{ marginLeft: "23rem" }}>
        {currentChannel && (
          <Messages
            prevChannelId={prevChannelId}
            currentUser={currentUser}
            currentChannel={currentChannel}
          />
        )}
      </Grid.Column>
      <Grid.Column width={4}>{currentChannel && <MetaPanel />}</Grid.Column>
    </Grid>
  );
};

const mapStateToProps = ({ user, channel }) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel,
});

export default connect(mapStateToProps)(App);
