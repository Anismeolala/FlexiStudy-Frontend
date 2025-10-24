import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Select, InputNumber, message } from "antd";
import { updateJobAPI, suggestSkillAPI } from "../../apis";
import dayjs from "dayjs";
import debounce from "lodash.debounce";

const { Option } = Select;
const { TextArea } = Input;

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
  day: { label: "Ca ngày (9:00 - 17:00)", start: "09:00:00", end: "17:00:00" },
  evening: {
    label: "Ca chiều (14:00 - 22:00)",
    start: "14:00:00",
    end: "22:00:00",
  },
  night: {
    label: "Ca đêm (22:00 - 06:00)",
    start: "22:00:00",
    end: "06:00:00",
  },
  flexible: {
    label: "Giờ linh hoạt (Cả ngày)",
    start: "00:00:00",
    end: "23:59:00",
  },
};

const JobEditModal = ({ visible, job, onClose, onSaved }) => {
  const [form] = Form.useForm();
  const [skillOptions, setSkillOptions] = useState([]);

  const fetchSkillSuggestions = useMemo(
    () =>
      debounce(async (keyword) => {
        if (!keyword || keyword.trim().length < 2) return;
        const res = await suggestSkillAPI(keyword);
        setSkillOptions(res.result || []);
      }, 300),
    []
  );

  useEffect(() => {
    if (job) {
      const detectedShift = Object.keys(timeSlots).find(
        (key) => job.jobShifts?.[0]?.description === timeSlots[key].label
      );

      form.setFieldsValue({
        title: job.title,
        department: job.category,
        type: job.type,
        mode: job.mode,
        location: job.city,
        expiryDate: job.expiryDate ? dayjs(job.expiryDate) : null,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        quantity: job.quantity,
        skills: job.requiredSkills?.map((s) => s.name) || [],
        shift: detectedShift || "day",
      });
    }
  }, [job, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const selectedShift = values.shift ? timeSlots[values.shift] : null;

      const payload = {
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        benefits: values.benefits || null,
        address: values.location,
        city: values.location,
        expiryDate: values.expiryDate ? values.expiryDate.toISOString() : null,
        type: values.type,
        mode: values.mode,
        category: values.department,
        minSalary: Number(values.minSalary) || null,
        maxSalary: Number(values.maxSalary) || null,
        quantity: Number(values.quantity) || 1,
        skillNames: values.skills || [],
        jobShifts: selectedShift
          ? [
              {
                date: "1970-01-01",
                startTime: selectedShift.start,
                endTime: selectedShift.end,
                description: selectedShift.label,
              },
            ]
          : [],
      };

      await updateJobAPI(job.id, payload);
      message.success("Cập nhật công việc thành công!");
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại!");
    }
  };

  return (
    <Modal
      title="Chỉnh sửa công việc"
      open={visible}
      onCancel={onClose}
      onOk={handleSave}
      okText="Save Changes"
      width={750}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tên công việc"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        {/* Bộ phận + Loại công việc */}
        <div className="grid-2">
          <Form.Item
            name="department"
            label="Bộ phận"
            rules={[{ required: true }]}
          >
            <Select>
              {CATEGORY_OPTIONS.map((c) => (
                <Option key={c.value} value={c.value}>
                  {c.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại công việc"
            rules={[{ required: true }]}
          >
            <Select>
              {TYPE_OPTIONS.map((t) => (
                <Option key={t.value} value={t.value}>
                  {t.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Location + Salary */}
        <div className="grid-2">
          <Form.Item
            name="location"
            label="Địa điểm"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <div>
            <Form.Item name="minSalary" label="Lương tối thiểu">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item name="maxSalary" label="Lương tối đa">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          name="description"
          label="Mô tả công việc"
          rules={[{ required: true }]}
        >
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="requirements"
          label="Yêu cầu công việc"
          rules={[{ required: true }]}
        >
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="benefits" label="Phúc lợi">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="quantity" label="Số lượng tuyển">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        {/* Ca làm việc */}
        <Form.Item
          name="shift"
          label="Ca làm việc"
          rules={[{ required: true }]}
        >
          <Select>
            <Option value="day">Ca ngày (9:00 - 17:00)</Option>
            <Option value="evening">Ca chiều (14:00 - 22:00)</Option>
            <Option value="night">Ca đêm (22:00 - 06:00)</Option>
            <Option value="flexible">Giờ linh hoạt (Cả ngày)</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default JobEditModal;
