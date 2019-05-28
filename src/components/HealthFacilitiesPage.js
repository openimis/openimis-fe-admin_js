import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";


class HealthFacilitiesPage extends Component {
    render() {
        return <ProxyPage url="/FindHealthFacility.aspx" />
    }
}

export { HealthFacilitiesPage };