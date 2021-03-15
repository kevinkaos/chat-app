import React, { useState } from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import { Formik, Form as FormikForm, Field } from "formik";
import * as Yup from "yup";

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const channelSchema = Yup.object().shape({
    channelName: Yup.string().required("Please provide a channel name."),
    channelDetails: Yup.string().required(
      "Please provide some details about the channel."
    ),
  });
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

      <Formik
        initialValues={{
          channelName: "",
          channelDetails: "",
        }}
        validationSchema={channelSchema}
      >
        {({ isSubmitting, isValid, dirty, resetForm }) => (
          <Modal
            basic
            size="small"
            open={modal}
            onClose={() => {
              setModal(false);
              resetForm();
            }}
          >
            <Modal.Header>Add a Channel</Modal.Header>
            <Modal.Content>
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
            </Modal.Content>
            <Modal.Actions>
              <Button
                disabled={isSubmitting || !(isValid && dirty)}
                color="green"
                inverted
              >
                <Icon name="checkmark" />
                Add
              </Button>
              <Button
                color="red"
                inverted
                onClick={() => {
                  setModal(false);
                  resetForm();
                }}
              >
                <Icon name="remove" /> Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        )}
      </Formik>
    </>
  );
};

export default Channels;
