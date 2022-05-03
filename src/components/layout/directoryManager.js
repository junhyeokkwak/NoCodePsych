import * as React from "react";
import {
  Button,
  Typography,
  TextField,
  Grid,
  Divider,
  MenuItem,
  Paper,
  Avatar,
} from "@mui/material";
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
import { useDispatch, useSelector } from "react-redux";
import { StandardDialog } from "@/components/layout/dialog";
import ImageUpload from "../input/imageUpload";

const dummyDirectoryData = [
  {
    directoryName: "examples",
    url: "",
  },
  {
    directoryName: "mainExperiment",
    url: "",
  },
];

export const DirectoryManager = ({
  directoryData = dummyDirectoryData,
  handleChange,
}) => {
  const [currentDirectory, setCurrentDirectory] = React.useState("");
  const [currentDirectoryImages, setCurrentDirectoryImages] = React.useState(
    []
  );
  const [open, setOpen] = React.useState(false);
  const [newDirectoryName, setNewDirectoryName] = React.useState("");
  const { firstName, uid } = useSelector((state) => state.account);
  const handleClose = () => {
    setOpen(false);
  };
  const handleNewDirectory = async () => {
    // add directory to this user's doc
    await updateDoc(doc(db, "users", uid), {
      directories: arrayUnion({
        directoryName: newDirectoryName,
        images: [],
      }),
    });
    setNewDirectoryName("");
    setOpen(close);
    handleChange();
  };

  React.useEffect(() => {
    directoryData.forEach((dirObj) => {
      if (dirObj.directoryName === currentDirectory) {
        setCurrentDirectoryImages(dirObj.images);
      }
    });
  }, [currentDirectory]);

  const onImageUploadComplete = async (newImgData) => {
    console.log(newImgData);
    const newDirectories = [...directoryData];
    setCurrentDirectoryImages([...currentDirectoryImages, ...newImgData]);
    newDirectories.forEach((dirObj, i) => {
      if (dirObj.directoryName === currentDirectory) {
        dirObj.images = [...dirObj.images, ...newImgData];
      }
    });
    console.log(newDirectories);
    await updateDoc(doc(db, "users", uid), {
      directories: newDirectories,
    });
    handleChange();
  };

  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Directory Manager</Typography>
      </Grid>

      <Grid item xs={6}>
        <TextField
          select
          label="Select directory"
          value={currentDirectory}
          variant="outlined"
          fullWidth
          onChange={(e) => {
            setCurrentDirectory(e.target.value);
          }}
          size="small"
        >
          {directoryData.map((dataObj) => (
            <MenuItem value={dataObj.directoryName}>
              {dataObj.directoryName}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid container item xs={3}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            setOpen(true);
          }}
        >
          + New Directory
        </Button>
      </Grid>
      <Grid container item xs={3}>
        <ImageUpload
          uid={uid}
          directory={currentDirectory}
          onImageUploadComplete={onImageUploadComplete}
        />
        {/* <Button
          variant="outlined"
          color="secondary"
          disabled={currentDirectory === ""}
          fullWidth
        >
          Upload image
        </Button> */}
      </Grid>
      <Grid container item xs={12} spacing={1}>
        {currentDirectoryImages.map((imageObj, i) => (
          <Grid item xs={4} key={i}>
            <img
              src={imageObj?.url}
              style={{ width: "100%", aspectRatio: "1200 / 900" }}
            />
            {/* <Typography>{imageUrl}</Typography> */}
          </Grid>
        ))}
      </Grid>
      <StandardDialog
        open={open}
        handleClose={handleClose}
        title="Name your new directory"
        actionButtonLabels={["Continue", "Cancel"]}
        actionButtonHandlers={[handleNewDirectory, handleClose]}
      >
        <Grid container item xs={12} justifyContent="center">
          <Grid container item xs={10} justifyContent="center">
            <TextField
              label="Directory name"
              value={newDirectoryName}
              onChange={(e) => {
                setNewDirectoryName(e.target.value);
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      </StandardDialog>
    </Grid>
  );
};
