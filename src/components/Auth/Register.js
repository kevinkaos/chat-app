import React from "react";
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
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = () => {
  const registrationSchema = Yup.object().shape({
    username: Yup.string().required("Please provide your username."),
    email: Yup.string()
      .email("Invalid email address")
      .required("Please provide an email."),
    password: Yup.string()
      .required("Please provide a password.")
      .min(5, "Password is too short - should be 5 chars minimum."),
    confirmation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
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
      onSubmit={(values) => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(values.email, values.password)
          .then((createdUser) => {
            console.log(createdUser);
          })
          .catch((err) => {
            console.log(err);
          });
      }}
    >
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="red" textAlign="center">
            <Icon name="slack" color="red" />
            Register for KKaoChat
          </Header>
          <FormikForm size="large">
            <Segment>
              <Field
                as={Form.Input}
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                type="text"
              />
              <ErrorMessage
                component="div"
                className="mb-4 mx-2 text-start text-danger"
                name="username"
              />
              <Field
                as={Form.Input}
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                type="email"
              />
              <ErrorMessage
                component="div"
                className="mb-4 mx-2 text-start text-danger"
                name="email"
              />
              <Field
                name="password"
                as={Form.Input}
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
              />
              <ErrorMessage
                component="div"
                className="mb-4 mx-2 text-start text-danger"
                name="password"
              />
              <Field
                name="confirmation"
                as={Form.Input}
                fluid
                icon="redo"
                iconPosition="left"
                placeholder="Password Confirmation"
                type="password"
              />
              <ErrorMessage
                component="div"
                className="mb-4 mx-2 text-start text-danger"
                name="confirmation"
              />
              <Button type="submit" color="red" fluid size="large">
                Submit
              </Button>
            </Segment>
          </FormikForm>
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    </Formik>
  );
};

export default Register;
