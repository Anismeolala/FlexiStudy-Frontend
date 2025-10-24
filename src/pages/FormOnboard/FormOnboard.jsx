import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Row,
  Col,
  Space,
  Card,
  message,
  Select,
} from "antd";
import dayjs from "dayjs";
import { onboardAPI, suggestSkillAPI } from "../../apis/index";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { useDispatch, useSelector } from "react-redux";
import { getMyInfo } from "../../redux/userSlice";

const FormOnboard = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillOptions, setSkillOptions] = useState([]);
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const isFullNameLocked = Boolean(userData?.firstName || userData?.lastName);
  const isEmailLocked = Boolean(userData?.email);

  useEffect(() => {
    // Gọi API để lấy thông tin người dùng
    dispatch(getMyInfo());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        fullName: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        phone: userData.phone || "",
        dob: userData.dob ? dayjs(userData.dob) : null,
        address: userData.address || "",
      });
    }
  }, [userData, form]);

  // Gọi API gợi ý skill (debounce để tránh spam API)
  const fetchSkillSuggestions = debounce(async (keyword) => {
    if (!keyword || keyword.trim().length < 2) return;
    try {
      const res = await suggestSkillAPI(keyword);
      setSkillOptions(res.result || []);
    } catch (err) {
      console.error("Skill suggest error:", err);
    }
  }, 300);

  // Submit handler
  const handleSubmit = async (values) => {
    setLoading(true);
    const payload = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      dob: values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : null,
      address: values.address,
      educations: values.educations?.map((e) => ({
        school: e.school,
        degree: e.degree,
        field: e.field,
      })),
      experiences: values.experiences?.map((e) => ({
        company: e.company,
        position: e.position,
        startDate: e.startDate ? dayjs(e.startDate).format("YYYY-MM-DD") : null,
        endDate: e.endDate ? dayjs(e.endDate).format("YYYY-MM-DD") : null,
      })),
      skills: values.skills || [],
    };

    try {
      const res = await onboardAPI(payload);
      message.success(res.message || "Cập nhật hồ sơ thành công!");
      navigate("/");
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="profile-update-container"
      style={{ maxWidth: 900, margin: "50px auto" }}
    >
      <Card
        title="Mô tả công việc mong muốn của bạn"
        headStyle={{
          background: "linear-gradient(90deg, #0047FF, #0080FF)",
          color: "white",
          fontWeight: "bold",
        }}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {/* ---------- Thông tin cơ bản ---------- */}
          <Card
            type="inner"
            title="Thông tin cá nhân"
            style={{ marginBottom: 20 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input
                    placeholder="Nhập họ và tên"
                    disabled={Boolean(
                      userData?.firstName || userData?.lastName
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="dob" label="Ngày sinh">
                  <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ type: "email", message: "Email không hợp lệ" }]}
                >
                  <Input
                    placeholder="Nhập email"
                    disabled={Boolean(userData?.email)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    { min: 10, message: "SĐT tối thiểu 10 số" },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="address" label="Địa chỉ">
              <Input placeholder="Nhập địa chỉ của bạn" />
            </Form.Item>
          </Card>

          {/* ---------- Kinh nghiệm ---------- */}
          <Form.List name="experiences" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <Card
                type="inner"
                title="Kinh nghiệm làm việc"
                extra={
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Thêm kinh nghiệm
                  </Button>
                }
                style={{ marginBottom: 20 }}
              >
                {fields.map(({ key, name, ...rest }) => (
                  <Space
                    key={key}
                    direction="vertical"
                    style={{
                      display: "flex",
                      marginBottom: 10,
                      padding: 15,
                      border: "1px solid #eee",
                      borderRadius: 10,
                    }}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          {...rest}
                          name={[name, "company"]}
                          label="Công ty / Doanh nghiệp"
                          rules={[
                            { required: true, message: "Nhập tên công ty" },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...rest}
                          name={[name, "position"]}
                          label="Chức vụ"
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name={[name, "startDate"]} label="Từ tháng">
                          <DatePicker
                            format="YYYY-MM-DD"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name={[name, "endDate"]} label="Đến tháng">
                          <DatePicker
                            format="YYYY-MM-DD"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Button
                      danger
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    >
                      Xóa
                    </Button>
                  </Space>
                ))}
              </Card>
            )}
          </Form.List>

          {/* ---------- Học vấn ---------- */}
          <Form.List name="educations" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <Card
                type="inner"
                title="Học vấn"
                extra={
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Thêm học vấn
                  </Button>
                }
                style={{ marginBottom: 20 }}
              >
                {fields.map(({ key, name, ...rest }) => (
                  <Space
                    key={key}
                    direction="vertical"
                    style={{
                      display: "flex",
                      marginBottom: 10,
                      padding: 15,
                      border: "1px solid #eee",
                      borderRadius: 10,
                    }}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          {...rest}
                          name={[name, "school"]}
                          label="Trường học"
                          rules={[
                            { required: true, message: "Nhập tên trường" },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name={[name, "degree"]} label="Bằng cấp">
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item name={[name, "field"]} label="Chuyên ngành">
                      <Input />
                    </Form.Item>

                    <Button
                      danger
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    >
                      Xóa
                    </Button>
                  </Space>
                ))}
              </Card>
            )}
          </Form.List>

          {/* ---------- Kỹ năng ---------- */}
          <Card type="inner" title="Kỹ năng" style={{ marginBottom: 20 }}>
            <Form.Item
              name="skills"
              label="Kỹ năng"
              rules={[
                { required: true, message: "Vui lòng nhập ít nhất 1 kỹ năng" },
              ]}
            >
              <Select
                mode="multiple"
                showSearch
                size="large"
                placeholder="Nhập kỹ năng (VD: Java, React, Communication...)"
                onSearch={fetchSkillSuggestions}
                filterOption={false}
                allowClear
                notFoundContent={null}
                options={(skillOptions || [])
                  .filter(
                    (s) =>
                      typeof s?.name === "string" &&
                      s.name.trim() !==
                        form.getFieldValue("skills")?.slice(-1)?.[0]
                  )
                  .map((s) => ({
                    value: s.name,
                    label: s.name,
                  }))}
              />
            </Form.Item>
          </Card>
          {/* ---------- Nút hoàn thành ---------- */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Hoàn thành hồ sơ
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FormOnboard;
