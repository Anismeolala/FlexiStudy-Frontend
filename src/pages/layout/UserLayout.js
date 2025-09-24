import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import HeaderBar from "../../components/Header/Header";
import AppFooter from "../../components/footer/AppFooter";
import "./UserLayout.css";
const { Header, Content, Footer } = Layout;

export default function UserLayout() {

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "transparent", padding: 0 }}>
        <HeaderBar />
      </Header>

      <Content className="site-content">
        <Outlet />
      </Content>

      <Footer className="custom-footer">
        <div className="container">
          <AppFooter />
        </div>
      </Footer>
    </Layout>
  );
}