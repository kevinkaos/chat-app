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

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const loginSchema = Yup.object().shape({
    email: Yup.string().required("Email required."),
    password: Yup.string().required("Password required."),
  });

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={loginSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        setErrorMessage(null);
        firebase
          .auth()
          .signInWithEmailAndPassword(values.email, values.password)
          .then((user) => {
            console.log(user);
            setSubmitting(false);
          })
          .catch((err) => {
            console.log(err);
            setErrorMessage(err.message);
            setSubmitting(false);
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
        return (
          <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h1" icon color="red" textAlign="center">
                <Icon name="slack" color="red" />
                Login to KKaoChat
              </Header>
              <Form as={FormikForm} onSubmit={handleSubmit} size="large">
                <Segment>
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
              {errorMessage && (
                <Message error header="Login failed." content={errorMessage} />
              )}
              <Message>
                Don't have an account? <Link to="/register">Register</Link>
              </Message>
            </Grid.Column>
          </Grid>
        );
      }}
    </Formik>
  );
};

export default Login;
