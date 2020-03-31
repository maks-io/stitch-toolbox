import React, { Component } from "react";
import { Form, Formik } from "formik";
import { Checkbox, Button } from "antd";
import Field from "../components/Field";
import RadioGroup from "../components/RadioGroup";
import Arrow from "../components/Arrow";
import { doAction } from "../stitchActions/actions";

const availableStitchActions = [
  { label: "Delete All Documents", value: "deleteAllDocuments" },
  { label: "Move Documents", value: "moveDocuments" },
  { label: "Copy Documents", value: "copyDocuments" }
  // { label: "Swap Documents", value: "swapDocuments" } TODO
];

class MainScreen extends Component {
  state = { initialValues: undefined };

  componentDidMount = () => {
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    const initialValues = {
      stitchClientAppId: searchParams.get("stitchClientAppId"),
      databaseA: searchParams.get("databaseA"),
      collectionA: searchParams.get("collectionA"),
      databaseB: searchParams.get("databaseB"),
      collectionB: searchParams.get("collectionB")
    };
    this.setState({ initialValues });
  };

  handleSubmit = async (values, actions) => {
    const selectedAction = availableStitchActions.filter(
      a => a.value === values.action
    )[0];

    await doAction(
      selectedAction.value,
      values.stitchClientAppId,
      { database: values.databaseA, collection: values.collectionA },
      { database: values.databaseB, collection: values.collectionB },
      values.options
    );

    actions.setSubmitting(false);
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginTop: "2rem"
        }}
      >
        <h1>Stitch Toolbox</h1>
        {!this.state.initialValues && <div>Please wait...</div>}
        {this.state.initialValues && (
          <Formik
            initialValues={{
              options: { keepIds: false },
              action: "copyDocuments",
              ...this.state.initialValues
            }}
            onSubmit={this.handleSubmit}
          >
            {({ values, handleSubmit, isSubmitting, setFieldValue }) => {
              const selectedAction = availableStitchActions.filter(
                a => a.value === values.action
              )[0];

              const columnBActive =
                selectedAction.value !== "deleteAllDocuments";

              return (
                <Form onSubmit={handleSubmit}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      alignItems: "center"
                    }}
                  >
                    <Field
                      label={"Stitch Client App ID"}
                      name={"stitchClientAppId"}
                    />
                    <RadioGroup
                      label="Action"
                      name="action"
                      setFieldValue={setFieldValue}
                      initialValue={values.action}
                      values={availableStitchActions}
                    />
                    <Checkbox
                      disabled={selectedAction.value === "deleteAllDocuments"}
                      onChange={e =>
                        setFieldValue("options.keepIds", e.target.checked)
                      }
                    >
                      Keep original ObjectIds
                    </Checkbox>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flex: 1,
                        justifyContent: "center",
                        marginTop: "2rem"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "20rem"
                        }}
                      >
                        <Field label="Database A" name="databaseA" />
                        <Field label="Collection A" name="collectionA" />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "3rem"
                        }}
                      >
                        <Arrow selectedAction={selectedAction} />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "20rem",
                          opacity: !columnBActive && 0.3,
                          pointerEvents: !columnBActive && "none"
                        }}
                      >
                        <Field label="Database B" name="databaseB" />
                        <Field label="Collection B" name="collectionB" />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "10rem",
                        marginTop: "2rem"
                      }}
                    >
                      <Button
                        htmlType={"submit"}
                        type="primary"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        danger={selectedAction.value === "deleteAllDocuments"}
                      >
                        {selectedAction.label}
                      </Button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        )}
      </div>
    );
  }
}

export default MainScreen;
