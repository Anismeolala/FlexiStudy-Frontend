import React from 'react'
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import { Content } from 'antd/es/layout/layout';
import { Outlet } from "react-router-dom";

const RecruiterLayout = () => {
 return (
    <>
    <ScrollToTop />
      <Content className="layout-content">
        <Outlet />
      </Content>
    </>
  );
}

export default RecruiterLayout