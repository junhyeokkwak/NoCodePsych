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
  responseOptions: [],
};

const emptyContent = {
  type: "text",
  value: "",
};

const emptyResponse = {
  label: "",
  key: "",
};

export const SectionEditor = ({
  timeline,
  index,
  handleEditorChange,
  editorToTimeline,
  directories,
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
    const newPageList = [...currentSection.pages, { ...emptyPage }];
    handleChange(newPageList, "pages");
  };

  const addContent = (pageIndex) => {
    const newContentList = [
      ...currentSection.pages[pageIndex].contents,
      { ...emptyContent },
    ];
    handlePageChange(newContentList, pageIndex, "contents");
  };

  const deleteContent = (pageIndex, contentIndex) => {
    const newContentList = [...currentSection.pages[pageIndex].contents];
    newContentList.splice(contentIndex, 1);
    handlePageChange(newContentList, pageIndex, "contents");
  };

  const deletePage = (pageIndex) => {
    const newPageList = [...currentSection.pages];
    newPageList.splice(pageIndex, 1);
    handleChange(newPageList, "pages");
  };

  const addResponse = (pageIndex) => {
    const newResponseList = [
      ...currentSection.pages[pageIndex].responseOptions,
      { ...emptyResponse },
    ];
    handlePageChange(newResponseList, pageIndex, "responseOptions");
  };

  const handleResponseChange = (newValue, responseIndex, pageIndex, key) => {
    const newResponseList = [
      ...currentSection.pages[pageIndex].responseOptions,
    ];
    newResponseList[responseIndex][key] = newValue;
    handlePageChange(newResponseList, pageIndex, "responseOptions");
  };

  const deleteResponse = (pageIndex, responseIndex) => {
    const newResponseList = [
      ...currentSection.pages[pageIndex].responseOptions,
    ];
    newResponseList.splice(responseIndex);
    handlePageChange(newResponseList, pageIndex, "responseOptions");
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
      {currentSection.type === "trial" &&
        Boolean("trialNum" in currentSection) && (
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
      {currentSection &&
        currentSection.pages.map((pageData, pageIndex) => (
          <Paper
            style={{ width: "100%", margin: 20 }}
            elevation={3}
            key={pageIndex}
          >
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
                  <Typography variant="subtitle2">Response Options</Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={() => {
                      addResponse(pageIndex);
                    }}
                  >
                    + Add option
                  </Button>
                </Grid>
              </Grid>
              {pageData.responseOptions.map((responseOption, responseIndex) => (
                <Grid
                  container
                  item
                  xs={12}
                  spacing={2}
                  alignItems="center"
                  key={responseIndex}
                >
                  <Grid item xs={5}>
                    <TextField
                      label="Response label"
                      value={responseOption.label}
                      variant="outlined"
                      onChange={(e) => {
                        handleResponseChange(
                          e.target.value,
                          responseIndex,
                          pageIndex,
                          "label"
                        );
                      }}
                      fullWidth
                    ></TextField>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      select
                      label="Mapped key"
                      value={responseOption.key}
                      disabled={pageData.responseType === "mouse"}
                      variant="outlined"
                      onChange={(e) => {
                        handleResponseChange(
                          e.target.value,
                          responseIndex,
                          pageIndex,
                          "key"
                        );
                      }}
                      fullWidth
                    >
                      <MenuItem value={"f"}>F</MenuItem>
                      <MenuItem value={"j"}>J</MenuItem>
                      <MenuItem value={"space"}>Space</MenuItem>
                      <MenuItem value={"enter"}>Enter</MenuItem>
                      <MenuItem value={"1"}>1</MenuItem>
                      <MenuItem value={"2"}>2</MenuItem>
                      <MenuItem value={"3"}>3</MenuItem>
                      <MenuItem value={"4"}>4</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      fullWidth
                      onClick={() => {
                        deleteResponse(pageIndex, responseIndex);
                      }}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              ))}
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
                <Grid
                  container
                  item
                  xs={12}
                  spacing={2}
                  alignItems="center"
                  key={contentIndex}
                >
                  <Grid item xs={2}>
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
                    {pageContent.type === "text" ? (
                      <TextField
                        label={"Text"}
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
                    ) : (
                      <TextField
                        label={"Source directory"}
                        value={pageContent.value}
                        fullWidth
                        select
                        onChange={(e) => {
                          handleContentChange(
                            e.target.value,
                            contentIndex,
                            pageIndex,
                            "value"
                          );
                        }}
                      >
                        {directories.map((dirObj, i) => (
                          <MenuItem value={dirObj.directoryName} key={i}>
                            {dirObj.directoryName}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      fullWidth
                      onClick={() => {
                        deleteContent(pageIndex, contentIndex);
                      }}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid container item xs={12} justifyContent="center">
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    fullWidth
                    onClick={() => {
                      deletePage(pageIndex);
                    }}
                  >
                    Delete Page
                  </Button>
                </Grid>
              </Grid>
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
