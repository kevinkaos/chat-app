import React from "react";
import { Loader, Dimmer } from "semantic-ui-react";

const Spinner = () => {
  return (
    <Dimmer active inverted>
      <Loader size="huge">Getting ready...</Loader>
    </Dimmer>
  );
};

export default Spinner;
