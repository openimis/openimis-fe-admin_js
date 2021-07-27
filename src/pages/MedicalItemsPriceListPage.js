import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";

class MedicalItemsPriceListPage extends Component {
  render() {
    return <ProxyPage url="/FindPriceListMI.aspx" />;
  }
}

export { MedicalItemsPriceListPage };
