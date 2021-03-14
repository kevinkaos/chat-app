import React, { useState } from "react";
import {
  Grid,
  Segment,
  Button,
  Header,
  Message,
  Icon,
  Form,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../config/firebase";
import { Formik, Form as FormikForm, Field } from "formik";
import * as Yup from "yup";

const Register = () => {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const registrationSchema = Yup.object().shape({
    username: Yup.string()
      .min(5, "Username is too short - should be 5 chars minimum")
      .required("Please provide your username."),
    email: Yup.string()
      .email("Invalid email address")
      .required("Please provide an email."),
    password: Yup.string()
      .required("Please provide a password.")
      .min(5, "Password is too short - should be 5 chars minimum."),
    confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password."),
  });

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmation: "",
      }}
      validationSchema={registrationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        setErrorMessage(null);
        setSuccess(false);
        firebase
          .auth()
          .createUserWithEmailAndPassword(values.email, values.password)
          .then((createdUser) => {
            setSubmitting(false);
            resetForm();
            setSuccess(true);
            console.log(createdUser);
          })
          .catch((err) => {
            setSubmitting(false);
            setErrorMessage(err.message);
          });
      }}
    >
      {({
        isSubmitting,
        isValid,
        dirty,
        errors,
        touched,
        getFieldProps,
        handleSubmit,
      }) => {
        console.log(errors);
        return (
          <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h2" icon color="red" textAlign="center">
                <Icon name="slack" color="red" />
                Register for KKaoChat
              </Header>
              <Form as={FormikForm} onSubmit={handleSubmit} size="large">
                <Segment>
                  <Field
                    {...getFieldProps("username")}
                    error={
                      errors.username &&
                      touched.username && {
                        content: errors.username,
                        pointing: "above",
                      }
                    }
                    as={Form.Input}
                    fluid
                    name="username"
                    icon="user"
                    iconPosition="left"
                    placeholder="Username"
                    type="text"
                  />
                  <Field
                    {...getFieldProps("email")}
                    error={
                      errors.email &&
                      touched.email && {
                        content: errors.email,
                        pointing: "above",
                      }
                    }
                    as={Form.Input}
                    fluid
                    name="email"
                    icon="mail"
                    iconPosition="left"
                    placeholder="Email Address"
                    type="email"
                  />
                  <Field
                    {...getFieldProps("password")}
                    error={
                      errors.password &&
                      touched.password && {
                        content: errors.password,
                        pointing: "above",
                      }
                    }
                    name="password"
                    as={Form.Input}
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                  />
                  <Field
                    {...getFieldProps("confirmation")}
                    error={
                      errors.confirmation &&
                      touched.confirmation && {
                        content: errors.confirmation,
                        pointing: "above",
                      }
                    }
                    name="confirmation"
                    as={Form.Input}
                    fluid
                    icon="redo"
                    iconPosition="left"
                    placeholder="Password Confirmation"
                    type="password"
                  />
                  <Button
                    disabled={isSubmitting || !(isValid && dirty)}
                    className={isSubmitting ? "loading" : ""}
                    type="submit"
                    color="red"
                    fluid
                    size="large"
                  >
                    Submit
                  </Button>
                </Segment>
              </Form>
              {success && (
                <Message
                  success
                  header="Your user registration was successful."
                  content="You may now log-in with the username you have chosen."
                />
              )}
              {errorMessage && (
                <Message
                  error
                  header="Your user registration failed."
                  content={errorMessage}
                />
              )}
              <Message>
                Already a user? <Link to="/login">Login</Link>
              </Message>
            </Grid.Column>
          </Grid>
        );
      }}
    </Formik>
  );
};

export default Register;
