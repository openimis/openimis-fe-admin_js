import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";


class UsersPage extends Component {
    render() {
        return <ProxyPage url="/FindUser.aspx" />
    }
}

export { UsersPage };