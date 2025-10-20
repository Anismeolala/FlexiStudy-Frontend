import React from "react";
import {
  Card,
  Input,
  Button,
  Avatar,
  Badge,
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  StarFilled,
} from "@ant-design/icons";
import { IoBagOutline } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./CandidateManage.css";

const CandidateManage = () => {
  const candidates = [
    {
      id: 1,
      name: "Nguyen Van A",
      email: "nguyenvana@email.com",
      appliedFor: "Senior Frontend Developer",
      location: "Ho Chi Minh City",
      experience: "5 years",
      education: "Bachelor in Computer Science",
      status: "interview",
      matchScore: 95,
      skills: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
      appliedDate: "2 days ago",
    },
    {
      id: 2,
      name: "Tran Thi B",
      email: "tranthib@email.com",
      appliedFor: "Product Designer",
      location: "Hanoi",
      experience: "3 years",
      education: "Bachelor in Design",
      status: "review",
      matchScore: 88,
      skills: ["Figma", "UI/UX", "Design Systems", "Prototyping"],
      appliedDate: "3 days ago",
    },
    {
      id: 3,
      name: "Le Van C",
      email: "levanc@email.com",
      appliedFor: "Marketing Manager",
      location: "Da Nang",
      experience: "7 years",
      education: "MBA in Marketing",
      status: "offer",
      matchScore: 92,
      skills: ["SEO", "Content Strategy", "Analytics", "Team Lead"],
      appliedDate: "1 week ago",
    },
    {
      id: 4,
      name: "Pham Thi D",
      email: "phamthid@email.com",
      appliedFor: "Senior Frontend Developer",
      location: "Ho Chi Minh City",
      experience: "4 years",
      education: "Bachelor in Software Engineering",
      status: "hired",
      matchScore: 90,
      skills: ["React", "TypeScript", "GraphQL", "Testing"],
      appliedDate: "2 weeks ago",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "hired":
        return "green";
      case "offer":
        return "blue";
      case "interview":
        return "orange";
      case "review":
        return "purple";
      default:
        return "default";
    }
  };

  return (
    <div className="candidates-page">
      {/* Header */}
      <div className="candidates-header">
        <div>
          <h1>Candidate Pipeline</h1>
          <p>Review and manage applications</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="candidates-toolbar">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search candidates by name, skills, or position..."
          size="large"
        />
        <div className="toolbar-buttons">
          <Button>Filter by Status</Button>
          <Button>Sort by Match</Button>
        </div>
      </div>

      {/* Candidates List */}
      <div className="candidates-list">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="candidate-card" hoverable>
            <div className="candidate-content">
              <Avatar
                size={64}
                className="candidate-avatar"
                style={{ backgroundColor: "#1677ff" }}
              >
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>

              <div className="candidate-info">
                <div className="candidate-header">
                  <div>
                    <h3>{candidate.name}</h3>
                    <p className="candidate-email">{candidate.email}</p>
                  </div>
                  <div className="candidate-status">
                    <div className="match-score">
                      <StarFilled className="star-icon" />
                      <span>{candidate.matchScore}%</span>
                    </div>
                    <Badge
                      color={getStatusColor(candidate.status)}
                      text={candidate.status.toUpperCase()}
                    />
                  </div>
                </div>

                <div className="candidate-role">
                  <IoBagOutline />
                  <span>Applied for: {candidate.appliedFor}</span>
                </div>

                <div className="candidate-meta">
                  <span>
                    <EnvironmentOutlined /> {candidate.location}
                  </span>
                  <span>• {candidate.experience}</span>
                  <span>• <FaGraduationCap /> {candidate.education}</span>
                </div>

                <div className="candidate-skills">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} count={skill} className="skill-badge" />
                  ))}
                </div>

                <div className="candidate-footer">
                  <span className="applied-date">
                    Applied {candidate.appliedDate}
                  </span>
                  <div className="footer-buttons">
                    <Button>View Profile</Button>
                    <Button type="primary">Update Status</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CandidateManage;
