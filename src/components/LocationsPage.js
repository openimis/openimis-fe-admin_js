import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";


class LocationsPage extends Component {
    render() {
        return <ProxyPage url="/Locations.aspx" />
    }
}

export { LocationsPage };