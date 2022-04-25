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
  Avatar,
} from "@mui/material";
import { dummyTimeline } from "pages";
import { NextSeo } from "next-seo";
import { Loading } from "@/components/surface/loading";
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
import * as _ from "lodash";

const dummyPageArray = [
  {
    displayTime: 5000,
    responseType: "none",
    storeResponse: false,
    contents: [
      {
        type: "text",
        value: "Welcome to the experiment.",
      },
      {
        type: "image",
        value: "https://picsum.photos/200/300",
      },
    ],
    responseOptions: [
      {
        label: "Continue",
        key: "space",
      },
    ],
  },
  {
    displayTime: "",
    responseType: "keyboard",
    storeResponse: true,
    contents: [
      {
        type: "text",
        value: "Would you like to proceed? Press space to continue.",
      },
    ],
    responseOptions: [
      {
        label: "Continue",
        key: "space",
      },
    ],
  },
  {
    displayTime: "",
    responseType: "mouse",
    storeResponse: true,
    contents: [
      {
        type: "text",
        value: "Would you like to proceed? Click the button to continue.",
      },
    ],
    responseOptions: [
      {
        label: "Continue",
        key: "",
      },
    ],
  },
  {
    displayTime: "",
    responseType: "none",
    storeResponse: false,
    contents: [
      {
        type: "text",
        value: "In this experiment, you will see an image like this.",
      },
      {
        type: "image",
        value: "https://picsum.photos/200/300",
      },
    ],
    responseOptions: [],
  },
];

function getDirectoryImagesByName(directories, name) {
  console.log(directories);
  return directories.filter((directory) => directory.directoryName === name)[0]
    .images;
}

function timelineToPageArray(timeline, directories) {
  const output = [];
  timeline.forEach((section) => {
    if (section.type === "instruction") {
      // no loop
      const pagesToAdd = [...section.pages].map((page) => ({
        ...page,
        storeResponse: false,
      }));
      output.push(...pagesToAdd);
    } else if (section.type === "trial") {
      // loop
      // first get all the directories
      const trialNum = section.trialNum;
      // find how many images I need from each directory
      const imageNumPerTrial = {};
      section.pages.forEach((pageObj) => {
        pageObj.contents.forEach((contentObj) => {
          if (contentObj.type === "image") {
            if (contentObj.value in imageNumPerTrial) {
              imageNumPerTrial[contentObj.value] += 1;
            } else {
              imageNumPerTrial[contentObj.value] = 1;
            }
          }
        });
      });
      console.log(imageNumPerTrial);
      const imageDict = {};
      Object.keys(imageNumPerTrial).forEach((dir) => {
        imageDict[dir] = {
          images: _.sampleSize(
            getDirectoryImagesByName(directories, dir),
            imageNumPerTrial[dir] * trialNum
          ),
          index: 0,
        };
      });
      console.log(imageDict);
      for (const i = 0; i < section.trialNum; i++) {
        section.pages.forEach((pageObj) => {
          const thisPage = _.cloneDeep(pageObj); // !! important! otherwise, original page object gets modified
          pageObj.contents.forEach((content, contentIndex) => {
            if (content.type === "image") {
              const thisDir = content.value;
              console.log("loop index: ", i);
              console.log("index: ", contentIndex);
              console.log(Object.keys(imageDict)[0] === thisDir);
              console.log(thisDir);
              thisPage.contents[contentIndex] = {
                ...thisPage.contents[contentIndex],
                value: imageDict[thisDir].images[imageDict[thisDir].index],
              };
              imageDict[thisDir].index += 1;
            }
          });
          output.push(thisPage);
        });
      }
    }
  });
  return output;
}

export default function Preview() {
  const [index, setIndex] = React.useState(0);
  const router = useRouter();
  const { experimentId } = router.query;
  // const pageArray = timelineToPageArray(dummyTimeline); // TODO: fetch from firebase or redux
  const [pageArray, setPageArray] = React.useState([]);
  const [responseData, setResponseData] = React.useState([]);
  const [lastResponse, setLastResponse] = React.useState(null);
  const [dataLoaded, setDataLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    if (pageArray.length === 0) return;
    console.log(index);
    if (index > 0) {
      // store data for previous index
      const previousPage = pageArray[index - 1];
      const toStore = { ...previousPage };
      if (previousPage.storeResponse) {
        toStore["response"] = lastResponse;
      }
      console.log(toStore);
      const newResponseData = [...responseData, toStore];
      setResponseData(newResponseData);
      setLastResponse(null);
    }
    const currentPage = pageArray[index];
    // set display time
    if (currentPage.displayTime) {
      console.log(currentPage.displayTime);
      setTimeout(() => {
        setIndex(index + 1);
      }, currentPage.displayTime);
    }
    if (currentPage.responseOptions && currentPage.responseOptions.length > 0) {
      if (
        currentPage.responseType === "keyboard" ||
        currentPage.responseType === "both"
      ) {
        const pressableKeys = currentPage.responseOptions.map(
          (optionObj) => optionObj.key
        );
        window.addEventListener("keypress", (e) => {
          console.log(e.key);
          console.log(Boolean(e.key === " "));
          const pressedKey = e.key === " " ? "space" : e.key.toLowerCase();
          if (pressableKeys.includes(pressedKey)) {
            const responseLabel = currentPage.responseOptions.filter(
              (obj) => obj.key === pressedKey
            )[0]["label"];
            setLastResponse(responseLabel);
            setIndex(index + 1);
          }
        });
      }
      // if (currentPage.responseType === "mouse" || currentPage.responseType === "both") {

      // }
    }
  }, [dataLoaded, index]);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (!experimentId) return;
      const docRef = doc(db, "experiments", experimentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();
        setName(docData.name);
        // get images
        const uid = docData.ownerId;
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        const directories = userSnap.data().directories;
        const pages = timelineToPageArray(docData.timeline, directories);
        setPageArray(pages);
      }
      setDataLoaded(true);
      setLoading(false);
    }
    if (experimentId && !dataLoaded) fetchData();
  }, [dataLoaded, experimentId]);

  return (
    <div
      style={{
        backgroundColor: Colors.white,
        position: "fixed",
        top: "50%",
        left: "50%",
        /* bring your own prefixes */
        transform: "translate(-50%, -50%)",
      }}
    >
      <Head></Head>
      <NextSeo title={name ? name : "Experiment"} />
      <Loading loading={loading} />
      {dataLoaded && (
        <Grid
          container
          spacing={1}
          justifyContent="center"
          // style={{ height: "100%", width: "100%" }}
          // direction="column"
        >
          <Grid container item xs={12} justifyContent="center">
            {pageArray[index].contents.map((content, i) => (
              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                style={i !== 0 ? { paddingTop: 20 } : {}}
              >
                {content.type === "text" && (
                  <Grid item>
                    <Typography>{content.value}</Typography>
                  </Grid>
                )}
                {content.type === "image" && (
                  <Grid item>
                    <Avatar
                      alt="Remy Sharp"
                      src={content.value}
                      sx={{ width: 300, height: 200 }}
                      variant="square"
                    />
                  </Grid>
                )}
              </Grid>
            ))}
          </Grid>
          <Grid container item xs={12} justifyContent="center">
            {["mouse", "both"].includes(pageArray[index].responseType) &&
              pageArray[index].responseOptions.map((obj) => (
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setLastResponse(obj.label);
                      setIndex(index + 1);
                    }}
                  >
                    {obj.label}
                  </Button>
                </Grid>
              ))}
          </Grid>
        </Grid>
      )}
    </div>
  );
}