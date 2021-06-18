import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";

class PayersPage extends Component {
  render() {
    return <ProxyPage url="/FindPayer.aspx" />;
  }
}

export { PayersPage };
