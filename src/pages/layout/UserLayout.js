import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderBar from "../../components/Header/Header";
import AppFooter from "../../components/footer/Footer";
import "./UserLayout.css";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";

const { Header, Content, Footer } = Layout;

export default function UserLayout() {
  return (
    <>
    <ScrollToTop />
    <Layout >
      <Header className="layout-header">
        <HeaderBar />
      </Header>

      <Content className="layout-content">
        <Outlet />
      </Content>

      <Footer className="layout-footer">
        <AppFooter />
      </Footer>
    </Layout>
    </>
  );
}
