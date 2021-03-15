import React, { useState } from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import { Formik, Form as FormikForm, Field } from "formik";

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  return (
    <>
      <Menu.Menu style={{ padding: "1rem 0" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> Channels{" "}
          </span>
          ({channels.length}){" "}
          <Icon
            style={{ cursor: "pointer" }}
            onClick={() => setModal(true)}
            name="add"
          />
        </Menu.Item>
      </Menu.Menu>

      <Modal basic size="small" open={modal} onClose={() => setModal(false)}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Formik
            initialValues={{
              channelName: "",
              channelDetails: "",
            }}
          >
            <Form as={FormikForm}>
              <Form.Field>
                <Field
                  as={Input}
                  fluid
                  label="Name of Channel"
                  name="channelName"
                />
              </Form.Field>
              <Form.Field>
                <Field
                  as={Input}
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                />
              </Form.Field>
            </Form>
          </Formik>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted>
            <Icon name="checkmark" />
            Add
          </Button>
          <Button color="red" inverted onClick={() => setModal(false)}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Channels;
