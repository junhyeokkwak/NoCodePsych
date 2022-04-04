import Head from "next/head";
import Link from "next/link";
import * as React from "react";
import Button from "@mui/material/Button";
import Colors from "@/design/colors";
import MainBox from "@/components/layout/mainBox";
import { useRouter } from "next/router";
import {
  Box,
  Divider,
  Typography,
  Grid,
  TextField,
  ButtonBase,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DefaultButton, LargeButton } from "@/components/input/buttons";
import { InfoCard, StyledInfoCard } from "@/components/surface/card";
import { homepageCardData } from "@/data/infoData";
import { StandardDialog } from "@/components/layout/dialog";
import { NextSeo } from "next-seo";
import { Footer } from "@/components/layout/footer";
import BasicTimeline from "@/components/layout/timeline";
import { SectionEditor } from "@/components/editor/sectionEditor";

const dummyTimeline = [
  {
    label: "Instruction 1",
    type: "instruction", // instruction | trial | debrief
    pages: [
      {
        displayTime: 500, // integer (ms) | null (indefinite)
        responseType: "keyboard", // keyboard | mouse | both | none
        contents: [
          {
            type: "text",
            value:
              "Welcome to the experiment. You will see an image like this.",
          },
          {
            type: "image",
            value: "https://picsum.photos/200/300",
          },
        ],
      },
      {
        displayTime: 500, // integer (ms) | null (indefinite)
        responseType: "keyboard", // keyboard | mouse | both | none
        contents: [
          {
            type: "text",
            value: "This is what the experiment is about.",
          },
          {
            type: "image",
            value: "https://picsum.photos/200/300",
          },
        ],
      },
    ],
  },
  {
    label: "Sample Trial",
    type: "trial",
    trialNum: 50,
    pages: [
      {
        displayTime: 500,
        responseType: "keyboard",
        contents: [
          {
            type: "text",
            value: "Which one is taller?",
          },
          {
            type: "image",
            value: "https://picsum.photos/200/300",
          },
        ],
      },
    ],
  },
];

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [step, setStep] = React.useState(0);
  const [stimuliType, setStimuliType] = React.useState("");
  const [responseType, setResponseType] = React.useState("");
  const [totalTrialNum, setTotalTrialNum] = React.useState(0);
  const [instructions, setInstructions] = React.useState([]);
  const [sectionEditMode, setSectionEditMode] = React.useState(false);
  const [sectionIndexToEdit, setSectionIndexToEdit] = React.useState(null);
  const [timeline, setTimeline] = React.useState(dummyTimeline); // TODO
  const FINAL_STEP = 3;
  const router = useRouter();
  const handleClose = () => {
    setOpen(false);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleNext = () => {
    if (step !== FINAL_STEP) setStep(step + 1);
  };

  const addInstruction = () => {
    const newInstructions = [...instructions, { value: "" }];
    setInstructions(newInstructions);
  };

  const updateInstruction = (index, key, newVal) => {
    const newInstructions = [...instructions];
    newInstructions[index][key] = newVal;
    setInstructions(newInstructions);
  };

  const addSection = (sectionToAdd) => {
    const newTimeline = [...timeline, sectionToAdd];
    setTimeline(newTimeline);
  };

  const handleSectionEdit = (sectionIndex) => {
    setSectionIndexToEdit(sectionIndex);
    setSectionEditMode(true);
  };

  const handleEditorChange = (index, newSectionValue) => {
    const newTimeline = [...timeline];
    newTimeline[index] = newSectionValue;
    setTimeline(newTimeline);
  };

  const editorToTimeline = () => {
    setSectionEditMode(false);
  };

  return (
    <div style={{ height: "100vh", backgroundColor: Colors.white }}>
      <Head></Head>
      <MainBox>
        <Box m={3} />
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12}>
            <Typography
              color={Colors.black}
              variant="h3"
              align="center"
              style={{ fontWeight: 500 }}
            >
              NoCode<b>Psych</b>
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ paddingBottom: 30 }}>
            <Typography align="center">
              Web-based, no-code experiment builder
            </Typography>
          </Grid>
        </Grid>
        {step === 0 && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Create a new experiment</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Name your experiment"
                  variant="outlined"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  value={stimuliType}
                  label="Select a stimuli type"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    setStimuliType(e.target.value);
                  }}
                >
                  <MenuItem value={"image"}>Text</MenuItem>
                  <MenuItem value={"text"}>Image</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  value={responseType}
                  label="Select a response type"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    setResponseType(e.target.value);
                  }}
                >
                  <MenuItem value={"keyboard"}>Keyboard</MenuItem>
                  <MenuItem value={"mouse"}>Mouse</MenuItem>
                  <MenuItem value={"both"}>Both</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Number of trials"
                  variant="outlined"
                  value={totalTrialNum}
                  onChange={(e) => {
                    setTotalTrialNum(e.target.value);
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </>
        )}
        {step === 1 && (
          <>
            <Grid container spacing={2}>
              <Grid conatiner item xs={12} justifyContent="flex-start">
                {!sectionEditMode ? (
                  <BasicTimeline
                    timelineData={timeline}
                    addSection={addSection}
                    handleSectionEdit={handleSectionEdit}
                  />
                ) : (
                  <SectionEditor
                    timeline={timeline}
                    index={sectionIndexToEdit}
                    handleEditorChange={handleEditorChange}
                    editorToTimeline={editorToTimeline}
                  />
                )}
              </Grid>
            </Grid>
          </>
        )}
        {step === 2 && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Set up instructions for your experiment
                </Typography>
              </Grid>
              {instructions.map((instructionNode, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    label={`Instruction page #${index + 1}`}
                    variant="outlined"
                    value={instructionNode.value}
                    onChange={(e) => {
                      updateInstruction(index, "value", e.target.value);
                    }}
                    fullWidth
                    multiline={true}
                    minRows={3}
                    maxRows={6}
                  />
                </Grid>
              ))}

              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => {
                    addInstruction();
                  }}
                >
                  + Add a new instruction page
                </Button>
              </Grid>
            </Grid>
          </>
        )}

        <Grid container spacing={2} style={{ paddingTop: 40 }}>
          <Grid item xs={4}>
            <Button
              variant="contained"
              fullWidth
              disabled={step === 0}
              onClick={handlePrevious}
            >
              {"< Previous"}
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" fullWidth>
              {"Save progress"}
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" fullWidth onClick={handleNext}>
              {"Next >"}
            </Button>
          </Grid>
        </Grid>
      </MainBox>
    </div>
  );
}
