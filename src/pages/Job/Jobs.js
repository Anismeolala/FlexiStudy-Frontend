import React, { useEffect, useState } from "react";
import {
  Card, Button, Input, Select, InputNumber,
  Pagination, Drawer, Spin, Empty, Tag, message,
  Radio
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  StarFilled,
  DollarOutlined,
} from "@ant-design/icons";
import { getAllJobsAPI } from "../../apis";
import "./Jobs.css";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const PAGE_SIZE = 12;

const JobFilters = ({
  type, setType,
  city, setCity,
  minSalary, setMinSalary,
  maxSalary, setMaxSalary,
  onSearch, resetTrigger,
  onAfterSelect
}) => {
  useEffect(() => {
    setType("");
    setCity("");
    setMinSalary(null);
    setMaxSalary(null);
  }, [resetTrigger]);

  // 🟢 Toggle logic cho từng filter
  const toggleType = (value) => {
    const newType = type === value ? "" : value;
    setType(newType);
    onSearch({ type: newType || null, page: 1 });
    onAfterSelect?.();
  };

  const toggleCity = (value) => {
    const newCity = city === value ? "" : value;
    setCity(newCity);
    onSearch({ city: newCity || null, page: 1 });
    onAfterSelect?.();
  };

  const toggleSalary = (value) => {
    let min = null, max = null;
    if (value) {
      switch (value) {
        case "under15": min = 0; max = 15000000; break;
        case "15to25": min = 15000000; max = 25000000; break;
        case "25to35": min = 25000000; max = 35000000; break;
        case "35to50": min = 35000000; max = 50000000; break;
        case "above50": min = 50000000; max = null; break;
      }
    }

    const currentValue =
      minSalary === 0 && maxSalary === 15000000 ? "under15" :
      minSalary === 15000000 && maxSalary === 25000000 ? "15to25" :
      minSalary === 25000000 && maxSalary === 35000000 ? "25to35" :
      minSalary === 35000000 && maxSalary === 50000000 ? "35to50" :
      minSalary === 50000000 ? "above50" : "";

    const isSame = currentValue === value;

    if (isSame) {
      setMinSalary(null);
      setMaxSalary(null);
      onSearch({ minSalary: null, maxSalary: null, page: 1 });
    } else {
      setMinSalary(min);
      setMaxSalary(max);
      onSearch({ minSalary: min, maxSalary: max, page: 1 });
    }
    onAfterSelect?.();
  };

  const salaryValue =
    minSalary === 0 && maxSalary === 15000000 ? "under15" :
    minSalary === 15000000 && maxSalary === 25000000 ? "15to25" :
    minSalary === 25000000 && maxSalary === 35000000 ? "25to35" :
    minSalary === 35000000 && maxSalary === 50000000 ? "35to50" :
    minSalary === 50000000 ? "above50" : "";

  return (
    <div className="filters-stack space-y-6">

      {/* 🔹 Loại hình công việc */}
      <Card size="small" className="filter-card">
        <div className="filter-title">Loại hình công việc</div>
        <div className="flex flex-col space-y-2 mt-2">
          {[
            { value: "FULLTIME", label: "Toàn thời gian" },
            { value: "PARTTIME", label: "Bán thời gian" },
            { value: "INTERN", label: "Thực tập" },
          ].map((opt) => (
            <Radio
              key={opt.value}
              checked={type === opt.value}
              onClick={() => toggleType(opt.value)}
            >
              {opt.label}
            </Radio>
          ))}
        </div>
      </Card>

      {/* 🔹 Địa điểm */}
      <Card size="small" className="filter-card">
        <div className="filter-title">Địa điểm</div>
        <div className="flex flex-col space-y-2 mt-2">
          {["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Bình Dương"].map((val) => (
            <Radio
              key={val}
              checked={city === val}
              onClick={() => toggleCity(val)}
            >
              {val}
            </Radio>
          ))}
        </div>
      </Card>

      {/* 🔹 Mức lương */}
      <Card size="small" className="filter-card">
        <div className="filter-title">Mức lương</div>
        <div className="flex flex-col space-y-2 mt-2">
          {[
            { val: "under15", label: "Dưới 15 triệu" },
            { val: "15to25", label: "15–25 triệu" },
            { val: "25to35", label: "25–35 triệu" },
            { val: "35to50", label: "35–50 triệu" },
            { val: "above50", label: "Trên 50 triệu" },
          ].map(({ val, label }) => (
            <Radio
              key={val}
              checked={salaryValue === val}
              onClick={() => toggleSalary(val)}
            >
              {label}
            </Radio>
          ))}
        </div>
      </Card>
    </div>
  );
};


/* ----------------- Job card ----------------- */
function JobCardItem({ job, onClick }) {
  const logoSrc = (job?.companyLogoUrl || "/default-company.png").replace(/ /g, "%20");

  const typeLabel = (t) =>
    ({ INTERN: "Thực tập", PARTTIME: "Bán thời gian", FULLTIME: "Toàn thời gian" }[t] || t || "");

  const modeLabel = (m) => ({ ONSITE: "Onsite", HYBRID: "Hybrid", REMOTE: "Remote" }[m] || m || "");

  const fmtSalaryMil = (min, max, cur = "VND") => {
    if (!min && !max) return "Thoả thuận";
    const toMil = (v) => Math.round(v / 1_000_000);
    if (min && max) return `${toMil(min)}–${toMil(max)} triệu ${cur}`;
    if (min) return `${toMil(min)} triệu ${cur}`;
    return `${toMil(max)} triệu ${cur}`;
  };

  const salaryText = fmtSalaryMil(job?.minSalary, job?.maxSalary, job?.currency || "VND");
  const desc = String(job?.description || "");
  const shortDesc = desc.length > 200 ? `${desc.slice(0, 200)}…` : desc;
  const posted = job?.postedAt ? new Date(job.postedAt).toLocaleDateString("vi-VN") : "";

  return (
    <div className="jobcard-neo">
      {job?.urgent && (
        <div className="jobcard-badge">
          <StarFilled /> <span>Nổi bật</span>
        </div>
      )}

      <div className="jc-row top">
        <div className="logo-wrap">
          <img
            src={logoSrc}
            alt={job?.companyName || "Logo"}
            onError={(e) => {
              e.currentTarget.src = "/default-company.png";
            }}
            loading="lazy"
          />
        </div>

        <div className="title-wrap">
          <div className="title">{job?.title}</div>
          <div className="company">{job?.companyName}</div>
          <div className="meta">
            <span><EnvironmentOutlined /> {job?.city || "Toàn quốc"}</span>
            <span><AppstoreOutlined /> {typeLabel(job?.type)}{job?.mode ? ` · ${modeLabel(job.mode)}` : ""}</span>
            <span className="salary"><DollarOutlined /> {salaryText}</span>
          </div>
        </div>
      </div>

      {shortDesc && <p className="desc">{shortDesc}</p>}

      <div className="jc-row foot">
        <span className="posted">{posted}</span>
        <Button type="primary" className="cta" onClick={onClick}>
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}

/* ----------------- Page ----------------- */
export default function Jobs() {
  // list & state
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  // filters
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [minSalary, setMinSalary] = useState();
  const [maxSalary, setMaxSalary] = useState();
  const [resetTrigger, setResetTrigger] = useState(0);
  const navigate = useNavigate();


  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  // drawer (mobile)
  const [openDrawer, setOpenDrawer] = useState(false);

 const fetchJobs = async (override = {}) => {
  try {
    setLoading(true);

    const take = (key, fallback) =>
      Object.prototype.hasOwnProperty.call(override, key) ? override[key] : fallback;

    const page = take("page", currentPage);
    const kwRaw = take("keyword", keyword);
    const ctRaw = take("city", city);
    const min = take("minSalary", minSalary);
    const max = take("maxSalary", maxSalary);
    const tp  = take("type", type);

    const params = { page, size: PAGE_SIZE };
    const kw = (kwRaw ?? "").trim();
    const ct = (ctRaw ?? "").trim();

    if (kw) params.search = kw;
    if (ct) params.city = ct;
    if (min !== null && min !== undefined && min !== "") params.minSalary = min;
    if (max !== null && max !== undefined && max !== "") params.maxSalary = max;
    if (tp  !== null && tp  !== undefined && tp  !== "") params.type = tp;

    const res = await getAllJobsAPI(params);
    console.log("Fetched jobs:", res);
    setJobs(res?.result?.data ?? []);
    setTotal(res?.result?.totalElements ?? 0);
  } catch (e) {
    console.error(e);
    message.error("Không tải được danh sách việc làm");
    setJobs([]); setTotal(0);
  } finally {
    setLoading(false);
  }
};



  // chỉ đổi trang -> fetch lại với page mới
  useEffect(() => {
    fetchJobs({ page: currentPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

    const onSearch = (override = {}) => {
      // chặn trường hợp bị truyền event
      if (override && (override.nativeEvent || typeof override.preventDefault === "function")) {
        override = {};
      }
      fetchJobs({
        page: 1,
        ...(Object.prototype.hasOwnProperty.call(override, "keyword") ? { keyword: override.keyword } : {}),
        ...(Object.prototype.hasOwnProperty.call(override, "city") ? { city: override.city } : {}),
        ...(Object.prototype.hasOwnProperty.call(override, "minSalary") ? { minSalary: override.minSalary } : {}),
        ...(Object.prototype.hasOwnProperty.call(override, "maxSalary") ? { maxSalary: override.maxSalary } : {}),
        ...(Object.prototype.hasOwnProperty.call(override, "type") ? { type: override.type } : {}),
      });
    };

  const onReset = () => {
    setKeyword("");
    setCity("");
    setType("");
    setMinSalary();
    setMaxSalary();
    setCurrentPage(1);
    fetchJobs({ page: 1, keyword: "", city: "", minSalary: null, maxSalary: null, type: "" });
  };


  return (
    <div className="jobs-wrap">
      <div className="container">
        {/* Title + SearchBar (pill) */}
        <div className="jobs-top">
          <h1 className="page-title">Tìm kiếm công việc</h1>

          <div className="searchbar-pill" role="search">
            <div className="pill">
              <Input
                allowClear
                size="large"
                bordered={false}
                placeholder="Tên công việc, vị trí, kỹ năng..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                prefix={<SearchOutlined className="pill-icon" />}
                aria-label="Từ khóa"
              />
            </div>

            <div className="pill">
              <Input
                allowClear
                size="large"
                bordered={false}
                placeholder="Thành phố, khu vực..."
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                onPressEnter={() => onSearch()}
                prefix={<EnvironmentOutlined className="pill-icon" />}
                aria-label="Địa điểm"
              />
            </div>
            <Button size="large" className="pill-btn" onClick={onSearch}>
              Tìm kiếm
            </Button>
          </div>
        </div>

        <div className="jobs-flex">
        <Button
          className="filter-toggle-btn"
          onClick={() => setOpenDrawer(true)}
          icon={<AppstoreOutlined />}
        >
          Bộ lọc
        </Button>
          <aside className="filters-desktop">
            <div className="filters-sticky">
              <div className="filters-head">
                <h2 className="filters-title">Bộ lọc</h2>
                <Button
                  type="text"
                  size="small"
                  onClick={() => {
                    setType("");
                    setCity("");
                    setMinSalary(null);
                    setMaxSalary(null);
                    setResetTrigger(prev => prev + 1);
                    fetchJobs({ page: 1, keyword: "", city: "", type: "", minSalary: null, maxSalary: null });
                  }}
                >
                  Xóa tất cả
                </Button>
              </div>
            <JobFilters
              type={type} setType={setType}
              city={city} setCity={setCity}
              minSalary={minSalary} setMinSalary={setMinSalary}
              maxSalary={maxSalary} setMaxSalary={setMaxSalary}
              onSearch={onSearch}
              onReset={onReset}
              resetTrigger={resetTrigger}
            />
          </div>
        </aside>

          {/* Job Listings */}
          <div className="jobs-content">
            <div className="jobs-count">
              <span className="muted">Hiển thị </span>
              <b className="count-strong">{total}</b>
              <span className="muted"> công việc</span>
            </div>

            {loading ? (
              <div className="center-pad"><Spin size="large" /></div>
            ) : jobs.length === 0 ? (
              <Empty description="Không có công việc phù hợp" />
            ) : (
              <div className="card-stack">
                {jobs.map((job) => (
                  <JobCardItem 
                    key={job.id}
                    job={job}
                    onClick={() => navigate(`/jobs/${job.id}`)} />
                  ))}
              </div>
            )}

            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={setCurrentPage}
              className="pagination"
            />
          </div>
        </div>
      </div>

      <Drawer
        title={<div className="drawer-title">Lọc kết quả</div>}
        placement="left"
        width={320}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <JobFilters
          type={type} setType={setType}
          city={city} setCity={setCity}
          minSalary={minSalary} setMinSalary={setMinSalary}
          maxSalary={maxSalary} setMaxSalary={setMaxSalary}
          onSearch={onSearch}
          resetTrigger={resetTrigger}
          onAfterSelect={() => setOpenDrawer(false)} // ← đóng drawer khi chọn xong
        />
      </Drawer>
    </div>
  );
}
