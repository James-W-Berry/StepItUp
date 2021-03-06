import React from "react";
import { Typography, Divider } from "@material-ui/core";
import colors from "../assets/colors";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  divider: {
    border: "none",
    height: "1px",
    color: colors.almostWhite,
    margin: 0,
    flexShrink: 0,
    width: "100%",
  },
}));

export default function Announcement() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography variant="h4" style={{ color: colors.stepitup_teal }}>
        Arriver Activity Challenge
      </Typography>
      <Typography style={{ color: colors.almostBlack }}>
        Here we go again! This challenge runs from February 1st - 28th.
      </Typography>
      <br />
      <Typography style={{ color: colors.almostBlack }}>
        Join a team and enter your daily physical activities to increase your
        team's total activity time. The team with the highest average member
        total wins!
      </Typography>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Divider
          classes={{
            root: classes.divider,
          }}
        />
      </div>
    </React.Fragment>
  );
}
