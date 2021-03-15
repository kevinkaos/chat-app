import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  withRouter,
} from "react-router-dom";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import firebase from "./config/firebase";
import { Provider, connect } from "react-redux";
import store from "./store";
import { setUser, clearUser } from "./actions";
import Spinner from "./components/Spinner";

const Root = ({ setUser, isLoading }) => {
  const history = useHistory();
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        history.push("/");
      } else {
        clearUser();
        history.push("/login");
      }
    });
  }, [history, setUser]);

  return (
    <Switch>
      <Route exact path="/" component={isLoading ? Spinner : App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  );
};

const mapStateToProps = ({ user }) => ({
  isLoading: user.isLoading,
});

const RootWithRouter = withRouter(
  connect(mapStateToProps, { setUser, clearUser })(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithRouter />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
