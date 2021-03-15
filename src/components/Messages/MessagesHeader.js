import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

const MessagesHeader = ({
  currentChannel,
  numUniqueUsers,
  handleSearchChange,
  loading,
}) => {
  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {currentChannel.name}
          <Icon name={"star outline"} color="black" />
        </span>
        <Header.Subheader>{numUniqueUsers}</Header.Subheader>
      </Header>
      <Header floated="right">
        <Input
          loading={loading}
          onChange={handleSearchChange}
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
