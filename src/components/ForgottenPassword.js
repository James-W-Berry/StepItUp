import React, { useState } from "react";
import firebase from "../firebase";
import "firebase/auth";
import { NavLink } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "typeface-roboto";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Divider } from "@material-ui/core";
import Img from "react-image";
import landingPhoto from "../assets/walking.jpg";
import logo from "../assets/walk.png";

const Logo = () => <Img src={logo} height={60} />;

const useStyles = makeStyles({
  divider: {
    border: "none",
    height: "1px",
    backgroundColor: "#171820",
    margin: 0,
    flexShrink: 0,
    width: "100%"
  },
  textInput: {
    width: "20vw",
    "& label ": {
      color: "#17182080"
    },
    "& label.Mui-focused": {
      color: "#171820"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#171820"
    }
  },
  root: {
    "&:hover": {
      color: "#17182090"
    },
    border: 0,
    borderRadius: 3,
    color: "#171820",
    height: 48,
    padding: "0 30px"
  },
  input: {
    color: "#171820"
  }
});

function onResetPassword(email) {
  console.log("resettingpassword ");
  console.log(email);
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function() {
      alert("Check your email to reset your password.");
    })
    .catch(function(error) {
      console.log("error resetting password ");

      alert(
        "Could not send email, please enter your email address and try again."
      );
    });
}

function ForgottenPassword(props) {
  const [email, setEmail] = useState("");
  const classes = useStyles();

  return (
    <div
      style={{
        flex: 1,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${landingPhoto})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "20px",
            flex: 1
          }}
        >
          <NavLink
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              textDecoration: "none",
              color: "#171820"
            }}
            to="/home"
          >
            <Logo />
            <Typography
              variant="h5"
              style={{ color: "#171820", marginLeft: "20px" }}
            >
              Step It Up
            </Typography>
          </NavLink>
        </div>

        <div
          style={{
            display: "flex",
            flex: 3
          }}
        />

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            margin: "10px"
          }}
        >
          <NavLink
            style={{
              textDecoration: "none",
              color: "#171820"
            }}
            to="/signup"
          >
            <Button className={classes.root}>Sign Up</Button>
          </NavLink>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            margin: "10px"
          }}
        >
          <NavLink
            style={{
              textDecoration: "none",
              color: "#171820"
            }}
            to="/signin"
          >
            <Button className={classes.root}>Sign In</Button>
          </NavLink>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Divider
          classes={{
            root: classes.divider
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px"
        }}
      >
        <TextField
          className={classes.textInput}
          id="standard-email-input"
          label="Email"
          type="email"
          InputProps={{
            className: classes.input
          }}
          autoComplete="email"
          onChange={event => {
            setEmail(event.target.value);
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flex: "1",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "30px"
        }}
      >
        <Button
          onClick={() => {
            onResetPassword(email);
          }}
          className={classes.root}
        >
          Reset Password
        </Button>
      </div>
    </div>
  );
}

ForgottenPassword.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(useStyles)(ForgottenPassword);