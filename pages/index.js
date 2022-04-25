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
import { collection, setDoc, getDoc, doc } from "firebase/firestore";
import * as parser from "humanparser";
import { useDispatch, useSelector } from "react-redux";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { setUser } from "@/redux/slices/accountSlice";

export default function Index() {
  const [open, setOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };

  const getDetailedUserDataAndDispatch = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      dispatch(setUser(docSnap.data()));
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      return null;
    }
  };

  const createNewUserInDbAndDispatch = (uid, email, firstName, lastName) => {
    const userData = {
      uid,
      email,
      firstName,
      lastName,
      experiments: [],
      directories: [],
    };
    return setDoc(doc(db, "users", uid), userData).then(() => {
      dispatch(setUser(userData));
    });
  };

  const handleSignInWithGoogle = (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);
    const cachedUserData = {
      uid: "",
      email: "",
      firstName: "",
      lastName: "",
    };
    return signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
        const { firstName, lastName } = parser.parseName(
          result.user.displayName
        );
        console.log(firstName);
        console.log(lastName);
        // if (!result.user.email.includes("@yale.edu")) {
        //   signOut(auth);
        //   throw new Error("Please sign in with your Yale email.");
        // }
        cachedUserData.uid = result.user.uid;
        cachedUserData.email = result.user.email;
        cachedUserData.firstName = firstName;
        cachedUserData.lastName = lastName;
        return getDetailedUserDataAndDispatch(result.user.uid);
      })
      .then((userData) => {
        if (userData === null) {
          // new user
          createNewUserInDbAndDispatch(
            cachedUserData.uid,
            cachedUserData.email,
            cachedUserData.firstName,
            cachedUserData.lastName
          );
          router.push("/home");
        } else {
          router.push("/home");
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(error.message);
        setLoading(false);
        // setErrorMessage(error.message);
        // setSnackbarOpen(true);
        return { error };
      });
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
          <Grid item xs={12} md={8} lg={6}>
            <Button
              fullWidth
              variant="contained"
              onClick={(event) => {
                handleSignInWithGoogle(event);
              }}
            >
              Sign in
            </Button>
          </Grid>
        </Grid>
      </MainBox>
    </div>
  );
}
