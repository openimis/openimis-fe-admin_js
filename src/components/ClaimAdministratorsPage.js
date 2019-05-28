import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";


class ClaimAdministratorsPage extends Component {
    render() {
        return <ProxyPage url="/FindClaimAdministrator.aspx" />
    }
}

export { ClaimAdministratorsPage };