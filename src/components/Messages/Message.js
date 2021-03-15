import React from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

const Message = ({ messages, isOwnMessage, isImage }) => {
  const convertTimestampToDate = (timestamp) => moment(timestamp).fromNow();

  return (
    messages &&
    messages.map((message, i) => (
      <Comment key={message.timestamp + i}>
        <Comment.Avatar src={message.user.avatar} />
        <Comment.Content className={isOwnMessage(message)}>
          <Comment.Author as="a">{message.user.name}</Comment.Author>
          <Comment.Metadata>
            <div>{convertTimestampToDate(message.timestamp)}</div>
          </Comment.Metadata>
          {isImage(message) ? (
            <Image src={message.image} className="message__image" />
          ) : (
            <Comment.Text>{message.content}</Comment.Text>
          )}
        </Comment.Content>
      </Comment>
    ))
  );
};

export default Message;
