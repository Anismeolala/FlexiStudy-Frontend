import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import {
  Table,
  Tag,
  Space,
  Button,
  Input,
  message,
  Tabs,
  Modal,
  Descriptions,
  Image,
  Tooltip,
  Popover,
} from "antd";
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { getAllJobsAdminAPI, updateJobAPI } from "../../apis";

export default function AdminJobManagement() {
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchValue, setSearchValue] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
      total: 0,
    });

    useEffect(() => {
      dispatch(setLayoutData({ title: "Quản lý danh sách việc làm" }));
      loadJobs();
    }, [dispatch]);

    const loadJobs = async (options = {}) => {
        const {
          isInitial = false,
          page = pagination.current,
          pageSize = pagination.pageSize,
          search = searchText,
        } = options;

        try {
          isInitial ? setInitialLoading(true) : setLoading(true);

          const response = await getAllJobsAdminAPI({
            page,
            size: pageSize,
            search,
          });

          console.log("API Response:", response);

          if (response.code === 1000) {
            const {
              data,
              currentPage,
              pageSize: returnedPageSize,
              totalElements,
            } = response.result;

            const transformed = data.map((job) => ({
              id: job.id,
              title: job.title || "Chưa có tiêu đề",
              companyName: job.companyName || "N/A",
              companyLogoUrl: job.companyLogoUrl || null,
              city: job.city || "N/A",
              currency: job.currency || "N/A",
              category: job.category || "N/A",
              type: job.type || "N/A",
              mode: job.mode || "N/A",
              minSalary: job.minSalary ?? null,   
               maxSalary: job.maxSalary ?? null,
              description: job.description || "",
              status: job.status || "N/A",
              requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills : [],
              postedAt: job.postedAt
                ? new Date(job.postedAt).toLocaleDateString("vi-VN")
                : "-",
              updatedAt: job.updatedAt
                ? new Date(job.updatedAt).toLocaleDateString("vi-VN")
                : "-",
            }));
            setJobs(transformed);
            setSelectedRecord(transformed);
            setPagination((prev) => ({
              ...prev,
              current: currentPage,
              pageSize: returnedPageSize,
              total: totalElements,
            }));
          } else {
            throw new Error("API response error");
          }
        } catch (error) {
          console.error("Error loading jobs:", error);
          message.error("Không thể tải danh sách việc làm");
        } finally {
          isInitial ? setInitialLoading(false) : setLoading(false);
        }
      };

    const handleUpdateStatus = async (id, newStatus) => {
      try {
        await updateJobAPI(id, { status: newStatus });

        // Cập nhật trực tiếp state danh sách job (không cần reload lại toàn bộ nếu bạn đã có state jobs)
        setJobs((prev) =>
          prev.map((job) =>
            job.id === id ? { ...job, status: newStatus } : job
          )
        );

        message.success(
          `Đã ${newStatus === "OPEN" ? "duyệt" : "đóng"} công việc`
        );
        setOpenPopoverId(null);
      } catch (error) {
        console.error("Error updating job status:", error);
        message.error("Cập nhật trạng thái thất bại");
      }
    };

    const showDetails = (record) => {
      setSelectedRecord(record);
      setIsModalVisible(true);
    };


    const handleDelete = (key) => {
      setJobs(jobs.filter((job) => job.key !== key));
      message.success("Đã xoá bài đăng!");
    };

    const handleApprove = (key) => {
      setJobs(
        jobs.map((job) =>
          job.key === key ? { ...job, status: "Active" } : job
        )
      );
      message.success("Đã duyệt bài đăng!");
    };

  const columns = [
    {
      title: "Logo",
      dataIndex: "companyLogoUrl",
      key: "companyLogoUrl",
      render: (logoUrl) => (
        <Image
          src={logoUrl || "https://via.placeholder.com/50"}
          width={50}
          height={50}
          alt="Logo"
          style={{ objectFit: "contain" }}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Công ty",
      dataIndex: "companyName",
      key: "companyName",
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
    },
    {
      title: "Ngày đăng",
      dataIndex: "postedAt",
      key: "postedAt",
      sorter: (a, b) => a.postedAt.localeCompare(b.postedAt),
    },
    {
      title: "Ứng tuyển",
      dataIndex: "applicants",
      key: "applicants",
      sorter: (a, b) => a.applicants - b.applicants,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 300,
      align: "center",
      render: (_, record) => {
      const status = record.status?.toUpperCase();
      const colorMap = {
        OPEN: "green",
        CLOSED: "yellow",
      };
      const iconMap = {
        OPEN: <CheckCircleOutlined />,
        CLOSED: <StopOutlined />,
      };

      // Menu trong Popover
      const actionOptions = (
        <div style={{ minWidth: 140 }}>
          {status === "OPEN" ? (
            <div
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "6px",
                transition: "background 0.2s",
              }}
              onClick={() => handleUpdateStatus(record.id, "CLOSED")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f0f0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <CloseOutlined style={{ color: "#ff4d4f" }} />
              <span>Đóng công việc</span>
            </div>
          ) : (
            <div
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderRadius: "6px",
                transition: "background 0.2s",
              }}
              onClick={() => handleUpdateStatus(record.id, "OPEN")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f0f0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <CheckOutlined style={{ color: "#52c41a" }} />
              <span>Mở lại công việc</span>
            </div>
          )}
        </div>
      );

      return (
        <Space>
          <Popover
            content={actionOptions}
            trigger="click"
            placement="bottom"
            overlayStyle={{ padding: 0 }}
            open={openPopoverId === record.id}
            onOpenChange={(visible) =>
              setOpenPopoverId(visible ? record.id : null)
            }
          >
            <Tag
              color={colorMap[status]}
              style={{
                cursor: "pointer",
                margin: 0,
                padding: "4px 8px",
                borderRadius: "6px",
                fontWeight: 500,
                userSelect: "none",
              }}
              icon={iconMap[status]}
            >
              {status === "OPEN" ? "Đang mở" : "Đã đóng"}
            </Tag>
          </Popover>
        </Space>
      );
      },
  },
  {
    title: "Hành động",
    key: "action",
    render: (_, record) => (
      
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
},

  ];
  const filteredData = jobs.filter((item) => {
  const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
  const matchSearch =
    item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.companyName.toLowerCase().includes(searchValue.toLowerCase());
  return matchStatus && matchSearch;
});
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
        placeholder="Tìm kiếm theo trường"
        prefix={<SearchOutlined />}
        style={{ width: 300, marginBottom: 16 }}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Table
        rowKey="id"
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Chi tiết Việc làm"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <Descriptions bordered column={2} size="middle" labelStyle={{ fontWeight: 600 }}>
            
            {/* Logo công ty */}
            <Descriptions.Item label="Logo công ty" span={2}>
              <img
                src={selectedRecord.companyLogoUrl || "https://via.placeholder.com/150"}
                alt="Company Logo"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "contain",
                  border: "1px solid #eee",
                  borderRadius: 8,
                  background: "#fff",
                  padding: 4,
                }}
              />
            </Descriptions.Item>

            {/* Tiêu đề & Tên công ty */}
            <Descriptions.Item label="Tiêu đề">
              {selectedRecord.title}
            </Descriptions.Item>
            <Descriptions.Item label="Công ty">
              {selectedRecord.companyName}
            </Descriptions.Item>

            {/* Loại công việc & Hình thức */}
            <Descriptions.Item label="Loại hình">
              {selectedRecord.type}
            </Descriptions.Item>
            <Descriptions.Item label="Hình thức làm việc">
              {selectedRecord.mode}
            </Descriptions.Item>

            {/* Danh mục & Thành phố */}
            <Descriptions.Item label="Danh mục">
              {selectedRecord.category}
            </Descriptions.Item>
            <Descriptions.Item label="Thành phố">
              {selectedRecord.city}
            </Descriptions.Item>

            {/* Lương */}
            <Descriptions.Item label="Mức lương tối thiểu">
              {selectedRecord.minSalary !== "N/A"
                ? `${Number(selectedRecord.minSalary).toLocaleString("vi-VN")} ${selectedRecord.currency}`
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Mức lương tối đa">
              {selectedRecord.maxSalary !== "N/A"
                ? `${Number(selectedRecord.maxSalary).toLocaleString("vi-VN")} ${selectedRecord.currency}`
                : "N/A"}
            </Descriptions.Item>

            {/* Ngày đăng & trạng thái */}
            <Descriptions.Item label="Ngày đăng">
              {selectedRecord.postedAt}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={
                  selectedRecord.status === "OPEN"
                    ? "green"
                    : selectedRecord.status === "CLOSED"
                    ? "gold"
                    : "red"
                }
              >
                {selectedRecord.status}
              </Tag>
            </Descriptions.Item>

            {/* Kỹ năng yêu cầu */}
            <Descriptions.Item label="Kỹ năng yêu cầu" span={2}>
              {selectedRecord.requiredSkills && selectedRecord.requiredSkills.length > 0 ? (
                selectedRecord.requiredSkills.map((skill, index) => (
                  <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                    {skill.skillName || skill.name || "Kỹ năng"}
                  </Tag>
                ))
              ) : (
                <span>Không yêu cầu kỹ năng cụ thể</span>
              )}
            </Descriptions.Item>

            {/* Mô tả công việc */}
            <Descriptions.Item label="Mô tả" span={2}>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                }}
              >
                {selectedRecord.description || "Không có mô tả"}
              </div>
            </Descriptions.Item>

          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
