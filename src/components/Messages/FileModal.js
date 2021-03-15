import React, { useState } from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";
import mime from "mime-types";

const FileModal = ({ modal, closeModal, uploadFile }) => {
  const [file, setFile] = useState(null);
  const isAuthorizedTypes = ["image/jpeg", "image/png"];
  const addFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const sendFile = () => {
    if (file !== null) {
      if (isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        closeModal();
        setFile(null);
      }
    }
  };

  const isAuthorized = (fileName) =>
    isAuthorizedTypes.includes(mime.lookup(fileName));

  return (
    <Modal open={modal} onClose={closeModal}>
      <Modal.Header>Select an Image File</Modal.Header>
      <Modal.Content>
        <Input
          onChange={addFile}
          fluid
          label="File types: jpg, png"
          name="file"
          type="file"
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={sendFile} color="green" inverted>
          <Icon name="checkmark" /> Send
        </Button>
        <Button onClick={closeModal} color="red" inverted>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
