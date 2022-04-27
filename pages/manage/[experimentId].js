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
import CsvDownload from "react-json-to-csv";

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [experimentData, setExperimentData] = React.useState({});
  const [responses, setResponses] = React.useState(null);
  const [dataLoaded, setDataLoaded] = React.useState(false);
  const { firstName, uid } = useSelector((state) => state.account);
  const router = useRouter();
  const { experimentId } = router.query;
  const [loading, setLoading] = React.useState(false);
  const [directories, setDirectories] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (!experimentId) return;
      const docRef = doc(db, "experiments", experimentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data();
        setName(docData.name);
        setExperimentData(docData);
      }
      const dataSnap = await getDoc(doc(db, "data", experimentId));
      if (dataSnap.exists()) {
        const jsonResponses = [];
        dataSnap.data().responses.forEach((responseObj) => {
          // console.log(responseStr);
          const currentData = JSON.parse(responseObj.data);
          console.log(currentData);
          const formattedData = Object.values(currentData)
            .filter((row) => row.storeResponse)
            .map((row) => ({
              displayTime: row.displayTime,
              response: row.response,
              stimuli: row.contents
                .filter((content) => content.value)
                .map((content) => content.value),
            }));
          console.log(formattedData);
          jsonResponses.push(formattedData);
        });
        setResponses(jsonResponses);
      }
      setDataLoaded(true);
      setLoading(false);
    }
    if (experimentId && !dataLoaded) fetchData();
  }, [dataLoaded, experimentId]);

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
          <Grid container item xs={12} spacing={2}>
            {Boolean(responses) &&
              responses.map((data, index) => (
                <Grid
                  container
                  item
                  xs={12}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography>Response #{index + 1}</Typography>
                  </Grid>
                  <Grid item>
                    {/* <Button>Download CSV</Button> */}
                    <CsvDownload
                      data={data}
                      filename="good_data.csv"
                      style={{
                        //pass other props, like styles
                        boxShadow: "inset 0px 1px 0px 0px #e184f3",
                        background:
                          "linear-gradient(to bottom, #c123de 5%, #a20dbd 100%)",
                        backgroundColor: "#c123de",
                        borderRadius: "6px",
                        border: "1px solid #a511c0",
                        display: "inline-block",
                        cursor: "pointer",
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: "bold",
                        padding: "6px 24px",
                        textDecoration: "none",
                        textShadow: "0px 1px 0px #9b14b3",
                      }}
                    >
                      Download CSV
                    </CsvDownload>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </MainBox>
    </div>
  );
}
