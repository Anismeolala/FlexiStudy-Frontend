import "react-pro-sidebar/dist/css/styles.css";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaCode } from "react-icons/fa";
import { MdCorporateFare } from "react-icons/md";
import { MdOutlineAnalytics } from "react-icons/md";
import { PiShoppingBagOpenBold } from "react-icons/pi";
import { message, Tooltip } from "antd";
import { BiSolidNews } from "react-icons/bi";
import { MdOutlineConfirmationNumber } from "react-icons/md";

import "./Sidebar.css";

const Sidebar = ({ collapsed, toggled, handleToggleSidebar }) => {
  const navigate = useNavigate();
  // const isCanManageBusRoute = usePermission("BUS_ROUTE_MANAGE");
  // const isCanManageStation = usePermission("STATION_MANAGE");
  // const isCanManagePrice = usePermission("PRICE_MANAGE");
  // const isCanManageTicketOrder = usePermission("TICKET_ORDER_MANAGE");
  // const isCanManageContent = usePermission("CONTENT_MANAGE");
  // const isCanManageLine = usePermission("LINE_MANAGE");
  // const isCanManageUser = usePermission("CUSTOMER_MANAGE");
  // const isCanViewDashboard = usePermission("DASHBOARD_VIEW");

  return (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div className="sidebar-header" onClick={() => navigate(".")}>
          <img
            src="/logo2.png"
            alt="Flexistudy Logo"
            className="sidebar-logo"
          />
        </div>
      </SidebarHeader>
      <button
        className="sidebar-toggle-button"
        onClick={() => handleToggleSidebar()}
      >
        {collapsed ? ">>" : "<<"}
      </button>

      <SidebarContent>
        <Menu iconShape="circle">
          <Tooltip placement="right" title={collapsed ? "Dashboard" : ""}>
            <MenuItem icon={<MdOutlineAnalytics />} className="pro-menu-item">
              Dashboard
              <Link to={"."} />
            </MenuItem>
          </Tooltip>

          <Tooltip placement="right" title={collapsed ? "Người dùng" : ""}>
            <MenuItem icon={<FaUser />} className="pro-menu-item">
              Người dùng
              <Link to={"/admin/manage-users"} />
            </MenuItem>
          </Tooltip>

          <Tooltip placement="right" title={collapsed ? "Công ty" : ""}>
            <MenuItem icon={<MdCorporateFare />} className="pro-menu-item">
              Công ty
              <Link to={"/admin/manage-companies"} />
            </MenuItem>
          </Tooltip>

          <Tooltip placement="right" title={collapsed ? "Việc làm" : ""}>
            <MenuItem
              icon={<PiShoppingBagOpenBold />}
              className="pro-menu-item"
            >
              Việc làm
              <Link to={"/admin/manage-jobs"} />
            </MenuItem>
          </Tooltip>

          <Tooltip placement="right" title={collapsed ? "Tin tức" : ""}>
            <MenuItem icon={<BiSolidNews />} className="pro-menu-item">
              Tin tức
              <Link to={"/admin/manage-career-guide"} />
            </MenuItem>
          </Tooltip>

          <Tooltip placement="right" title={collapsed ? "Verify Company" : ""}>
            <MenuItem
              icon={<MdOutlineConfirmationNumber />}
              className="pro-menu-item"
            >
              Verify Company
              <Link to={"/admin/Verify-info-company"} />
            </MenuItem>
          </Tooltip>

          <Tooltip placement="right" title={collapsed ? "Developer Tools" : ""}>
            <MenuItem
              icon={<FaCode />}
              className="pro-menu-item"
              onClick={() => message.info("Chức năng đang được phát triển")}
            >
              Developer Tools
            </MenuItem>
          </Tooltip>
          <Tooltip
            placement="right"
            title={collapsed ? "Quản lý role & permission" : ""}
          >
            <MenuItem
              icon={<FaLock />}
              className="pro-menu-item"
              onClick={() => message.info("Chức năng đang được phát triển")}
            >
              Quản lý role & permission
            </MenuItem>
          </Tooltip>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export default Sidebar;
