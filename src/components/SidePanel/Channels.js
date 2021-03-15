import React, { useState, useEffect } from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import { Formik, Form as FormikForm, Field } from "formik";
import * as Yup from "yup";
import firebase from "../../config/firebase";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../actions";

const Channels = ({ currentUser, setCurrentChannel, currentChannel }) => {
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const channelSchema = Yup.object().shape({
    channelName: Yup.string().required("Please provide a channel name."),
    channelDetails: Yup.string().required(
      "Please provide some details about the channel."
    ),
  });
  useEffect(() => {
    firebase
      .database()
      .ref("channels")
      .on("child_added", (snap) => {
        if (snap.exists()) {
          setChannels((prevState) => [...prevState, snap.val()]);
        }
      });

    return () => {
      firebase.database().ref("channels").off();
    };
  }, []);

  const displayChannels = () =>
    channels.length
      ? channels.map((channel) => (
          <Menu.Item
            active={channel.name === currentChannel?.name}
            style={
              channel.name === currentChannel?.name ? { color: "white" } : {}
            }
            key={channel.id}
            onClick={() => setCurrentChannel(channel)}
            name={channel.name}
          >
            # {channel.name}
          </Menu.Item>
        ))
      : null;

  return (
    <>
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="exchange" /> Channels{" "}
          </span>
          ({channels.length ? channels.length : "..."}){" "}
          <Icon
            style={{ cursor: "pointer" }}
            onClick={() => setModal(true)}
            name="add"
          />
        </Menu.Item>
        {displayChannels()}
      </Menu.Menu>

      <Formik
        initialValues={{
          channelName: "",
          channelDetails: "",
        }}
        validationSchema={channelSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          const key = firebase.database().ref("channels").push().key;
          firebase
            .database()
            .ref("channels")
            .push()
            .set({
              id: key,
              name: values.channelName,
              details: values.channelDetails,
              createdBy: {
                name: currentUser.displayName,
                avatar: currentUser.photoURL,
              },
            })
            .then(() => {
              resetForm();
              setSubmitting(false);
              setModal(false);
            })
            .catch((err) => {
              setSubmitting(false);
              setModal(false);
              console.log("error adding channel", err);
            });
        }}
      >
        {({
          isSubmitting,
          isValid,
          dirty,
          resetForm,
          handleSubmit,
          getFieldProps,
        }) => (
          <Modal
            size="small"
            open={modal}
            onClose={() => {
              setModal(false);
              resetForm();
            }}
          >
            <Modal.Header>Add a Channel</Modal.Header>
            <Modal.Content>
              <Form as={FormikForm} onSubmit={handleSubmit}>
                <Form.Field>
                  <Field
                    {...getFieldProps("channelName")}
                    as={Input}
                    fluid
                    label="Name of Channel"
                    name="channelName"
                  />
                </Form.Field>
                <Form.Field>
                  <Field
                    {...getFieldProps("channelDetails")}
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
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !(isValid && dirty)}
                className={isSubmitting ? "loading" : ""}
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

const mapStateToProps = ({ channel }) => ({
  currentChannel: channel.currentChannel,
});

export default connect(mapStateToProps, { setCurrentChannel })(Channels);
