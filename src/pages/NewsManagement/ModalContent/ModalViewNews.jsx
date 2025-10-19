import React from "react";
import { Modal, Typography, Divider, Tag, Button } from "antd";
import {
  ClockCircleOutlined,
  FolderOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./ModalViewNews.css";

const { Title, Text, Paragraph } = Typography;

const getStatusColor = (status) =>
  status === "PUBLISH" ? "green" : "orange";
const getStatusLabel = (status) =>
  status === "PUBLISH" ? "Đã đăng" : "Bản nháp";

const getCategoryLabel = (type) => {
  switch (type) {
    case "NEWS":
      return "Tin tức";
    case "GUIDE":
    case "GUIDELINE":
      return "Hướng dẫn";
    default:
      return "Nội dung khác";
  }
};

const ModalViewNews = ({ visible, onCancel, news }) => {
  if (!news) return null;

  return (
    <Modal
      title={
        <>
          <FolderOutlined style={{ color: "#1890ff", marginRight: 8 }} />
          Chi tiết {getCategoryLabel(news.type)}
        </>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      width={800}
      centered
      destroyOnClose
      className="modal-view-news"
    >
      <div className="news-view-container">
        {/* Ảnh đại diện */}
        {news.imageUrl && (
          <div className="news-image-wrapper">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="news-detail-image"
            />
          </div>
        )}

        {/* Tiêu đề và thông tin */}
        <Title level={3} className="news-detail-title">
          {news.title}
        </Title>

        <div className="news-meta">
          <Text type="secondary">
            <ClockCircleOutlined />{" "}
            {moment(news.createdAt).format("HH:mm - DD/MM/YYYY")}
          </Text>
          <Divider type="vertical" />
          <Tag
            color={getStatusColor(news.status)}
            icon={
              news.status === "PUBLISH" ? (
                <CheckCircleOutlined />
              ) : (
                <ExclamationCircleOutlined />
              )
            }
          >
            {getStatusLabel(news.status)}
          </Tag>
        </div>

        {/* Tóm tắt */}
        {news.summary && (
          <Paragraph className="news-summary">
            <strong>Tóm tắt:</strong> {news.summary}
          </Paragraph>
        )}

        <Divider />

        {/* Nội dung chi tiết */}
        <div
          className="news-content"
          dangerouslySetInnerHTML={{ __html: news.body || "<i>Không có nội dung</i>" }}
        />
      </div>
    </Modal>
  );
};

export default ModalViewNews;
