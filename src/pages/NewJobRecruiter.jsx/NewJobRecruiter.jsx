import React, { useMemo, useState } from "react";
import {
  Button,
  Input,
  Select,
  Card,
  Form,
  message,
  DatePicker,
  InputNumber,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { createJobAPI, suggestSkillAPI } from "../../apis";
import "./NewJobRecruiter.css";
import debounce from "lodash.debounce";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { getMyInfo } from "../../redux/userSlice";

const { TextArea } = Input;
const { Option } = Select;

const CATEGORY_OPTIONS = [
  { label: "Thiết kế", value: "DESIGN" },
  { label: "Bán hàng", value: "SALES" },
  { label: "Marketing", value: "MARKETING" },
  { label: "Tài chính", value: "FINANCE" },
  { label: "Công nghệ", value: "TECHNOLOGY" },
  { label: "Kỹ sư", value: "ENGINEER" },
  { label: "Kinh doanh", value: "BUSINESS" },
  { label: "Nhân sự", value: "HR" },
];


const TYPE_OPTIONS = [
  { label: "Thực tập", value: "INTERN" },
  { label: "Toàn thời gian", value: "FULLTIME" },
  { label: "Bán thời gian", value: "PARTTIME" },
];

const MODE_OPTIONS = ["REMOTE", "ONSITE"];

const timeSlots = {
  day: { label: "Ca ngày (9:00 - 17:00)", start: "09:00", end: "17:00" },
  evening: { label: "Ca chiều (14:00 - 22:00)", start: "14:00", end: "22:00" },
  night: { label: "Ca đêm (22:00 - 06:00)", start: "22:00", end: "06:00" },
  flexible: { label: "Giờ linh hoạt (Cả ngày)", start: "00:00", end: "23:59" },
};

const NewJobRecruiter = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [posting, setPosting] = useState(false);
  const [skillOptions, setSkillOptions] = useState([]);

  // Gợi ý kỹ năng (debounced)
  const fetchSkillSuggestions = useMemo(
    () =>
      debounce(async (keyword) => {
        if (!keyword || keyword.trim().length < 2) return;
        try {
          const res = await suggestSkillAPI(keyword);
          setSkillOptions(res.result || []);
        } catch (err) {
          console.error("Lỗi gợi ý kỹ năng:", err);
        }
      }, 300),
    []
  );

  const handleSubmit = async (values) => {
    try {
      setPosting(true);
      const userData = await dispatch(getMyInfo());
      const companyId = userData.payload.result.companyId;

      console.log("🎯 Raw form values:", values);

      // Map label -> enum code an toàn tuyệt đối
      const foundCategory = CATEGORY_OPTIONS.find(
        (opt) =>
          opt.value === values.department || 
          opt.label.toLowerCase() === values.department?.toLowerCase()
      );
      values.department = foundCategory ? foundCategory.value : values.department;


      if (!companyId) {
        message.error("Thiếu companyId. Vui lòng đăng nhập vai trò nhà tuyển dụng.");
        return;
      }

      // Lấy shift người dùng chọn
      const selectedShift = values.shift ? timeSlots[values.shift] : null;
      const jobShiftObjects = selectedShift
        ? [
            {
              startTime: selectedShift.start,
              endTime: selectedShift.end,
              description: selectedShift.label,
            },
          ]
        : [];

      const payload = {
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        benefits: values.benefits || null,
        address: values.location,
        city: values.location,
        expiryDate: values.expiryDate
          ? dayjs(values.expiryDate).toISOString()
          : null,
        type: values.type,
        mode: values.mode,
        category: values.department,
        minSalary: values.minSalary || null,
        maxSalary: values.maxSalary || null,
        quantity: values.quantity || 1,
        currency: "VND",
        status: "CLOSED",
        companyId,
        skillNames: values.skills || [],
        jobShifts: jobShiftObjects,
      };

      const resCreate = await createJobAPI(payload);
      const job = resCreate?.result;
      if (!job?.id) {
        message.error("Tạo công việc thất bại.");
        return;
      }

      message.success("Đăng tuyển công việc thành công!");
      navigate("/recruiter/jobs-recruiter");
    } catch (e) {
      console.error(e);
      message.error("Có lỗi khi đăng công việc.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="newjob-page">
      <div className="newjob-header">
        <Link to="/recruiter/jobs-recruiter">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            Quay lại danh sách công việc
          </Button>
        </Link>
      </div>

      <Card className="newjob-card" title="Đăng tuyển công việc mới">
        <p className="card-desc">
          Hãy điền thông tin chi tiết để đăng tuyển công việc và thu hút ứng viên tiềm năng.
        </p>

        <Form form={form} layout="vertical" onFinish={handleSubmit} className="newjob-form">
          {/* Tiêu đề công việc */}
          <Form.Item
            label="Tên công việc"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên công việc" }]}
          >
            <Input placeholder="VD: Nhân viên kinh doanh, Lập trình viên ReactJS..." />
          </Form.Item>

          {/* Bộ phận + Loại công việc */}
          <div className="grid-2">
            <Form.Item
              label="Bộ phận"
              name="department"
              rules={[{ required: true, message: "Vui lòng chọn bộ phận" }]}
            >
              <Select
                placeholder="Chọn bộ phận"
                showSearch
                optionLabelProp="label"
                valuePropName="value"
                onChange={(value) => form.setFieldValue("department", value)} // ép lưu value thật
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <Option key={c.value} value={c.value} label={c.label}>
                    {c.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Loại công việc"
              name="type"
              rules={[{ required: true, message: "Vui lòng chọn loại công việc" }]}
            >
              <Select placeholder="Chọn loại công việc">
                {TYPE_OPTIONS.map((t) => (
                  <Option key={t.value} value={t.value}>
                    {t.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Hình thức + Ngày hết hạn */}
          <div className="grid-2">
            <Form.Item
              label="Hình thức làm việc"
              name="mode"
              rules={[{ required: true, message: "Vui lòng chọn hình thức làm việc" }]}
            >
              <Select placeholder="Chọn hình thức">
                {MODE_OPTIONS.map((m) => (
                  <Option key={m} value={m}>
                    {m}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Ngày hết hạn" name="expiryDate">
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </div>

          {/* Địa điểm + Lương */}
          <div className="grid-2">
            <Form.Item
              label="Địa điểm"
              name="location"
              rules={[{ required: true, message: "Vui lòng nhập địa điểm" }]}
            >
              <Input placeholder="VD: TP. Hồ Chí Minh, Hà Nội..." />
            </Form.Item>

            <div>
              <Form.Item label="Lương tối thiểu (VND)" name="minSalary">
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(v) => v.replace(/,/g, "")}
                  placeholder="VD: 5,000,000"
                />
              </Form.Item>

              <Form.Item label="Lương tối đa (VND)" name="maxSalary">
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(v) => v.replace(/,/g, "")}
                  placeholder="VD: 15,000,000"
                />
              </Form.Item>
            </div>
          </div>

          {/* Mô tả */}
          <Form.Item
            label="Mô tả công việc"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả công việc" }]}
          >
            <TextArea rows={4} placeholder="Mô tả chi tiết về vai trò, nhiệm vụ..." />
          </Form.Item>

          {/* Yêu cầu */}
          <Form.Item
            label="Yêu cầu công việc"
            name="requirements"
            rules={[{ required: true, message: "Vui lòng nhập yêu cầu công việc" }]}
          >
            <TextArea rows={4} placeholder="VD: Có kỹ năng giao tiếp, sử dụng Excel, kinh nghiệm 1 năm..." />
          </Form.Item>

          {/* Phúc lợi */}
          <Form.Item label="Phúc lợi" name="benefits">
            <TextArea rows={3} placeholder="VD: Thưởng doanh số, bảo hiểm, du lịch,..." />
          </Form.Item>

          {/* Số lượng */}
          <Form.Item label="Số lượng tuyển" name="quantity" initialValue={1}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          {/* Kỹ năng */}
          <Card type="inner" title="Kỹ năng yêu cầu" style={{ marginBottom: 20 }}>
            <Form.Item
              name="skills"
              label="Kỹ năng"
              rules={[{ required: true, message: "Vui lòng nhập ít nhất 1 kỹ năng" }]}
            >
              <Select
                mode="multiple"
                showSearch
                placeholder="Nhập kỹ năng (VD: Java, React, Communication...)"
                onSearch={fetchSkillSuggestions}
                filterOption={false}
                allowClear
                notFoundContent={null}
                options={(skillOptions || []).map((s) => ({
                  value: s.name,
                  label: s.name,
                }))}
              />
            </Form.Item>
          </Card>

          {/* Ca làm việc */}
          <Card type="inner" title="Ca làm việc">
            <Form.Item
              label="Ca làm việc"
              name="shift"
              rules={[{ required: true, message: "Vui lòng chọn ca làm việc" }]}
            >
              <Select placeholder="Chọn ca làm việc">
                <Option value="day">Ca ngày (9:00 - 17:00)</Option>
                <Option value="evening">Ca chiều (14:00 - 22:00)</Option>
                <Option value="night">Ca đêm (22:00 - 06:00)</Option>
                <Option value="flexible">Giờ linh hoạt (Cả ngày)</Option>
              </Select>
            </Form.Item>
          </Card>

          {/* Nút hành động */}
          <div className="form-actions">
            <Link to="/recruiter/jobs-recruiter" className="flex-1">
              <Button block>Hủy</Button>
            </Link>
            <Button type="primary" htmlType="submit" block loading={posting}>
              Đăng tuyển
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default NewJobRecruiter;
