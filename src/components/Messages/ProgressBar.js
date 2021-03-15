import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ percentageUploaded, uploadState }) => {
  return (
    uploadState === "uploading" && (
      <Progress
        className="progress__bar"
        percent={percentageUploaded}
        indicating
        progress
        size="medium"
        inverted
      />
    )
  );
};

export default ProgressBar;
