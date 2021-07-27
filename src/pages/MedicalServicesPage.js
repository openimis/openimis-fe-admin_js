import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";

class MedicalServicesPage extends Component {
  render() {
    return <ProxyPage url="/FindMedicalService.aspx" />;
  }
}

export { MedicalServicesPage };
