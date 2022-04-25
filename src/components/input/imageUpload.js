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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ImageUpload = (props) => {
  const { uid, directory = "", handleImageUrl } = { ...props };
  const [blob, setBlob] = useState(null);
  const [inputImages, setInputImages] = useState([]);
  const [submitButtonActive, setSubmitButtonActive] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
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

  const onInputChange = async (e) => {
    const tempArr = [];
    let failNum = 0;
    let successNum = 0;
    await [...e.target.files].forEach(async (file) => {
      const fileSize = file.size / 1024 / 1024; // in MiB
      if (fileSize > 4) {
        alert("file exceeds 4MB"); // !!! change to snackbar message
      } else {
        const reader = new FileReader();
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
              .then((snapshot) => {
                successNum += 1;
                getDownloadURL(imageRef).then((url) => {
                  // update firestore
                  tempArr.push(url);
                  // updateDoc(doc(db, "users", uid), {
                  //   images: arrayUnion({
                  //     fileName,
                  //     height,
                  //     width,
                  //     url,
                  //     timestamp,
                  //     uid,
                  //   }),
                  // });
                });
              })
              .catch((error) => {
                console.log("error occurred");
                console.error(error.message);
              });
          };
        };
      }
    });

    setInputImages(tempArr);
    setSnackbarOpen(true);
    // uploadImages(tempArr); // !!! TODO
  };

  React.useEffect(() => {
    if (inputImages && inputImages.length > 0) {
      handleImageUrl(inputImages);
    }
  }, [inputImages]);

  const handleSubmitImage = (e) => {
    // upload blob to firebase 'profilePics' folder with filename 'uid'
    e.preventDefault();
    // fire
    //   .storage()
    //   .ref("profilePics")
    //   .child(uid)
    //   .put(blob, { contentType: blob.type })
    //   .then(async (snapshot) => {
    //     await snapshot.ref.getDownloadURL().then((downloadURL) => {
    //       db.collection("users").doc(uid).update({
    //         profilePicURL: downloadURL,
    //       });
    //       if (handleURLChange) handleURLChange(downloadURL); // function that sends the URL up to the parent component
    //     });
    //     setSnackbarSeverity("success");
    //     setSnackbarMessage("Profile picture successfully updated!");
    //     setSnackbarOpen(true);
    //     setSubmitButtonActive(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     setSnackbarSeverity("error");
    //     setSnackbarMessage(error.message);
    //   });
  };

  return (
    <Grid item xs={12}>
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
