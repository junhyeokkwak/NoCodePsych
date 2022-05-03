import React, { useState } from "react";
import { Grid, Button, Box, Typography, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { DefaultButton } from "@/components/input/buttons";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Loading } from "../surface/loading";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ImageUpload = (props) => {
  const { uid, directory = "", onImageUploadComplete } = { ...props };
  const [blob, setBlob] = useState(null);
  const [inputImages, setInputImages] = useState([]);
  const [submitButtonActive, setSubmitButtonActive] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const [loading, setLoading] = React.useState(false);
  const storage = getStorage();

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const getBlob = (blob) => {
    // pass blob up from the ImageCropper component
    setBlob(blob);
    // make button active if blob changed
    setSubmitButtonActive(true);
  };

  const checkImageDimensions = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const image = new Image();
      reader.onload = (event) => {
        image.src = event.target.result;
      };
      reader.onerror = (err) => reject(err);
      image.onload = () => {
        console.log(image.width);
        resolve(image.width);
        resolve(image.height);
        return {
          width: image.width,
          height: image.height,
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file) => {
    const fileSize = file.size / 1024 / 1024;
    if (fileSize > 4) {
      alert("file exceeds 4MB"); // !!! change to snackbar message
    } else {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = () => {
          const image = new Image();
          image.src = reader.result;
          image.onload = function () {
            console.log({ width: image.width, height: image.height });
            const fileName = file.name;
            const height = image.height;
            const width = image.width;
            const timestamp = Date.now();
            // upload image to firebase storage
            const imageRef = ref(storage, `/${uid}/${directory}/${fileName}`);
            uploadBytes(imageRef, file)
              .then(async (snapshot) => {
                getDownloadURL(imageRef).then((url) => {
                  // update firestore
                  const imageObject = { url, fileName, height, width };
                  resolve(imageObject);
                  // setTempArr([...tempArr, imageObject]);
                });
              })
              .catch((error) => {
                console.log("error occurred");
                console.error(error.message);
              });
          };
        };
      });
    }
  };

  const onInputChange = async (e) => {
    setLoading(true);
    const tempArr = [];
    for (const file of [...e.target.files]) {
      const imageObject = await handleImageUpload(file);
      console.log(imageObject);
      tempArr.push(imageObject);
      console.log(tempArr);
    }
    setInputImages(tempArr);
    setSnackbarOpen(true);
    setLoading(false);
    // uploadImages(tempArr); // !!! TODO
  };

  React.useEffect(() => {
    if (inputImages && inputImages.length > 0) {
      onImageUploadComplete(inputImages);
    }
  }, [inputImages]);

  return (
    <Grid item xs={12}>
      <Loading loading={loading} />
      <Grid container justify="flex-start" spacing={1}>
        <Grid item xs={12}>
          <label htmlFor="upload-photo">
            <input
              style={{ display: "none" }}
              type="file"
              accept="image/*"
              id="upload-photo"
              name="upload-photo"
              multiple
              onChange={onInputChange}
            />
            <Button
              component="span"
              fullWidth
              variant="outlined"
              color="secondary"
            >
              Upload image
            </Button>
          </label>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ImageUpload;
