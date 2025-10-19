import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Spin,
  Button,
  Tag,
  Space,
  Input,
  Select,
  message,
  Popconfirm,
  Empty,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DiffOutlined,
  CloseSquareOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  UserOutlined ,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import { BiSolidNews } from "react-icons/bi";
import {
  getAllNewsAPI,
  deleteNewsAPI,
  getNewsByIdAPI,
  updateNewsAPI,
} from "../../apis";
import "./NewsManagement.css";
import ModalFormNews from "./ModalContent/ModalFormNews";
import ModalViewNews from "./ModalContent/ModalViewNews";

const { Option } = Select;

const NewsManagement = () => {
  const dispatch = useDispatch();
  const [isModalFormVisible, setIsModalFormVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalViewVisible, setIsModalViewVisible] = useState(false);
  const [viewNews, setViewNews] = useState(null);

  useEffect(() => {
    dispatch(
      setLayoutData({
        title: "Quản lý tin tức",
        icon: <BiSolidNews />,
      })
    );
  }, [dispatch]);

  // Load danh sách tin tức
  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: 1,
        size: 10,
        keyword: searchText,
        status: statusFilter === "all" ? "" : statusFilter,
        category: categoryFilter === "all" ? "" : categoryFilter,
      };
      const res = await getAllNewsAPI(params);
      const list = res.data?.data || res.result?.data || res.data || [];

      setNewsData(list);
    } catch (err) {
      console.error("Lỗi tải tin tức:", err);
      setError("Không thể tải danh sách tin tức.");
    } finally {
      setLoading(false);
    }
  }, [searchText, statusFilter, categoryFilter]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Màu trạng thái
const getStatusColor = (status) => {
  switch (status) {
    case "PUBLISH":
      return "green"; // xanh lá
    case "DRAFT":
      return "gray"; // xám
    default:
      return "default";
  }
};

// Tên trạng thái
const getStatusLabel = (status) => {
  switch (status) {
    case "PUBLISH":
      return "Đã đăng";
    case "DRAFT":
      return "Bản nháp";
    default:
      return "Không xác định";
  }
};

// Màu danh mục
const getCategoryColor = (category) => {
  switch (category) {
    case "NEWS":
      return "blue";
    case "GUIDELINE":
      return "purple";
    case "CAREER":
      return "cyan";
    case "OTHER":
      return "default";
    default:
      return "default";
  }
};

// Tên danh mục
const getCategoryLabel = (category) => {
  switch (category) {
    case "NEWS":
      return "Tin tức";
    case "GUIDELINE":
      return "Hướng dẫn";
    case "CAREER":
      return "Hướng nghiệp";
    case "OTHER":
      return "Khác";
    default:
      return "Chưa phân loại";
  }
};

  // Xử lý hành động
  const handleDelete = async (id) => {
    try {
      await deleteNewsAPI(id);
      message.success("Đã xóa tin tức!");
      loadNews();
    } catch (err) {
      message.error("Xóa tin thất bại!");
    }
  };

  // Chuyển trạng thái đăng/nháp
  const handleToggleStatus = async (item) => {
  try {
    const newStatus = item.status === "PUBLISH" ? "DRAFT" : "PUBLISH";

    const payload = {
      ...item,
      status: newStatus,
    };

    await updateNewsAPI(item.id, payload);

    message.success(
      `Đã chuyển trạng thái "${item.title}" sang ${
        newStatus === "PUBLISH" ? "Đã đăng" : "Bản nháp"
      }!`
    );
    loadNews(); // ✅ reload lại danh sách
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái:", err);
    message.error("Không thể cập nhật trạng thái tin tức!");
  }
};


 const showViewModal = async (item) => {
  try {
    const res = await getNewsByIdAPI(item.id);
    setViewNews(res.data || res.result || res);
    setIsModalViewVisible(true);
  } catch (err) {
    message.error("Không thể tải chi tiết tin tức!");
  }
};


  const showEditModal = (item) => {
    message.info(`Sửa tin: ${item.title}`);
  };

  // Render giao diện
  return (
    <div className="news-container">
      {/* Header lọc + tìm kiếm */}
      <Card className="news-header-card">
        <Space wrap>
          <Input
            placeholder="Tìm kiếm tin tức..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          <Select
            value={statusFilter}
            style={{ width: 150 }}
            onChange={setStatusFilter}
          >
            <Option value="all">Tất cả</Option>
            <Option value="DRAFT">Bản nháp</Option>
            <Option value="PUBLISH">Đã đăng</Option>
          </Select>
          <Select
            value={categoryFilter}
            style={{ width: 180 }}
            onChange={setCategoryFilter}
            placeholder="Danh mục"
          >
            <Option value="all">Tất cả</Option>
            <Option value="NEWS">Tin tức</Option>
            <Option value="GUIDELINE">Hướng dẫn</Option>
            <Option value="CAREER">Hướng nghiệp</Option>
            <Option value="OTHER">Khác</Option>
          </Select>
          <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedNews(null);
            setIsModalFormVisible(true);
          }}
          >
            Thêm tin tức
          </Button>
        </Space>
      </Card>

      {/* Danh sách tin tức */}
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="loading-container">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      ) : newsData.length === 0 ? (
        <Empty description="Không có tin tức nào" />
      ) : (
        <div className="news-list">
   {newsData.map((item) => (
    <Card
      key={item.id}
      className="news-card"
      actions={[
        <Button icon={<EyeOutlined />} onClick={() => showViewModal(item)}>
          Xem
        </Button>,
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            setSelectedNews(item);
            setIsModalFormVisible(true);
          }}
        >
          Sửa
        </Button>,
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa tin tức này?"
          onConfirm={() => handleDelete(item.id)}
          okText="Có"
          cancelText="Không"
          icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
        >
          <Button danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>,
        <Popconfirm
          title={`Bạn có chắc chắn muốn ${
            item.status === "DRAFT" ? "đăng" : "chuyển về bản nháp"
          } tin này không?`}
          onConfirm={() => handleToggleStatus(item)}
          okText="Đồng ý"
          cancelText="Hủy"
          icon={<ExclamationCircleOutlined style={{ color: "green" }} />}
        >
          <Button
            icon={
              item.status === "DRAFT" ? (
                <DiffOutlined />
              ) : (
                <CloseSquareOutlined />
              )
            }
            type={item.status === "DRAFT" ? "primary" : "default"}
          >
            {item.status === "DRAFT" ? "Đăng" : "Nháp"}
          </Button>
        </Popconfirm>,
      ]}
    >
      <div className="news-card-content">
        <h4 className="news-title">{item.title}</h4>

        {/* Tác giả + Ngày tạo */}
        <div className="news-meta">
          <span style={{ color: "#555", marginRight: 12 }}>
          <UserOutlined style={{ marginRight: 4 }}/>
           {item.authorName || "Không rõ tác giả"}
          </span>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {new Date(item.createdAt).toLocaleString("vi-VN")}
        </div>

        {/* Ảnh đại diện */}
        <div className="news-image-container">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} />
          ) : (
            <span style={{ color: "#999" }}>No Image</span>
          )}
        </div>

        {/* Mô tả ngắn */}
        <p className="news-excerpt">{item.summary || "Không có mô tả"}</p>

        {/* Danh mục + trạng thái */}
        <Space>
          <Tag color={getCategoryColor(item.category)}>
            {getCategoryLabel(item.category)}
          </Tag>
          <Tag color={getStatusColor(item.status)}>
            {getStatusLabel(item.status)}
          </Tag>
        </Space>
      </div>
    </Card>
  ))}
        </div>

      )}
      <ModalFormNews
            visible={isModalFormVisible}
            onCancel={() => setIsModalFormVisible(false)}
            newsData={selectedNews}
            reloadData={loadNews}
          />
          <ModalViewNews
            visible={isModalViewVisible}
            onCancel={() => setIsModalViewVisible(false)}
            news={viewNews}
          />
    </div>
    
  );
};

export default NewsManagement;
