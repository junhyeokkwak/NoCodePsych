import * as React from "react";
import {
  Button,
  Typography,
  TextField,
  Grid,
  Divider,
  MenuItem,
  Paper,
} from "@mui/material";

function capitalize(inputString) {
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

const emptyPage = {
  displayTime: null,
  responseType: "keyboard",
  contents: [],
};

const emptyContent = {
  type: "text",
  value: "",
};

export const SectionEditor = ({
  timeline,
  index,
  handleEditorChange,
  editorToTimeline,
}) => {
  const [currentSection, setCurrentSection] = React.useState(timeline[index]);
  const handleChange = (newValue, key) => {
    const newCurrentSection = { ...currentSection };
    console.log(newCurrentSection);
    newCurrentSection[key] = newValue;
    setCurrentSection(newCurrentSection);
  };

  const handlePageChange = (newValue, pageIndex, key) => {
    const newPageList = [...currentSection.pages];
    newPageList[pageIndex][key] = newValue;
    handleChange(newPageList, "pages");
  };

  const handleContentChange = (newValue, contentIndex, pageIndex, key) => {
    const newContentList = [...currentSection.pages[pageIndex].contents];
    newContentList[contentIndex][key] = newValue;
    handlePageChange(newContentList, pageIndex, "contents");
  };

  const addPage = () => {
    const newPageList = [...currentSection.pages, emptyPage];
    handleChange(newPageList, "pages");
  };

  const addContent = (pageIndex) => {
    const newContentList = [
      ...currentSection.pages[pageIndex].contents,
      emptyContent,
    ];
    handlePageChange(newContentList, pageIndex, "contents");
  };

  React.useEffect(() => {
    handleEditorChange(index, currentSection);
  }, [currentSection]);

  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Label"
          value={currentSection.label}
          fullWidth
          onChange={(e) => {
            handleChange(e.target.value, "label");
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Type"
          value={capitalize(currentSection.type)}
          fullWidth
          disabled
        />
      </Grid>
      {currentSection.type === "trial" && currentSection.trialNum && (
        <Grid item xs={12}>
          <TextField
            label="Number of trials"
            value={currentSection.trialNum}
            fullWidth
            onChange={(e) => {
              handleChange(e.target.value, "trialNum");
            }}
          />
        </Grid>
      )}
      <Grid item xs={12} style={{ paddingTop: 30 }}>
        <Divider />
      </Grid>
      <Grid container item xs={12} justifyContent="flex-start" spacing={2}>
        <Grid item>
          <Typography variant="subtitle1">Pages</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              addPage();
            }}
          >
            + Add page
          </Button>
        </Grid>
      </Grid>
      {currentSection.pages.map((pageData, pageIndex) => (
        <Paper style={{ width: "100%", margin: 20 }} elevation={3}>
          <Grid container item xs={12} style={{ padding: 30 }} spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Display time"
                value={pageData.displayTime}
                fullWidth
                onChange={(e) => {
                  handlePageChange(e.target.value, pageIndex, "displayTime");
                }}
                helperText="Leaving this blank will make the page displayed indefinitely."
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Response type"
                value={pageData.responseType}
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  handlePageChange(e.target.value, pageIndex, "responseType");
                }}
              >
                <MenuItem value={"keyboard"}>Keyboard</MenuItem>
                <MenuItem value={"mouse"}>Mouse</MenuItem>
                <MenuItem value={"both"}>Both</MenuItem>
              </TextField>
            </Grid>
            <Grid
              container
              item
              xs={12}
              justifyContent="flex-start"
              spacing={2}
              alignItems="center"
            >
              <Grid item>
                <Typography variant="subtitle2">Contents</Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    addContent(pageIndex);
                  }}
                >
                  + Add content
                </Button>
              </Grid>
            </Grid>
            {pageData.contents.map((pageContent, contentIndex) => (
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    select
                    label="Content type"
                    value={pageContent.type}
                    variant="outlined"
                    onChange={(e) => {
                      handleContentChange(
                        e.target.value,
                        contentIndex,
                        pageIndex,
                        "type"
                      );
                    }}
                    fullWidth
                  >
                    <MenuItem value={"text"}>Text</MenuItem>
                    <MenuItem value={"image"}>Image</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    label={
                      pageContent.type === "text" ? "Text" : "Source directory"
                    }
                    value={pageContent.value}
                    fullWidth
                    onChange={(e) => {
                      handleContentChange(
                        e.target.value,
                        contentIndex,
                        pageIndex,
                        "value"
                      );
                    }}
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
      <Grid container item xs={12} justifyContent="center">
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={() => {
            editorToTimeline();
          }}
          style={{ paddingLeft: 20, paddingRight: 20 }}
        >
          Return to timeline
        </Button>
      </Grid>

      {/* <TextField
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
      /> */}
    </Grid>
  );
};
