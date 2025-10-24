import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import {
  Table,
  Input,
  Tag,
  Button,
  Tabs,
  Space,
  Image,
  message,
  Modal,
  Descriptions,
  Tooltip,
  Form,
} from "antd";
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { MdOutlineConfirmationNumber } from "react-icons/md";

import {
  getAllCompaniesAPI,
  approveCompanyAPI,
  rejectCompanyAPI,
  getCompanyByIdAPI,
} from "../../apis";

const ManageCompanyVerification = () => {
  const dispatch = useDispatch();

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [rejectReason, setRejectReason] = useState("");
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedRejectId, setSelectedRejectId] = useState(null);

  useEffect(() => {
    dispatch(
      setLayoutData({
        title: "Quản lý xác thực công ty",
        icon: <MdOutlineConfirmationNumber />,
      })
    );
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await getAllCompaniesAPI({ page: 1, size: 100 });
      const list = res?.result?.data || [];

      const formatted = list.map((c) => ({
        id: c.id,
        name: c.name,
        logoUrl: c.logoUrl,
        website: c.website,
        status: c.verificationStatus || "UNVERIFIED",
        imageUrl: c.verificationImageUrl,
        email: c.email,
        createdAt: c.createdAt,
      }));
      setData(formatted);
    } catch (error) {
      message.error("Không tải được danh sách công ty");
    }
  };

  const updateStatus = async (id, status, reason) => {
    console.log("Gửi request cập nhật:", {
      companyId: id,
      status,
      reason,
    });

    try {
      let res;
      if (status === "APPROVED") {
        res = await approveCompanyAPI(id, null);
      } else {
        res = await rejectCompanyAPI(id, reason || "No reason provided");
      }

      if (!res) {
        message.error("Không nhận phản hồi từ server!");
        return;
      }

      if (res?.code !== 1000 && res?.code !== 0) {
        message.warning(res?.message || "Backend trả code lạ");
      }

      message.success(
        status === "APPROVED"
          ? " Cập nhật: Đã duyệt công ty"
          : " Cập nhật: Đã từ chối công ty"
      );

      await fetchCompanies();
    } catch (error) {
      console.error("🔴 [DEBUG] Error catch:", error);
      console.error("🔴 Backend ERROR:", error?.response?.data);

      message.error(
        error?.response?.data?.message || "Lỗi khi cập nhật trạng thái công ty!"
      );
    }
  };

  const showDetails = async (record) => {
    try {
      const res = await getCompanyByIdAPI(record.id);
      setSelectedCompany(res.result || record);
      setModalVisible(true);
    } catch {
      message.error("Không thể tải chi tiết công ty");
    }
  };

  const filteredData = data.filter((i) => {
    const matchStatus = statusFilter === "ALL" || i.status === statusFilter;
    const matchSearch = i.name
      ?.toLowerCase()
      .includes(searchValue.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusTag = (status) => {
    const statusMap = {
      UNVERIFIED: { color: "gray", text: "Chưa gửi" },
      PENDING: { color: "orange", text: "Chờ duyệt" },
      VERIFIED: { color: "green", text: "Đã duyệt" },
      REJECTED: { color: "red", text: "Đã từ chối" },
      SUSPENDED: { color: "purple", text: "Tạm khóa" },
    };

    const { color, text } = statusMap[status] || {
      color: "blue",
      text: status,
    };

    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "logoUrl",
      render: (url) => <Image width={40} src={url} preview={false} />,
    },
    { title: "Tên công ty", dataIndex: "name" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => statusTag(s),
    },
    {
      title: "Hành động",
      width: 200,
      render: (_, record) => {
        const s = record.status;

        return (
          <Space>
            <Tooltip title="Xem chi tiết">
              <Button
                icon={<EyeOutlined />}
                type="text"
                onClick={() => showDetails(record)}
              />
            </Tooltip>

            {s === "PENDING" && (
              <>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => updateStatus(record.id, "APPROVED")}
                  size="small"
                >
                  Duyệt
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setSelectedRejectId(record.id);
                    setRejectModalVisible(true);
                  }}
                  size="small"
                >
                  Từ chối
                </Button>
              </>
            )}

            {/* REJECTED → Cho phép duyệt lại */}
            {s === "REJECTED" && (
              <Button
                icon={<CheckOutlined />}
                type="primary"
                onClick={() => updateStatus(record.id, "APPROVED")}
                size="small"
              >
                Duyệt lại
              </Button>
            )}

            {/* VERIFIED / UNVERIFIED / SUSPENDED → Không hành động */}
            {["VERIFIED", "UNVERIFIED", "SUSPENDED"].includes(s) && (
              <Tag color="blue">Đã xử lý</Tag>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Tabs
        defaultActiveKey="ALL"
        items={[
          { label: "Tất cả", key: "ALL" },
          { label: "Chờ duyệt", key: "PENDING" },
          { label: "Đã duyệt", key: "VERIFIED" },
          { label: "Từ chối", key: "REJECTED" },
        ]}
        onChange={(k) => setStatusFilter(k)}
        style={{ marginBottom: 16 }}
      />

      <Input
        placeholder="Tìm kiếm theo tên công ty..."
        prefix={<SearchOutlined />}
        style={{ width: 300, marginBottom: 16 }}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <Table
        rowKey="id"
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 6 }}
      />

      <Modal
        title="Chi tiết xác thực công ty"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCompany && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Tên công ty">
              {selectedCompany.name}
            </Descriptions.Item>
            <Descriptions.Item label="Website">
              {selectedCompany.website || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {statusTag(selectedCompany.verificationStatus)}
            </Descriptions.Item>
            <Descriptions.Item label="Ảnh xác minh">
              <Image width={100} src={selectedCompany.verificationImageUrl} />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* ❌ Modal nhập lý do từ chối */}
      <Modal
        title="Nhập lý do từ chối"
        open={rejectModalVisible}
        okText="Từ chối"
        okButtonProps={{ danger: true }}
        onCancel={() => setRejectModalVisible(false)}
        onOk={() => {
          updateStatus(selectedRejectId, "REJECTED", rejectReason);
          setRejectReason("");
          setRejectModalVisible(false);
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Lý do từ chối">
            <Input.TextArea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ManageCompanyVerification;
