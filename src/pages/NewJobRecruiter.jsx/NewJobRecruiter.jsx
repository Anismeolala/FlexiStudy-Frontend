import React, { useState } from "react";
import {
  Button,
  Input,
  Select,
  Card,
  Form,
  Badge,
  message,
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./NewJobRecruiter.css";

const { TextArea } = Input;
const { Option } = Select;

const NewJobRecruiter = () => {
  const [form] = Form.useForm();
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState("");

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = () => {
    message.success(" Job Posted Successfully");
    form.resetFields();
    setSkills([]);
  };

  return (
    <div className="newjob-page">
      <div className="newjob-header">
        <Link to="/recruiter/jobs-recruiter">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            Back to Jobs
          </Button>
        </Link>
      </div>

      <Card className="newjob-card" title="Post New Job">
        <p className="card-desc">
          Create a new job posting to attract qualified candidates
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="newjob-form"
        >
          {/* Job Title */}
          <Form.Item
            label="Job Title"
            name="title"
            rules={[{ required: true, message: "Please enter job title" }]}
          >
            <Input placeholder="e.g. Senior Frontend Developer" />
          </Form.Item>

          {/* Department + Type */}
          <div className="grid-2">
            <Form.Item
              label="Department"
              name="department"
              rules={[{ required: true, message: "Please select department" }]}
            >
              <Select placeholder="Select department">
                <Option value="engineering">Engineering</Option>
                <Option value="design">Design</Option>
                <Option value="marketing">Marketing</Option>
                <Option value="sales">Sales</Option>
                <Option value="hr">Human Resources</Option>
                <Option value="finance">Finance</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Employment Type"
              name="type"
              rules={[{ required: true, message: "Please select type" }]}
            >
              <Select placeholder="Select type">
                <Option value="full-time">Full-time</Option>
                <Option value="part-time">Part-time</Option>
                <Option value="contract">Contract</Option>
                <Option value="internship">Internship</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Location + Salary */}
          <div className="grid-2">
            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: "Please enter location" }]}
            >
              <Input placeholder="e.g. Ho Chi Minh City" />
            </Form.Item>

            <Form.Item
              label="Salary Range"
              name="salary"
              rules={[{ required: true, message: "Please enter salary range" }]}
            >
              <Input placeholder="e.g. $2000-3000" />
            </Form.Item>
          </div>

          {/* Description */}
          <Form.Item
            label="Job Description"
            name="description"
            rules={[{ required: true, message: "Please enter job description" }]}
          >
            <TextArea
              rows={4}
              placeholder="Describe the role, responsibilities..."
            />
          </Form.Item>

          {/* Requirements */}
          <Form.Item
            label="Requirements"
            name="requirements"
            rules={[{ required: true, message: "Please enter job requirements" }]}
          >
            <TextArea
              rows={4}
              placeholder="List qualifications, experience, skills..."
            />
          </Form.Item>

          {/* Skills */}
          <Form.Item label="Required Skills">
            <div className="skill-input">
              <Input
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="e.g. React, TypeScript"
                onPressEnter={(e) => {
                  e.preventDefault();
                  addSkill();
                }}
              />
              <Button type="default" onClick={addSkill}>
                Add
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="skill-list">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="skill-badge"
                    count={
                      <CloseOutlined
                        onClick={() => removeSkill(skill)}
                        className="close-icon"
                      />
                    }
                  >
                    <span>{skill}</span>
                  </Badge>
                ))}
              </div>
            )}
          </Form.Item>

          {/* Benefits */}
          <Form.Item label="Benefits" name="benefits">
            <TextArea rows={3} placeholder="Describe benefits and perks..." />
          </Form.Item>

          {/* Work Shift */}
          <Form.Item label="Work Shift" name="shift">
            <Select placeholder="Select shift schedule">
              <Option value="day">Day Shift (9 AM - 5 PM)</Option>
              <Option value="evening">Evening Shift (2 PM - 10 PM)</Option>
              <Option value="night">Night Shift (10 PM - 6 AM)</Option>
              <Option value="flexible">Flexible Hours</Option>
            </Select>
          </Form.Item>

          {/* Buttons */}
          <div className="form-actions">
            <Link to="/jobs" className="flex-1">
              <Button block>Cancel</Button>
            </Link>
            <Button type="primary" htmlType="submit" block>
              Post Job
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default NewJobRecruiter;
