import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";


class UserProfilesPage extends Component {
    render() {
        return <ProxyPage url="/FindProfile.aspx" />
    }
}

export { UserProfilesPage };