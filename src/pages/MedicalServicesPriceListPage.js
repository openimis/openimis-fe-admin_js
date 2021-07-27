import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";

class MedicalServicesPriceListPage extends Component {
  render() {
    return <ProxyPage url="/FindPriceListMS.aspx" />;
  }
}

export { MedicalServicesPriceListPage };
