import {
  Card,
  Input,
  Table,
  Skeleton,
  message,
  Avatar,
  Tooltip,
  Space,
  Button,
  Tag,
} from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { MdCorporateFare } from "react-icons/md";
import { FaSubway } from "react-icons/fa";
import { setLayoutData } from "../../redux/layoutSlice";
import {
  getAllCompaniesAPI,
  approveCompanyAPI,
  rejectCompanyAPI,
} from "../../apis";
import "./VerifyCompany.css";

const VerifyCompany = () => {
  const dispatch = useDispatch();
  const [companies, setCompanies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} công ty`,
  });

  // 🔹 Load danh sách công ty
  const loadCompanies = async (options = {}) => {
    const {
      isInitial = false,
      page = pagination.current,
      pageSize = pagination.pageSize,
      search = searchText,
    } = options;

    try {
      isInitial ? setInitialLoading(true) : setLoading(true);
      const response = await getAllCompaniesAPI({
        page,
        size: pageSize,
        search,
      });

      let companyList = [];
      let totalElements = 0;
      if (response?.code === 1000 && response?.result?.data) {
        companyList = response.result.data;
        totalElements = response.result.totalElements;
      } else if (response?.result) {
        companyList = Array.isArray(response.result)
          ? response.result
          : [response.result];
      } else if (Array.isArray(response)) {
        companyList = response;
      }

      const transformed = companyList.map((company) => ({
        id: company.id,
        name: company.name || "Chưa có tên",
        website: company.website || "N/A",
        logoUrl: company.logoUrl || null,
        memberCount: company.memberNumber ?? "N/A",
        verifiedStatus: company.verificationStatus || "UNVERIFIED",
        createdAt: company.createdAt
          ? new Date(company.createdAt).toLocaleDateString("vi-VN")
          : "-",
      }));

      setCompanies(transformed);
      setPagination({
        ...pagination,
        total: totalElements || transformed.length,
        current: page,
        pageSize,
      });
    } catch (error) {
      console.error("Error loading companies:", error);
      message.error("Lỗi khi tải danh sách công ty");
    } finally {
      isInitial ? setInitialLoading(false) : setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(
      setLayoutData({
        title: "Xác minh công ty",
        icon: <MdCorporateFare />,
      })
    );
    loadCompanies({ isInitial: true });
    // eslint-disable-next-line
  }, []);

  // 🔹 Search debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadCompanies({ page: 1, search: searchText });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  // ✅ Duyệt công ty
  const handleApprove = async (id) => {
    try {
      setLoading(true);
      const res = await approveCompanyAPI(id);
      if (res?.code === 0 || res?.code === 1000) {
        message.success("✅ Đã duyệt công ty");
      } else {
        message.warning(res?.message || "Kết quả duyệt không rõ");
      }
      loadCompanies();
    } catch (error) {
      console.error(error);
      message.error(
        error.response?.data?.message || "Không thể duyệt công ty"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Từ chối công ty
  const handleReject = async (id) => {
    try {
      setLoading(true);
      const res = await rejectCompanyAPI(id);
      if (res?.code === 0 || res?.code === 1000) {
        message.warning("❌ Đã từ chối công ty");
      } else {
        message.warning(res?.message || "Kết quả từ chối không rõ");
      }
      loadCompanies();
    } catch (error) {
      console.error(error);
      message.error(
        error.response?.data?.message || "Không thể từ chối công ty"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (paginationConfig) => {
    const { current, pageSize } = paginationConfig;
    loadCompanies({ page: current, pageSize, search: searchText });
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "logoUrl",
      key: "logoUrl",
      width: 100,
      render: (url) => (
        <Avatar shape="square" size={48} src={url} icon={<FaSubway />} />
      ),
    },
    {
      title: "Tên công ty",
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      width: 250,
      ellipsis: { showTitle: false },
      render: (website) => (
        <Tooltip placement="topLeft" title={website}>
          {website}
        </Tooltip>
      ),
    },
    {
      title: "Số lượng thành viên",
      dataIndex: "memberCount",
      key: "memberCount",
      width: 150,
    },
    {
      title: "Trạng thái xác minh",
      dataIndex: "verifiedStatus",
      key: "verifiedStatus",
      width: 200,
      render: (status, record) => {
        if (status === "APPROVED")
          return <Tag color="green">Đã duyệt</Tag>;
        if (status === "REJECTED")
          return <Tag color="red">Đã từ chối</Tag>;

        return (
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record.id)}
              size="small"
            >
              Duyệt
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => handleReject(record.id)}
              size="small"
            >
              Từ chối
            </Button>
          </Space>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
    },
  ];

  return (
    <div className="verify-company-page">
      <Card className="main-card">
        <div className="header-actions">
          <Input
            placeholder="Tìm kiếm công ty..."
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => loadCompanies()}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>

        {initialLoading ? (
          <div style={{ padding: "24px" }}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={companies}
            rowKey="id"
            scroll={{ x: 1000 }}
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
          />
        )}
      </Card>
    </div>
  );
};

export default VerifyCompany;