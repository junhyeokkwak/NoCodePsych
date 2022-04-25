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
  Backdrop,
  CircularProgress,
  Chip,
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
import * as parser from "humanparser";
import { useDispatch, useSelector } from "react-redux";
import { db } from "@/config/firebase";
import { titleCase } from "@/components/utils/string";

export default function Index() {
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { firstName, uid } = useSelector((state) => state.account);
  const [dataLoaded, setDataLoaded] = React.useState(false);
  const [experimentIds, setExperimentIds] = React.useState([]);
  const [experimentData, setExperimentData] = React.useState([]);
  const [newExperimentName, setNewExperimentName] = React.useState("");
  const router = useRouter();
  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (!uid) return;
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setExperimentIds(userData.experiments);
        const experimentDataArray = [];
        for (const expId of userData.experiments) {
          const expRef = doc(db, "experiments", expId);
          const expSnap = await getDoc(expRef);
          const expData = expSnap.data();
          experimentDataArray.push({
            name: expData.name,
            createdTime: expData.createdTime,
            status: expData.status,
            experimentId: expId,
          });
        }
        setExperimentData(experimentDataArray);
      }
      setDataLoaded(true);
      setLoading(false);
    }
    if (!dataLoaded) fetchData();
  }, [dataLoaded]);

  async function handleNewExperiment() {
    if (uid) {
      const expDocRef = await addDoc(collection(db, "experiments"), {
        name: newExperimentName,
        status: "draft",
        ownerId: uid,
        createdTime: Date.now(),
        lastUpdatedTime: Date.now(),
        timeline: [],
        description: "",
      });
      const newExperimentId = expDocRef.id;
      console.log(newExperimentId);
      // update to user doc
      await updateDoc(doc(db, "users", uid), {
        experiments: arrayUnion(newExperimentId),
      });
      console.log(
        `Experiment ID ${newExperimentId} successfully added to user ${uid}!`
      );
      handleClose();
      setDataLoaded(false);
      // router.push(`editor/${newExperimentId}`)
    }
    handleClose();
  }

  async function handleExperimentDelete(experimentId) {
    await deleteDoc(doc(db, "experiments", experimentId))
      .then(async () => {
        await updateDoc(doc(db, "users", uid), {
          experiments: arrayRemove(experimentId),
        });
      })
      .then(() => {
        setDataLoaded(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div style={{ height: "100vh", backgroundColor: Colors.white }}>
      <Head></Head>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" style={{ zIndex: 1200 }} />
      </Backdrop>
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
          <Grid item xs={12} style={{ paddingTop: 15 }}>
            <Typography variant="h5" align="center">
              Hello, {firstName}!
            </Typography>
          </Grid>
          <Grid container item xs={12} justifyContent="center" spacing={2}>
            {experimentData.map((dataObj, i) => (
              <Grid
                container
                item
                xs={12}
                sm={10}
                md={8}
                key={i}
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={6}>
                  <Typography variant="h6">{dataObj.name}</Typography>
                </Grid>
                <Grid
                  container
                  item
                  xs={6}
                  spacing={2}
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Grid item>
                    <Chip
                      label={titleCase(dataObj.status)}
                      variant="filled"
                      fullWidth
                      sx={{ fontWeight: 800 }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        router.push(`/editor/${dataObj.experimentId}`);
                      }}
                      size="small"
                    >
                      Edit
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        handleExperimentDelete(dataObj.experimentId);
                      }}
                      size="small"
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} md={8} lg={7} style={{ paddingTop: 15 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setOpen(true);
              }}
            >
              Create New Experiment
            </Button>
          </Grid>
          <Grid item xs={12} md={8} lg={7} style={{ paddingTop: 15 }}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => {}}
            >
              Sign out
            </Button>
          </Grid>
        </Grid>
        <StandardDialog
          open={open}
          handleClose={handleClose}
          title="Name your new experiment"
          actionButtonLabels={["Continue", "Cancel"]}
          actionButtonHandlers={[handleNewExperiment, handleClose]}
        >
          <Grid container item xs={12} justifyContent="center">
            {/* <Grid container item xs={12} justifyContent="center">
              <Typography justify="center">
                Create a name for your experiment
              </Typography>
            </Grid> */}
            <Grid container item xs={10} justifyContent="center">
              <TextField
                label="Experiment name"
                value={newExperimentName}
                onChange={(e) => {
                  setNewExperimentName(e.target.value);
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </StandardDialog>
      </MainBox>
    </div>
  );
}
