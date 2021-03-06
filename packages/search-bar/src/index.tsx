/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from "react";
import { SchemaForm, Submit, createFormActions } from "@uform/antd";
import { Button } from "antd";

import "./index.scss";

interface Props {
  isOneTimeReset?: boolean; // NOTE:一次性重置标识
  schema: object;
  onCaptureForm: Function;
  onSearchReset?: Function;
  initialValues?: any;
  inline?: boolean;
  labelCol?: number;
  wrapperCol?: number;
  border?: boolean;
}
interface State {
  isSearch: boolean;
  hasReset?: boolean;
}

const actions = createFormActions();

export default class SearchBar extends PureComponent<Props, State> {
  state: State = {
    isSearch: false,
    hasReset: false // NOTE: 用于从 /order/list?uid=xxx 跳转到 /order/list 重新搜索框的标识
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.isOneTimeReset && !state.hasReset) {
      actions.reset(true, false);
      return {
        hasReset: true,
        isSeach: false
      };
    }
    return null;
  }

  onSubmit = (v: any) => {
    // NOTE:剔除无效值
    Object.keys(v).map(key => {
      // NOTE:非 true 值都是无效值
      if (!v[key]) {
        delete v[key];
      }
    });
    // NOTE: 应该判断当 v 是空对象时不触发
    if (Object.keys(v).length > 0) {
      /* eslint-disable-next-line */
      this.props.onCaptureForm(v);
      this.setState({
        isSearch: true
      });
    }
  };

  onReset = () => {
    const { onSearchReset } = this.props;
    if (onSearchReset) {
      onSearchReset();
    }
    actions.reset(true, false);
    this.setState({
      isSearch: false
    });
  };

  render() {
    const { schema, inline, labelCol, wrapperCol, border, initialValues } = this.props;
    const { isSearch } = this.state;
    return (
      <div className={`search_bar--box ${border ? "border" : ""}`}>
        <SchemaForm
          inline={inline === undefined ? true : inline}
          onSubmit={this.onSubmit}
          actions={actions}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          schema={schema}
          initialValues={initialValues}
        >
          <div className="btn_search_group">
            <Submit>查询</Submit>
            <div className="space w20" />
            {isSearch ? (
              <Button type="primary" onClick={this.onReset}>
                全部
              </Button>
            ) : (
              ""
            )}
          </div>
        </SchemaForm>
      </div>
    );
  }
}
