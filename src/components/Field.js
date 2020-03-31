import React, { Component } from "react";
import { Field as FormikField } from "formik";

class Field extends Component {
  render() {
    const { type = "", name, label, children } = this.props;

    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1,margin:"1rem" }}>
        <label htmlFor={name}>{label}</label>
        <FormikField type={type} name={name}>
          {children}
        </FormikField>
      </div>
    );
  }
}

export default Field;
