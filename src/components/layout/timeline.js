import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { Button, Typography, Grid } from "@mui/material";
import { StandardDialog } from "./dialog";

function pluralFormat(num, string) {
  if (num > 1) return `${num} ${string}s`;
  else return `${num} ${string}`;
}

const newSectionDict = {
  instruction: {
    label: "New Instruction",
    type: "instruction",
    pages: [
      {
        displayTime: null,
        responseType: "keyboard",
        contents: [
          {
            type: "text",
            value: "Type instruction here...",
          },
        ],
        responseOptions: [],
      },
    ],
  },
  trial: {
    label: "New Trial",
    type: "trial",
    trialNum: 0,
    pages: [
      {
        displayTime: null,
        responseType: "keyboard",
        contents: [
          {
            type: "text",
            value: "Type text here",
          },
          {
            type: "image",
            value: "https://picsum.photos/200/300",
          },
        ],
        responseOptions: [],
      },
    ],
  },
};

export default function BasicTimeline({
  timelineData,
  addSection,
  handleSectionEdit,
  handleSectionDelete,
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const handleClose = () => {
    setDialogOpen(false);
  };
  const handleAddSection = (sectionType) => {
    addSection(newSectionDict[sectionType]);
    setDialogOpen(false);
  };
  return (
    <>
      <Timeline>
        {timelineData &&
          timelineData.map((node, index) => (
            <TimelineItem>
              <TimelineOppositeContent>
                <Typography variant="h6" component="span">
                  {node.label}
                </Typography>
                <Typography>
                  {`${node.pages.length} page${
                    node.pages.length > 1 ? "s" : ""
                  }`}
                  {`${
                    node.trialNum
                      ? " × " + pluralFormat(node.trialNum, "trial")
                      : ""
                  }`}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                {index === timelineData.length - 1 ? (
                  <TimelineSeparator />
                ) : (
                  <TimelineConnector />
                )}
              </TimelineSeparator>
              <TimelineContent>
                <Grid container item xs={12}>
                  <Grid container item spacing={2} alignItems="flex-start">
                    <Grid item>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          handleSectionEdit(index);
                        }}
                      >
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" size="small">
                        Up
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="outlined" size="small">
                        Down
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => {
                          handleSectionDelete(index);
                        }}
                      >
                        Delete
                      </Button>
                    </Grid>
                    {/* <Grid item>
                    <Button variant="outlined" size="small">
                      Preview
                    </Button>
                  </Grid> */}
                  </Grid>
                </Grid>
              </TimelineContent>
            </TimelineItem>
          ))}
      </Timeline>
      <Grid container item xs={12} justifyContent="center">
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={() => {
            setDialogOpen(true);
          }}
          style={{ paddingLeft: 20, paddingRight: 20 }}
        >
          Add section
        </Button>
      </Grid>
      <StandardDialog
        open={dialogOpen}
        handleClose={handleClose}
        title="Select Section Type"
      >
        <Grid
          container
          item
          style={{ paddingBottom: 30 }}
          xs={12}
          spacing={2}
          justifyContent="center"
        >
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleAddSection("instruction");
              }}
              fullWidth
            >
              Instruction
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleAddSection("trial");
              }}
              fullWidth
            >
              Trial
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleAddSection("debrief");
              }}
              fullWidth
              disabled
            >
              Debrief
            </Button>
          </Grid>
        </Grid>
      </StandardDialog>
    </>
  );
}
