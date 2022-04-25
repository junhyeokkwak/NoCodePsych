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
import { DirectoryManager } from "@/components/layout/directoryManager";
import { useDispatch, useSelector } from "react-redux";
import { db } from "@/config/firebase";
import {
  collection,
  setDoc,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { Loading } from "@/components/surface/loading";

export const dummyTimeline = [
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
  const [description, setDescription] = React.useState("");
  const [step, setStep] = React.useState(0);
  const [sectionEditMode, setSectionEditMode] = React.useState(false);
  const [sectionIndexToEdit, setSectionIndexToEdit] = React.useState(null);
  const [timeline, setTimeline] = React.useState([]); // TODO
  const [dataLoaded, setDataLoaded] = React.useState(false);
  const { firstName, uid } = useSelector((state) => state.account);
  const router = useRouter();
  const { experimentId } = router.query;
  const [loading, setLoading] = React.useState(false);
  const [directories, setDirectories] = React.useState([]);

  const FINAL_STEP = 3;
  const handleClose = () => {
    setOpen(false);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleNext = () => {
    if (step !== FINAL_STEP) setStep(step + 1);
  };

  const addSection = (sectionToAdd) => {
    const newTimeline = [...timeline, sectionToAdd];
    setTimeline(newTimeline);
  };

  const handleSectionEdit = (sectionIndex) => {
    setSectionIndexToEdit(sectionIndex);
    setSectionEditMode(true);
  };

  const handleSectionDelete = (sectionIndex) => {
    const newTimeline = [...timeline];
    newTimeline.splice(sectionIndex, 1);
    setTimeline(newTimeline);
  };

  const handleEditorChange = (index, newSectionValue) => {
    const newTimeline = [...timeline];
    newTimeline[index] = newSectionValue;
    setTimeline(newTimeline);
  };

  const editorToTimeline = () => {
    setSectionEditMode(false);
  };

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (!experimentId) return;
      const docRef = doc(db, "experiments", experimentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();
        setName(docData.name);
        setTimeline(docData.timeline);
      }
      const userSnap = await getDoc(doc(db, "users", uid));
      setDirectories(userSnap.data().directories);
      setDataLoaded(true);
      setLoading(false);
    }
    if (experimentId && !dataLoaded) fetchData();
  }, [dataLoaded, experimentId]);

  const handleSave = async () => {
    setLoading(true);
    await updateDoc(doc(db, "experiments", experimentId), {
      name,
      description,
      lastUpdatedTime: Date.now(),
      timeline,
    });
    setLoading(false);
  };

  const handleChange = () => {
    setDataLoaded(false);
  };

  return (
    <div style={{ height: "100vh", backgroundColor: Colors.white }}>
      <Head></Head>
      <Loading loading={loading} />
      <MainBox>
        <Box m={3} />
        <Grid container spacing={1} justifyContent="center">
          <Grid container item xs={12} justifyContent="center">
            <ButtonBase
              onClick={() => {
                router.push("/home");
              }}
            >
              <Typography
                color={Colors.black}
                variant="h3"
                align="center"
                style={{ fontWeight: 500 }}
              >
                NoCode<b>Psych</b>
              </Typography>
            </ButtonBase>
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
                <Typography variant="h6">Experiment Configuration</Typography>
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
                  label="Add a description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
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
                <Typography variant="h6">Experiment Timeline</Typography>
                {!sectionEditMode ? (
                  <BasicTimeline
                    timelineData={timeline}
                    addSection={addSection}
                    handleSectionEdit={handleSectionEdit}
                    handleSectionDelete={handleSectionDelete}
                  />
                ) : (
                  <SectionEditor
                    timeline={timeline}
                    index={sectionIndexToEdit}
                    handleEditorChange={handleEditorChange}
                    editorToTimeline={editorToTimeline}
                    directories={directories}
                  />
                )}
              </Grid>
            </Grid>
          </>
        )}
        {step === 2 && (
          <>
            <Grid container item xs={12}>
              <DirectoryManager
                directoryData={directories}
                handleChange={handleChange}
              />
            </Grid>
          </>
        )}
        {step === 3 && (
          <>
            <Grid container item xs={12}>
              <Typography variant="h6">Publish & Analytics</Typography>
              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                style={{ paddingTop: 10 }}
              >
                <Grid item xs={8}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      router.push(`/experiment/${experimentId}`);
                    }}
                  >
                    Preview
                  </Button>
                </Grid>
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
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                handleSave();
              }}
            >
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
