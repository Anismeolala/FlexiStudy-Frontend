import React, { useEffect, useState, useMemo } from "react";
import "./NewsPage.css";
import { Spin, Empty, message } from "antd";
import { getAllNewsAPI } from "../../apis";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";

const { Option } = Select;

export default function NewsPage() {
  const [allArticles, setAllArticles] = useState([]); // lưu toàn bộ tin publish
  const [filteredArticles, setFilteredArticles] = useState([]); // dữ liệu hiển thị
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();


  const normalizeCategory = (raw) => {
  if (!raw) return "OTHER";
  const text = raw.trim().toUpperCase();
  if (["NEWS", "TIN TUC", "TIN TỨC"].includes(text)) return "NEWS";
  if (["GUIDELINE", "HUONG DAN", "HƯỚNG DẪN"].includes(text)) return "GUIDELINE";
  if (["CAREER", "HUONG NGHIEP", "HƯỚNG NGHIỆP"].includes(text)) return "CAREER";
  return "OTHER";
};

  // Lấy toàn bộ bài viết publish 1 lần
  const loadArticles = async () => {
  try {
    setLoading(true);
    const params = { page: 1, size: 100, status: "PUBLISH" };
    const res = await getAllNewsAPI(params);

    const list = (res.data?.data || res.result?.data || res.data || []).map(
      (a) => ({
        ...a,
        category: normalizeCategory(a.category),
      })
    );

    setAllArticles(list);
    setFilteredArticles(list);
  } catch (err) {
    console.error("Lỗi tải tin tức:", err);
    message.error("Không thể tải danh sách bài viết!");
    setError("Không thể tải danh sách bài viết.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadArticles();
  }, []);

  const categoryMap = {
    NEWS: "Tin tức",
    GUIDELINE: "Hướng dẫn",
    CAREER: "Hướng nghiệp",
    OTHER: "Khác",
  };

  const categories = useMemo(() => ["all", ...Object.keys(categoryMap)], []);

  // Lọc client-side theo search + category
  useEffect(() => {
  let filtered = allArticles;

  if (selectedCategory !== "all") {
    filtered = filtered.filter(
      (a) => a.category?.trim().toUpperCase() === selectedCategory
    );
  }

  if (searchTerm.trim() !== "") {
    const lower = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title?.toLowerCase().includes(lower) ||
        a.summary?.toLowerCase().includes(lower)
    );
  }

  setFilteredArticles(filtered);
}, [searchTerm, selectedCategory, allArticles]);

  const featured = filteredArticles[0];
  const regular =
  selectedCategory === "all" && !searchTerm
    ? filteredArticles.slice(1)
    : filteredArticles;


  // UI
  return (
    <div className="career-guide">
      <header className="cg-header">
        <h1>Cẩm nang nghề nghiệp</h1>
        <p>Cập nhật xu hướng việc làm, tips phỏng vấn và phát triển sự nghiệp</p>
      </header>

      {/* Search + Filter */}
      <div className="cg-filter">
        <div className="cg-search-wrapper">
          <span className="cg-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          className="cg-select"
          dropdownClassName="cg-select-dropdown"
        >
          <Option value="all">Tất cả danh mục</Option>
          {Object.entries(categoryMap).map(([key, label]) => (
            <Option key={key} value={key}>
              {label}
            </Option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : filteredArticles.length === 0 ? (
        <Empty description="Không có bài viết nào" />
      ) : (
        <>
          {/* Featured */}
          {featured && selectedCategory === "all" && !searchTerm && (
            <div className="cg-featured"
              onClick={() => navigate(`/news/${featured.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/news/${featured.id}`)}
            >
              <img
                src={featured.imageUrl}
                alt={featured.title}
                onError={(e) => (e.target.src = "/fallback.jpg")}
              />
              <div className="cg-featured-content">
                <div className="cg-meta">
                  <span className="cg-badge">
                    {categoryMap[featured.category] || "Tin tức"}
                  </span>
                </div>
                <h2>{featured.title}</h2>
                <p>{featured.summary}</p>
                <div className="cg-footer">
                  <span>{featured.authorName || "FlexiStudy Team"}</span>
                  <span>{dayjs(featured.createdAt).format("DD/MM/YYYY")}</span>
                </div>
                <button
                  className="cg-link"
                
                >
                  Đọc thêm →
                </button>
              </div>
            </div>
          )}

          {/* Grid Articles */}
          <div className="cg-grid">
            {regular.map((a) => (
              <div
                key={a.id}
                className="cg-card"
                onClick={() => navigate(`/news/${a.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/news/${a.id}`)}
              >
                <img
                  src={a.imageUrl}
                  alt={a.title}
                  onError={(e) => (e.target.src = "/fallback.jpg")}
                />
                <div className="cg-card-content">
                  <div className="cg-meta">
                    <span className="cg-badge">
                      {categoryMap[a.category] || "Tin tức"}
                    </span>
                  </div>
                  <h3>{a.title}</h3>
                  <p>{a.summary}</p>
                  <div className="cg-footer">
                    <span>{a.authorName || "FlexiStudy Team"}</span>
                    <span>{dayjs(a.createdAt).format("DD/MM/YYYY")}</span>
                  </div>
                  <button
                    className="cg-link"
                  >
                    Đọc thêm →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="cg-categories">
            <h3>Danh mục bài viết</h3>
            <p>Khám phá các chủ đề phát triển nghề nghiệp</p>
            <div className="cg-category-buttons">
              {categories.map((cat) => {
                const label = cat === "all" ? "Tất cả" : categoryMap[cat];
                const count =
                  cat === "all"
                    ? allArticles.length
                    : allArticles.filter((a) => a.category === cat).length;
                return (
                  <button
                    key={cat}
                    className={`cg-cat-btn ${
                      selectedCategory === cat ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
