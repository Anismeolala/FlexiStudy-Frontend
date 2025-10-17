// src/pages/ManagementJob/JobManagement.jsx
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
} from "antd";
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { PiShoppingBagOpenBold } from "react-icons/pi";

import { getAllJobsAdminAPI, updateJobAPI /* , getJobByIdAPI */ } from "../../apis";

const JobManagement = () => {
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | OPEN | CLOSED
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Set layout + fetch list (1 lần) — y chang template xác thực SV
  useEffect(() => {
    dispatch(setLayoutData({ title: "Quản lý việc làm", icon: <PiShoppingBagOpenBold /> }));
    fetchJobs();
  }, [dispatch]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Template kia gọi API không phân trang; ở đây mình nhất quán: lấy tất cả và lọc client
      // Nếu BE của bạn phân trang, có thể gọi size lớn (vd: 1000) hoặc đổi sang server-side sau.
      const res = await getAllJobsAdminAPI({ page: 1, size: 1000 });
      if (res.code === 1000 && Array.isArray(res.result?.data)) {
        const list = res.result.data.map((job) => ({
          id: job.id,
          title: job.title || "Chưa có tiêu đề",
          companyName: job.companyName || "N/A",
          companyLogoUrl: job.companyLogoUrl || null,
          city: job.city || "N/A",
          currency: job.currency || "VND",
          category: job.category || "N/A",
          type: job.type || "N/A",
          mode: job.mode || "N/A",
          minSalary: job.minSalary ?? null,
          maxSalary: job.maxSalary ?? null,
          description: job.description || "",
          status: (job.status || "OPEN").toUpperCase(), // chuẩn hóa
          requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills : [],
          postedAt: job.postedAt ? new Date(job.postedAt).toLocaleDateString("vi-VN") : "-",
          updatedAt: job.updatedAt ? new Date(job.updatedAt).toLocaleDateString("vi-VN") : "-",
        }));
        setData(list);
      } else {
        setData([]);
        message.warning("Không có dữ liệu việc làm.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      message.error("Không thể tải danh sách việc làm");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateJobAPI(id, { status: newStatus });
      // Giữ đúng tinh thần “y chang”: update local state ngay (không refetch)
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      message.success(
        `Đã ${newStatus === "OPEN" ? "mở lại" : "đóng"} công việc ID ${id}`
      );
    } catch (error) {
      console.error(error);
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const showDetails = async (record) => {
    // Nếu bạn cần detail sâu hơn từ BE thì bật getJobByIdAPI ở đây
    // try {
    //   const res = await getJobByIdAPI(record.id);
    //   if (res.code === 1000) {
    //     setSelectedRecord(transformJob(res.result));
    //   } else {
    //     message.error("Không thể lấy chi tiết công việc");
    //     return;
    //   }
    // } catch (e) {
    //   message.error("Không thể tải chi tiết công việc");
    //   return;
    // }
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  // Lọc client y như file mẫu
  const filteredData = data.filter((item) => {
    const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
    const q = searchValue.trim().toLowerCase();
    const matchSearch =
      !q ||
      item.title?.toLowerCase().includes(q) ||
      item.companyName?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const statusColorText = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "OPEN") return { color: "green", text: "Đang mở" };
    if (s === "CLOSED") return { color: "gold", text: "Đã đóng" };
    return { color: "default", text: s || "N/A" };
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "companyLogoUrl",
      width: 80,
      render: (logoUrl) => (
        <Image
          src={logoUrl || "https://via.placeholder.com/50"}
          width={50}
          height={50}
          alt="Logo"
          style={{ objectFit: "contain" }}
          fallback="https://via.placeholder.com/50"
          preview={false}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      width: 260,
      ellipsis: true,
    },
    {
      title: "Công ty",
      dataIndex: "companyName",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Thành phố",
      dataIndex: "city",
      width: 140,
    },
    {
      title: "Ngày đăng",
      dataIndex: "postedAt",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (status) => {
        const { color, text } = statusColorText(status);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Hành động",
      width: 220,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showDetails(record)}
            />
          </Tooltip>
          {record.status === "OPEN" ? (
            <Button
              icon={<CloseOutlined />}
              danger
              onClick={() => handleUpdateStatus(record.id, "CLOSED")}
            >
              Đóng
            </Button>
          ) : (
            <Button
              icon={<CheckOutlined />}
              type="primary"
              onClick={() => handleUpdateStatus(record.id, "OPEN")}
            >
              Mở lại
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey="ALL"
        onChange={(key) => setStatusFilter(key)}
        items={[
          { label: "Tất cả", key: "ALL" },
          { label: "Đang mở", key: "OPEN" },
          { label: "Đã đóng", key: "CLOSED" },
        ]}
        style={{ marginBottom: 16 }}
      />

      <Input
        placeholder="Tìm theo tiêu đề / công ty / thành phố / danh mục"
        prefix={<SearchOutlined />}
        style={{ width: 360, marginBottom: 16 }}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        allowClear
      />

      <Table
        rowKey="id"
        dataSource={filteredData}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title="Chi tiết công việc"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={900}
      >
        {selectedRecord && (
          <Descriptions bordered column={2} size="middle" labelStyle={{ fontWeight: 600 }}>
            <Descriptions.Item label="Logo công ty" span={2}>
              <Image
                src={selectedRecord.companyLogoUrl || "https://via.placeholder.com/150"}
                width={120}
                height={120}
                style={{ objectFit: "contain" }}
              />
            </Descriptions.Item>

            <Descriptions.Item label="Tiêu đề">
              {selectedRecord.title}
            </Descriptions.Item>
            <Descriptions.Item label="Công ty">
              {selectedRecord.companyName}
            </Descriptions.Item>

            <Descriptions.Item label="Loại hình">
              {selectedRecord.type}
            </Descriptions.Item>
            <Descriptions.Item label="Hình thức làm việc">
              {selectedRecord.mode}
            </Descriptions.Item>

            <Descriptions.Item label="Danh mục">
              {selectedRecord.category}
            </Descriptions.Item>
            <Descriptions.Item label="Thành phố">
              {selectedRecord.city}
            </Descriptions.Item>

            <Descriptions.Item label="Mức lương tối thiểu">
              {selectedRecord.minSalary != null
                ? `${Number(selectedRecord.minSalary).toLocaleString("vi-VN")} ${selectedRecord.currency}`
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Mức lương tối đa">
              {selectedRecord.maxSalary != null
                ? `${Number(selectedRecord.maxSalary).toLocaleString("vi-VN")} ${selectedRecord.currency}`
                : "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Ngày đăng">
              {selectedRecord.postedAt}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusColorText(selectedRecord.status).color}>
                {statusColorText(selectedRecord.status).text}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Kỹ năng yêu cầu" span={2}>
              {selectedRecord.requiredSkills?.length ? (
                selectedRecord.requiredSkills.map((s, i) => (
                  <Tag key={i} color="blue" style={{ marginBottom: 4 }}>
                    {s.skillName || s.name || "Kỹ năng"}
                  </Tag>
                ))
              ) : (
                <span>Không yêu cầu kỹ năng cụ thể</span>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Mô tả" span={2}>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.55 }}>
                {selectedRecord.description || "Không có mô tả"}
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default JobManagement;
