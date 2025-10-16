import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import "./ApplicationDialog.css";
import { uploadCvAPI, createApplicationAPI } from "../../../apis";
import { message } from "antd";

export default function ApplicationDialog({
  open,
  onClose,
  jobId,
  jobTitle,
  companyName,
  onSubmitted,
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setFullName("");
      setEmail("");
      setPhone("");
      setCoverLetter("");
      setFile(null);
      setErrors({});
      setSubmitting(false);
    }

    // Khóa scroll khi mở modal
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const selectedFileInfo = useMemo(() => {
    if (!file) return "";
    const mb = (file.size / 1024 / 1024).toFixed(2);
    return `${file.name} (${mb} MB)`;
  }, [file]);

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Vui lòng nhập họ tên";
    else if (fullName.trim().length > 100) e.fullName = "Tối đa 100 ký tự";

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) e.email = "Vui lòng nhập email";
    else if (!emailRe.test(email.trim())) e.email = "Email không hợp lệ";
    else if (email.trim().length > 255) e.email = "Email tối đa 255 ký tự";

    const phoneRe = /^[0-9]{10,11}$/;
    if (!phone.trim()) e.phone = "Vui lòng nhập số điện thoại";
    else if (!phoneRe.test(phone.trim())) e.phone = "SĐT phải có 10–11 chữ số";

    if (!file) e.file = "Vui lòng tải lên CV";
    else {
      const ok = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!ok.includes(file.type)) e.file = "Chỉ chấp nhận PDF/DOC/DOCX";
      if (file.size > 5 * 1024 * 1024) e.file = "Kích thước tối đa 5MB";
    }

    if (coverLetter && coverLetter.trim().length > 1000)
      e.coverLetter = "Thư giới thiệu tối đa 1000 ký tự";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      // 1️⃣ Upload CV
      const uploadRes = await uploadCvAPI(file);
      const cvUrl = uploadRes?.result;
      if (!cvUrl) throw new Error("Không thể upload CV. Vui lòng thử lại!");

      console.log("✅ CV uploaded:", cvUrl);

      // 2️⃣ Tạo Application
      const appRes = await createApplicationAPI({
        jobId,
        fullName,
        email,
        phone,
        coverLetter,
        cvUrl,
      });

      if (!appRes?.result) throw new Error(appRes?.message || "Không thể tạo hồ sơ!");

      console.log("✅ Application created:", appRes.result);

      message.success(`🎉 Ứng tuyển thành công cho vị trí "${jobTitle}" tại ${companyName}!`);
      onSubmitted?.();
      onClose();
    } catch (err) {
      console.error("❌ Lỗi ứng tuyển:", err);
      message.error(err.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const modal = (
    <div
      className="apply-modal__overlay"
      onClick={() => !submitting && onClose()}
    >
      <div
        className="apply-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="apply-modal__close"
          onClick={() => !submitting && onClose()}
          aria-label="Đóng"
        >
          ×
        </button>

        <div className="apply-modal__header">
          <div className="apply-modal__title">Ứng tuyển vị trí</div>
          <div className="apply-modal__subtitle">
            {jobTitle} tại {companyName}
          </div>
        </div>

        <form className="apply-form" onSubmit={handleSubmit} noValidate>
          <div className="apply-form__item">
            <label>
              Họ và tên <span className="required">*</span>
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
            />
            {errors.fullName && (
              <div className="apply-form__error">{errors.fullName}</div>
            )}
          </div>

          <div className="apply-form__item">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
            {errors.email && (
              <div className="apply-form__error">{errors.email}</div>
            )}
          </div>

          <div className="apply-form__item">
            <label>
              Số điện thoại <span className="required">*</span>
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912345678"
            />
            {errors.phone && (
              <div className="apply-form__error">{errors.phone}</div>
            )}
          </div>

          <div className="apply-form__item">
            <label>
              CV/Resume <span className="required">*</span>
            </label>
            <label className="apply-upload">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                hidden
              />
              <span className="apply-upload__btn">
                Tải lên CV (PDF, DOC, DOCX - Max 5MB)
              </span>
            </label>
            {file && (
              <div className="apply-upload__filename">
                📄 {selectedFileInfo}
              </div>
            )}
            {errors.file && (
              <div className="apply-form__error">{errors.file}</div>
            )}
          </div>

          <div className="apply-form__item">
            <label>Thư giới thiệu (Không bắt buộc)</label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Giới thiệu ngắn gọn về bản thân và lý do bạn phù hợp với vị trí này..."
            />
            {errors.coverLetter && (
              <div className="apply-form__error">{errors.coverLetter}</div>
            )}
          </div>

          <div className="apply-actions">
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => !submitting && onClose()}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting ? "Đang gửi..." : "Gửi hồ sơ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
