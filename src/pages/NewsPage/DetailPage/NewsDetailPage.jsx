import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NewsDetailPage.css";
import { getNewsByIdAPI, getAllNewsAPI } from "../../../apis";
import dayjs from "dayjs";

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // map category sang tiếng Việt
  const categoryMap = {
    NEWS: "Tin tức",
    GUIDELINE: "Hướng dẫn",
    CAREER: "Hướng nghiệp",
    OTHER: "Khác",
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getNewsByIdAPI(id);
        const data = res.data || res.result || res;
        setArticle(data);

        // lấy danh sách bài viết liên quan
        const allRes = await getAllNewsAPI({ status: "PUBLISH", size: 10 });
        const list = allRes.data?.data || allRes.result?.data || allRes.data || [];
        const relatedNews = list.filter(
          (a) => a.id !== id && a.category === data.category
        );
        setRelated(relatedNews.slice(0, 2));
      } catch (err) {
        console.error("Không thể tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading)
    return <div className="loading">Đang tải bài viết...</div>;

  if (!article)
    return (
      <div className="detail-container">
        <p>Không tìm thấy bài viết.</p>
        <button className="back-btn" onClick={() => navigate("/news")}>
          ← Quay lại danh sách
        </button>
      </div>
    );

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={() => navigate("/news")}>
        ← Quay lại danh sách
      </button>

      <div className="detail-article">
        {/* Danh mục */}
        <span className="detail-category">
          {categoryMap[article.category] || "Tin tức"}
        </span>

        {/* Tiêu đề + tóm tắt */}
        <h1 className="detail-title">{article.title}</h1>
        <p className="detail-subtitle">{article.summary}</p>

        {/* Thông tin meta */}
        <div className="detail-meta">
          <span>✍ {article.authorName || "Đội ngũ FlexiStudy"}</span>
          <span>📅 {dayjs(article.createdAt).format("DD/MM/YYYY")}</span>
          <span>⏱ 5 phút đọc</span>
          <button
            className="share-btn"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Đã sao chép liên kết bài viết!");
            }}
          >
            📤 Chia sẻ
          </button>
        </div>

        {/* Ảnh chính */}
        <img
          className="detail-image"
          src={article.imageUrl}
          alt={article.title}
          onError={(e) => (e.target.src = "/fallback.jpg")}
        />

        {/* Nội dung bài viết */}
        <div className="detail-content">
          <h2>Nội dung bài viết</h2>
          <div
            className="detail-body"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </div>

        {/* Bài viết liên quan */}
        {related.length > 0 && (
          <div className="related-section">
            <h2>Bài viết liên quan</h2>
            <div className="related-grid">
              {related.map((r) => (
                <div
                  key={r.id}
                  className="related-card"
                  onClick={() => navigate(`/news/${r.id}`)}
                >
                  <img src={r.imageUrl} alt={r.title} />
                  <div className="related-content">
                    <span className="related-category">
                      {categoryMap[r.category] || "Tin tức"}
                    </span>
                    <h3>{r.title}</h3>
                    <p>{r.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
