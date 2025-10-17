// pages/Job/JobsByCategory.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card, Button, Input, Pagination, Drawer, Spin, Empty, message, Radio,
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  StarFilled,
  DollarOutlined,
} from "@ant-design/icons";
import { getJobsByCategoryAPI } from "../../apis";
import "./JobsByCategory.css";

const PAGE_SIZE = 12;

/* ----------------- Filters ----------------- */
const JobFilters = ({
  type, setType,
  city, setCity,
  minSalary, setMinSalary,
  maxSalary, setMaxSalary,
  onSearch, resetTrigger,
  onAfterSelect,
}) => {
  // reset khi bấm "Xóa tất cả" từ ngoài
  useEffect(() => {
    setType("");
    setCity("");
    setMinSalary(null);
    setMaxSalary(null);
  }, [resetTrigger, setType, setCity, setMinSalary, setMaxSalary]);

  const salaryKey =
    minSalary === 0 && maxSalary === 15000000 ? "under15" :
    minSalary === 15000000 && maxSalary === 25000000 ? "15to25" :
    minSalary === 25000000 && maxSalary === 35000000 ? "25to35" :
    minSalary === 35000000 && maxSalary === 50000000 ? "35to50" :
    minSalary === 50000000 ? "above50" : "";

  const toggleType = (value) => {
    const next = type === value ? "" : value;
    setType(next);
    onSearch({ type: next || null, page: 1 });
    onAfterSelect?.();
  };

  const toggleCity = (value) => {
    const next = city === value ? "" : value;
    setCity(next);
    onSearch({ city: next || null, page: 1 });
    onAfterSelect?.();
  };

  const toggleSalary = (value) => {
    let min = null, max = null;
    if (value) {
      if (value === "under15") { min = 0; max = 15000000; }
      if (value === "15to25") { min = 15000000; max = 25000000; }
      if (value === "25to35") { min = 25000000; max = 35000000; }
      if (value === "35to50") { min = 35000000; max = 50000000; }
      if (value === "above50") { min = 50000000; max = null; }
    }
    const isSame = salaryKey === value;
    if (isSame) {
      setMinSalary(null); setMaxSalary(null);
      onSearch({ minSalary: null, maxSalary: null, page: 1 });
    } else {
      setMinSalary(min); setMaxSalary(max);
      onSearch({ minSalary: min, maxSalary: max, page: 1 });
    }
    onAfterSelect?.();
  };

  return (
    <div className="filters-stack space-y-6">
      {/* Loại hình công việc */}
      <Card size="small" className="filter-card">
        <div className="filter-title">Loại hình công việc</div>
        <div className="flex flex-col space-y-2 mt-2">
          {[
            { value: "FULLTIME", label: "Toàn thời gian" },
            { value: "PARTTIME", label: "Bán thời gian" },
            { value: "INTERN",   label: "Thực tập" },
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

      {/* Địa điểm */}
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

      {/* Mức lương */}
      <Card size="small" className="filter-card">
        <div className="filter-title">Mức lương</div>
        <div className="flex flex-col space-y-2 mt-2">
          {[
            { val: "under15", label: "Dưới 15 triệu" },
            { val: "15to25",  label: "15–25 triệu" },
            { val: "25to35",  label: "25–35 triệu" },
            { val: "35to50",  label: "35–50 triệu" },
            { val: "above50", label: "Trên 50 triệu" },
          ].map(({ val, label }) => (
            <Radio
              key={val}
              checked={salaryKey === val}
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

  const modeLabel = (m) => ({ ONSITE: "Onsite", REMOTE: "Remote" }[m] || m || "");

  const fmtSalaryMil = (min, max, cur = "VND") => {
    if (!min && !max) return "Thoả thuận";
    const toMil = (v) => Math.round(v / 1_000_000);
    if (min && max) return `${toMil(min)}–${toMil(max)} triệu ${cur}`;
    if (min) return `${toMil(min)} triệu ${cur}`;
    return `${toMil(max)} triệu ${cur}`;
  };

  const salaryText = fmtSalaryMil(job?.minSalary, job?.maxSalary, job?.currency || "VND");
  const shortDesc = (job?.description || "").slice(0, 180);
  const desc = String(job?.description || "");
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
            onError={(e) => (e.currentTarget.src = "/default-company.png")}
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

      {shortDesc && <p className="desc">{shortDesc}...</p>}

      <div className="jc-row foot">
        <span className="posted">
          {job?.postedAt ? new Date(job.postedAt).toLocaleDateString("vi-VN") : ""}
        </span>
        <Button type="primary" className="cta" onClick={onClick}>
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}

/* ----------------- Page ----------------- */
export default function JobsByCategory() {
  const { category: rawCategory } = useParams();
  const category = (() => { try { return decodeURIComponent(rawCategory || "").trim(); } catch { return rawCategory || ""; }})();
  const navigate = useNavigate();

  // list & state
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // filters
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [minSalary, setMinSalary] = useState();
  const [maxSalary, setMaxSalary] = useState();
  const [resetTrigger, setResetTrigger] = useState(0);

  // pagination
  const [page, setPage] = useState(1);

  // drawer (mobile)
  const [openDrawer, setOpenDrawer] = useState(false);

  const fetchJobs = async (override = {}) => {
    try {
      setLoading(true);

      const take = (k, fb) =>
        Object.prototype.hasOwnProperty.call(override, k) ? override[k] : fb;

      const nextPage = take("page", page);
      const kwRaw = take("keyword", keyword);
      const ctRaw = take("city", city);
      const min = take("minSalary", minSalary);
      const max = take("maxSalary", maxSalary);
      const tp  = take("type", type);

      const params = { category, page: nextPage, size: PAGE_SIZE };

      const kw = (kwRaw ?? "").trim();
      const ct = (ctRaw ?? "").trim();
      if (kw) params.search = kw;
      if (ct) params.city = ct;
      if (min !== null && min !== undefined && min !== "") params.minSalary = min;
      if (max !== null && max !== undefined && max !== "") params.maxSalary = max;
      if (tp  !== null && tp  !== undefined && tp  !== "") params.type = tp;

      const res = await getJobsByCategoryAPI(params);
      console.log("getJobsByCategoryAPI", { params, res });
      setJobs(res?.result?.data ?? []);
      setTotal(res?.result?.totalElements ?? 0);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh sách việc làm theo ngành");
      setJobs([]); setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // load lần đầu + khi đổi page hoặc đổi category
  useEffect(() => {
    fetchJobs({ page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, page]);

  // khi đổi category → reset filter & về trang 1
  useEffect(() => {
    setKeyword("");
    setCity("");
    setType("");
    setMinSalary();
    setMaxSalary();
    setPage(1);
    setResetTrigger((x) => x + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const onSearch = (override = {}) => {
    // chặn khi truyền event từ input
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
    setPage(1);
  };

  const onReset = () => {
    setKeyword("");
    setCity("");
    setType("");
    setMinSalary();
    setMaxSalary();
    setPage(1);
    setResetTrigger((v) => v + 1);
    fetchJobs({ page: 1, keyword: "", city: "", minSalary: null, maxSalary: null, type: "" });
  };

  return (
    <div className="jobs-wrap">
      <div className="container">
        {/* Title + SearchBar (pill) */}
        <div className="jobs-top">
          <h1 className="page-title">
            Việc làm theo ngành: <span className="highlight">{category}</span>
          </h1>

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
          <p className="jobs-subtitle">
            Danh sách các công việc thuộc lĩnh vực <b>{category}</b>
          </p>
        </div>

        <div className="jobs-flex">
          {/* toggle filters (mobile) */}
          <Button
            className="filter-toggle-btn"
            onClick={() => setOpenDrawer(true)}
            icon={<AppstoreOutlined />}
          >
            Bộ lọc
          </Button>

          {/* Filters desktop */}
          <aside className="filters-desktop">
            <div className="filters-sticky">
              <div className="filters-head">
                <h2 className="filters-title">Bộ lọc</h2>
                <Button
                  type="text"
                  size="small"
                  onClick={onReset}
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

          {/* Job list */}
          <div className="jobs-content">
            <div className="jobs-count">
              <span className="muted">Hiển thị </span>
              <b className="count-strong">{total}</b>
              <span className="muted"> công việc</span>
            </div>

            {loading ? (
              <div className="center-pad"><Spin size="large" /></div>
            ) : jobs.length === 0 ? (
              <Empty description="Không có công việc nào trong ngành này" />
            ) : (
              <div className="card-stack">
                {jobs.map((job) => (
                  <JobCardItem
                    key={job.id}
                    job={job}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  />
                ))}
              </div>
            )}

            <Pagination
              current={page}
              total={total}
              pageSize={PAGE_SIZE}
              onChange={setPage}
              className="pagination"
            />
          </div>
        </div>
      </div>

      {/* Drawer mobile */}
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
          onAfterSelect={() => setOpenDrawer(false)} // đóng sau khi chọn
        />
      </Drawer>
    </div>
  );
}
