import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Upload,
} from "antd";
import {
  CameraOutlined,
  EnvironmentOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  createNewsAPI,
  updateNewsAPI,
  uploadNewsImageAPI,
} from "../../../apis";
import "./ModalFormNews.css";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import { Option } from "antd/es/mentions";

const ModalFormNews = ({ visible, onCancel, newsData, reloadData }) => {
  const [form] = Form.useForm();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [editorData, setEditorData] = useState("");


  const isEdit = !!newsData?.id;

  // ========== CKEditor Upload Adapter ==========
  function MyUploadAdapter(loader) {
    this.loader = loader;
  }

  MyUploadAdapter.prototype.upload = async function () {
    const file = await this.loader.file;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploadingImage(true);
      // Nếu đang edit → upload gắn với id bài viết
      const res = await uploadNewsImageAPI(newsData?.id || "temp", formData);
      const imageUrl = res.data?.url || res.result || res.url;
      setUploadingImage(false);
      return { default: imageUrl };
    } catch (err) {
      setUploadingImage(false);
      console.error("Upload lỗi:", err);
      throw new Error("Không thể upload ảnh!");
    }
  };

  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  }

  // ========== Load dữ liệu khi mở modal ==========
  useEffect(() => {
  if (visible) {
    if (newsData) {
      // Khi chỉnh sửa tin
      form.setFieldsValue({
        title: newsData.title,
        summary: newsData.summary,
        body: newsData.body,
        category: newsData.category || null,
        authorName: newsData.authorName || "",
      });
      setEditorData(newsData.body || "");
      setImageUrl(newsData.imageUrl || newsData.imageUrls?.[0] || "");
    } else {
      // Khi thêm tin mới
      form.resetFields();
      setEditorData(""); 
      setImageUrl("");
    }
  } else {
    // Khi modal đóng lại
    form.resetFields();
    setEditorData("");
    setImageUrl("");
  }
}, [visible, newsData]);


  const handleImageUpload = async ({ file }) => {
  // Nếu chưa có newsId (nghĩa là đang tạo mới)
  if (!newsData?.id) {
    message.warning("Vui lòng tạo tin tức trước, sau đó mới tải ảnh!");
    return false; // chặn upload
  }

  setUploadingImage(true);
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadNewsImageAPI(newsData.id, formData);
    console.log("Upload ảnh đại diện:", res);

    if (res.data?.code === 1000 || res.status === 200) {
      const uploadedUrl = res.data?.result || res.data?.url || res.result || res.url;
      // ép browser tải lại (tránh cache)
      setImageUrl(`${uploadedUrl}?t=${Date.now()}`);
      message.success("Tải ảnh đại diện thành công!");
    } else {
      message.error("Upload ảnh thất bại!");
    }
  } catch (err) {
    console.error("Upload ảnh lỗi:", err);
    message.error("Không thể upload ảnh!");
  } finally {
    setUploadingImage(false);
  }
  return false;
};

  // ========== Submit form ==========
  const handleSubmit = async (values) => {
    console.log("Form Values:", values);
    setLoadingSubmit(true);
    try {
      const payload = {
        title: values.title,
        summary: values.summary,
        body: values.body,
        imageUrl,
        status: isEdit ? newsData.status : "DRAFT",
        category: values.category || newsData?.category || null,
        authorName: values.authorName || newsData?.authorName || "",
      };

      if (isEdit) {
        await updateNewsAPI(newsData.id, payload);
        message.success("Cập nhật tin tức thành công!");
      } else {
        await createNewsAPI(payload);
        message.success("Thêm mới tin tức thành công!");
      }

      reloadData?.();
      onCancel();
    } catch (err) {
      console.error("Submit Error:", err);
      message.error("Không thể lưu tin tức.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ========== Render ==========
  return (
    <Modal
      title={isEdit ? "Chỉnh sửa tin tức" : "Thêm tin tức mới"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
      className="modal-form-news"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Upload ảnh đại diện */}
        <Form.Item label="Ảnh đại diện">
          <div className="content-image-upload">
            <div className="image-preview">
              <Avatar
                size={120}
                src={imageUrl}
                icon={<EnvironmentOutlined />}
                shape="square"
              />
            </div>
            <div className="upload-controls">
              <Upload
                customRequest={handleImageUpload}
                showUploadList={false}
                accept="image/*"
              >
                <PrimaryButton
                  icon={<CameraOutlined />}
                  loading={uploadingImage}
                  htmlType="button"
                  ghost
                >
                  {uploadingImage ? "Đang upload..." : "Chọn ảnh"}
                </PrimaryButton>
              </Upload>
              {imageUrl && (
                <Button onClick={() => setImageUrl("")} danger type="text">
                  Xóa ảnh
                </Button>
              )}
            </div>
          </div>
        </Form.Item>

        {/* Tiêu đề */}
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder="Nhập tiêu đề tin tức" />
        </Form.Item>

        {/* Tóm tắt */}
        <Form.Item
          name="summary"
          label="Tóm tắt"
          rules={[{ required: true, message: "Vui lòng nhập tóm tắt!" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập tóm tắt ngắn gọn" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Danh mục"
          rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
        >
          <Select placeholder="Chọn danh mục tin tức">
            <Option value="NEWS">Tin tức</Option>
            <Option value="GUIDELINE">Hướng dẫn</Option>
            <Option value="CAREER">Hướng nghiệp</Option>
            <Option value="OTHER">Khác</Option>
          </Select>
        </Form.Item>

        {/* Nội dung chi tiết */}
        <Form.Item
          name="body"
          label="Nội dung chi tiết"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <CKEditor
            editor={ClassicEditor}
            config={{
              extraPlugins: [MyCustomUploadAdapterPlugin],
              placeholder: "Nhập nội dung chi tiết...",
            }}
           data={editorData} 
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditorData(data);
              form.setFieldsValue({ body: data });
            }}
          />
        </Form.Item>

        {/* Footer buttons */}
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loadingSubmit}
              disabled={uploadingImage}
            >
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button onClick={onCancel}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalFormNews;
