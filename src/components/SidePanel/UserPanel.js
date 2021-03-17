import React from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import firebase from "../../config/firebase";

const UserPanel = ({ currentUser }) => {
  const dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{currentUser?.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    { key: "signout", text: <div onClick={handleSignout}>Sign out</div> },
  ];

  const handleSignout = () => {
    firebase.auth().signOut();
  };

  return (
    <Grid style={{ background: "#4c3c4c" }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2rem", margin: 0 }}>
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>KKaoChat</Header.Content>
          </Header>
        </Grid.Row>
        <Header as="h4" className="mb-4" inverted>
          <Dropdown
            trigger={
              <span>
                <Image src={currentUser?.photoURL} spaced="right" avatar />
                {currentUser?.displayName}
              </span>
            }
            options={dropdownOptions()}
          />
        </Header>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
