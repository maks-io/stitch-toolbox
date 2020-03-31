import React, { Component } from "react";
import { ArrowRightOutlined, SwapOutlined } from "@ant-design/icons";

class Arrow extends Component {
  render() {
    const { selectedAction } = this.props;

    const SelectedArrowIcon = {
      deleteAllDocuments: () => <div />,
      moveDocuments: ArrowRightOutlined,
      copyDocuments: ArrowRightOutlined,
      swapDocuments: SwapOutlined
    }[selectedAction.value];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center"
        }}
      >
        <SelectedArrowIcon style={{ fontSize: "2rem" }} />
      </div>
    );
  }
}

export default Arrow;
