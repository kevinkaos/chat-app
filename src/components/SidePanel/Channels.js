import React, { useState, useEffect } from "react";
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label,
} from "semantic-ui-react";
import { Formik, Form as FormikForm, Field } from "formik";
import * as Yup from "yup";
import firebase from "../../config/firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";

const Channels = ({
  currentUser,
  setCurrentChannel,
  currentChannel,
  setPrivateChannel,
  isPrivateChannel,
}) => {
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const messagesRef = firebase.database().ref("messages");
  const channelsRef = firebase.database().ref("channels");
  const channelSchema = Yup.object().shape({
    channelName: Yup.string().required("Please provide a channel name."),
    channelDetails: Yup.string().required(
      "Please provide some details about the channel."
    ),
  });

  useEffect(() => {
    channelsRef.on("child_added", (snap) => {
      setChannels((prevState) => [...prevState, snap.val()]);
      addNotificationListener(snap.child("id").val());
    });

    return () => {
      firebase.database().ref("channels").off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNotificationListener = (channelId) => {
    messagesRef.child(channelId).on("value", (snapshot) => {
      let notifs = [];
      let lastTotal = 0;
      setNotifications((prevState) => {
        const notifications = [...prevState];
        let index = notifications.findIndex((notification) => {
          return notification.id === snapshot.key;
        });

        if (index !== -1) {
          lastTotal = notifications[index].total;

          if (snapshot.numChildren() - lastTotal > 0) {
            notifications[index].count = snapshot.numChildren() - lastTotal;
          }

          notifications[index].lastKnownTotal = snapshot.numChildren();
          return notifications;
        } else {
          notifs.push({
            id: snapshot.key,
            total: snapshot.numChildren(),
            lastKnownTotal: snapshot.numChildren(),
            count: 0,
          });
          return [...prevState, ...notifs];
        }
      });
    });
  };

  const clearNotifications = (currentChannel) => {
    setNotifications((prevState) => {
      const notifications = [...prevState];
      let index = notifications.findIndex(
        (notification) => notification.id === currentChannel.id
      );

      if (index !== -1) {
        notifications[index].total = notifications[index].lastKnownTotal;
        notifications[index].count = 0;
        return notifications;
      }
    });
  };

  const getNotificationCount = (channel) => {
    let count = 0;

    notifications.forEach((notification) => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  const displayChannels = () =>
    channels.length
      ? channels.map((channel) => (
          <Menu.Item
            active={channel.name === currentChannel?.name && !isPrivateChannel}
            style={
              channel.name === currentChannel?.name ? { color: "white" } : {}
            }
            key={channel.id}
            onClick={() => {
              setCurrentChannel(channel);
              setPrivateChannel(false);
              clearNotifications(channel);
            }}
            name={channel.name}
          >
            {getNotificationCount(channel) && (
              <Label color="red">{getNotificationCount(channel)}</Label>
            )}
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
          const key = channelsRef.push().key;
          channelsRef
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
  isPrivateChannel: channel.isPrivateChannel,
});

export default connect(mapStateToProps, {
  setCurrentChannel,
  setPrivateChannel,
})(Channels);
