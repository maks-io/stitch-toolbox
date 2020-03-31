import React, { Component } from "react";

class RadioGroup extends Component {
  render() {
    const { initialValue, label, name, values, setFieldValue } = this.props;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          margin: "1rem"
        }}
      >
        <label htmlFor={name}>{label}</label>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            margin: "1rem"
          }}
        >
          {values.map(v => (
            <div
              key={v.value}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                margin: "1rem",
                alignItems: "center",
                justifyContent: "flex-end",
                cursor: "pointer",
                fontWeight: initialValue === v.value && "bold"
              }}
              onClick={() => setFieldValue(name, v.value)}
            >
              <label htmlFor={v.value}>{v.label}</label>
              <input
                type="radio"
                name="test"
                value={v.value}
                checked={initialValue === v.value}
                style={{ pointerEvents: "none", marginTop: "0.6rem" }}
                onChange={() => {}}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default RadioGroup;
