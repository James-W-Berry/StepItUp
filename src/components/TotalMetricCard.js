import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import colors from "../assets/colors";

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
  lightTextTitle: {
    color: colors.almostWhite,
    fontSize: "1.25rem",
    fontWeight: "500",
    lineHeight: "1.6",
    letterSpacing: "0.0075em",
  },
});

function numberWithCommas(x) {
  if (x !== undefined) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "";
  }
}

const TotalMetricCard = (props) => {
  const classes = useStyles();

  const today = moment().format("MMMM Do, YYYY");

  return (
    <React.Fragment>
      <Typography h1 className={classes.lightTextTitle}>
        {props.title}
      </Typography>
      <Typography
        style={{ marginTop: "20px", color: colors.almostWhite }}
        component="p"
        variant="h3"
      >
        {`${numberWithCommas(props.total)} ${props.unit ? props.unit : ""}`}
      </Typography>
      <Typography
        style={{ marginTop: "10px", color: "#171820" }}
        variant="subtitle1"
      >
        as of {today}
      </Typography>
    </React.Fragment>
  );
};

export default TotalMetricCard;