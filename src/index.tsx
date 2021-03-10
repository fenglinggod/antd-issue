/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react'
import { Tabs } from 'antd'

import './index.less'

const { TabPane } = Tabs

const TestPanel = (): any => {
  const renderTab = (item: any, index: number) => {
    switch (item.key) {
      case 'fB':
        return (
          <TabPane tab="fB" key="fB">
            <div className="segment-search-wrap" />
          </TabPane>
        )
      case 'IS':
        return (
          <TabPane tab="IS" key="IS">
            <div className="segment-search-wrap" />
          </TabPane>
        )
      default:
        return null
    }
  }

  return (
    <div className="homepage-search-tab" style={{ marginTop: renderMargin() }}>
      <Tabs>{renderTab(item, index)}</Tabs>
    </div>
  )
}

export default TestPanel
