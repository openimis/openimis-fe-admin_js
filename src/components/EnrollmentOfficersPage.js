import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";


class EnrollmentOfficersPage extends Component {
    render() {
        return <ProxyPage url="/FindOfficer.aspx" />
    }
}

export { EnrollmentOfficersPage };