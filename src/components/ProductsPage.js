import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";

class ProductsPage extends Component {
  render() {
    return <ProxyPage url="/FindProduct.aspx" />;
  }
}

export { ProductsPage };
