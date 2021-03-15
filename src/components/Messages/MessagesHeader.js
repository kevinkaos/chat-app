import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

const MessagesHeader = ({
  currentChannel,
  numUniqueUsers,
  handleSearchChange,
  loading,
  query,
  setSearchState,
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
          value={query}
          icon={
            query ? (
              <Icon
                name="close"
                color="black"
                link
                onClick={() =>
                  setSearchState((prevState) => ({ ...prevState, query: "" }))
                }
              />
            ) : (
              "search"
            )
          }
          name="searchTerm"
          placeholder="Search Messages"
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
