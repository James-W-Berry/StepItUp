import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../firebase";
import "firebase/auth";
import Calendar from "react-calendar";
import DaySummary from "./DaySummary";
import {
  Button,
  Dialog,
  Grid,
  TextField,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@material-ui/core";
import colors from "../assets/colors";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import activityList from "../assets/activityList.json";
import CalendarIcon from "@material-ui/icons/TodayOutlined";

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: colors.stepitup_teal,
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  button: {
    background: colors.stepitup_teal,
    border: 0,
    borderRadius: 3,
    color: colors.almostWhite,
    height: 48,
    padding: "0 30px",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  calendar: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    marginBottom: "20px",
    "& label.Mui-focused": {
      color: colors.almostBlack,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: colors.stepitup_teal,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "max-content",
    justifyContent: "center",
  },
}));

function onEditSteps(userId, date, steps) {
  if (date !== "") {
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("steps")
      .doc(date.toString());

    return docRef
      .set({
        steps: steps,
      })
      .then(function () {
        console.log("successfully added steps document");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

function onEditDailyTotals(date, steps, dayStepCount) {
  if (date !== "") {
    const decrement = -1 * dayStepCount;

    const docRef = firebase
      .firestore()
      .collection("dailyTotals")
      .doc(date.toString());

    docRef
      .set(
        {
          totalSteps: firebase.firestore.FieldValue.increment(decrement),
        },
        { merge: true }
      )
      .then(function () {
        console.log("removed old day count from daily total steps");
      })
      .catch(function (error) {
        console.log(error);
      });

    return docRef
      .set(
        {
          totalSteps: firebase.firestore.FieldValue.increment(steps),
        },
        { merge: true }
      )
      .then(function () {
        console.log("successfully incremented daily total steps");
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

function calculateTotal(userId, docs, user) {
  let totalSteps = 0;

  docs.map((doc) => {
    totalSteps += doc.steps;
  });

  const docRef = firebase.firestore().collection("users").doc(userId);

  console.log(`updating user total steps: ${totalSteps}`);
  docRef
    .set(
      {
        totalSteps: totalSteps,
      },
      { merge: true }
    )
    .then(function () {
      console.log("successfully updated total steps");
    })
    .catch(function (error) {
      console.log(error);
    });
}

const SORT_OPTIONS = {
  STEPS_ASC: { column: "steps", direction: "asc" },
  STEPS_DESC: { column: "steps", direction: "desc" },
};

function useSteps(sortBy = "STEPS_DESC", userId, user) {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("steps")
      .orderBy(SORT_OPTIONS[sortBy].column, SORT_OPTIONS[sortBy].direction)
      .onSnapshot((snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSteps(docs);
        calculateTotal(userId, docs, user);
      });

    return () => unsubscribe();
  }, [sortBy, userId, user]);

  return steps;
}

function showStepCount(date) {}

function useUser(userId) {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot((snapshot) => {
        const doc = {
          ...snapshot.data(),
        };
        setUser(doc);
      });

    return () => unsubscribe();
  }, [userId]);

  return user;
}

function createActivityOption(activityOption) {
  if (activityOption !== undefined) {
    return <option value={activityOption[0]}>{activityOption[0]}</option>;
  }
}

const EditActivities = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [userId, setUserId] = useState(props.userId);
  const [date, setDate] = useState("");
  const [datePrompt, setDatePrompt] = useState("Select date");
  const [steps, setSteps] = useState(0);
  const [sortBy, setSortBy] = useState("STEPS_DESC");
  const [selectedDate, setSelectedDate] = useState("");
  const user = useUser(userId);
  const savedSteps = useSteps(sortBy, userId, user);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState(activityList[0]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    return () => {
      console.log("EditSteps UNMOUNTED");
    };
  }, []);

  const handleClose = () => {
    setCalendarOpen(false);
  };

  let dayStepCount = "0";

  savedSteps.map((step) => {
    if (step.id === selectedDate.toString()) {
      dayStepCount = step.steps;
    }
  });

  return (
    <Grid
      container
      spacing={4}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <div
          style={{
            //border: `1px ${colors.almostBlack} solid`,
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              backgroundColor: colors.stepitup_teal,
              padding: "15px",
              display: "flex",
              justifyContent: "center",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            <Typography variant="h6" style={{ color: colors.almostWhite }}>
              Add activity
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
              backgroundColor: colors.stepitup_blueishGray,
            }}
          >
            <FormControl required className={classes.formControl}>
              <InputLabel id="simple-select-required-label">
                Activity type
              </InputLabel>
              <Select
                native
                value={activity}
                onChange={() => setActivity(activity)}
                labelId="simple-select-required-label"
                id="simple-select-required"
              >
                <option aria-label="None" value="" />
                {Object.entries(activityList).map((activityOption) =>
                  createActivityOption(activityOption)
                )}
              </Select>
              <FormHelperText>Required</FormHelperText>
            </FormControl>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <FormControl
                required
                variant="outlined"
                className={classes.formControl}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={() => setCalendarOpen(true)}
                  >
                    <CalendarIcon />
                  </IconButton>
                  <Typography>{datePrompt}</Typography>
                </div>
              </FormControl>
              <FormControl
                required
                variant="outlined"
                className={classes.formControl}
              >
                <TextField
                  className={classes.textInput}
                  style={{ width: "90%" }}
                  label="Enter duration (min)"
                  type="number"
                  inputProps={{ min: "0" }}
                  onChange={(event) => {
                    setSteps(parseInt(event.target.value));
                  }}
                />
              </FormControl>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "30px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  style={{
                    marginBottom: "10px",
                    backgroundColor: colors.stepitup_teal,
                    color: colors.almostWhite,
                  }}
                  onClick={(e) => {
                    onEditSteps(userId, date, steps);
                    onEditDailyTotals(date, steps, dayStepCount);
                  }}
                  color="primary"
                >
                  <Typography>Save</Typography>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Grid>

      {selectedDate !== "" && (
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DaySummary
              totalDaySteps={dayStepCount}
              selectedDate={selectedDate}
            />
          </div>
        </Grid>
      )}

      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={calendarOpen}
      >
        <div className={classes.calendar}>
          <Calendar
            onChange={(newDate) => {
              setDate(newDate);
              let dateChunks = newDate.toString().split(" ");
              let simpleDate =
                dateChunks[0] +
                " " +
                dateChunks[1] +
                " " +
                dateChunks[2] +
                " , " +
                dateChunks[3];
              setDatePrompt(simpleDate);
            }}
            value={date}
            onClickDay={(selectedDate) => {
              showStepCount(selectedDate);
              setSelectedDate(selectedDate);
              handleClose();
            }}
          />
        </div>
      </Dialog>
    </Grid>
  );
};

export default EditActivities;