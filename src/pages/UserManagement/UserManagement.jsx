import { Col, Form, Input, message, Row, Select, Spin } from 'antd';
import { FaUser, FaUserPlus } from "react-icons/fa";
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { createUserAPI, getAllUsersAPI, updateUserAPI } from '../../apis';
import { setLayoutData } from "../../redux/layoutSlice";
import { usePermission } from "../../components/hooks/usePermission";
import TableUser from './TableUser';
import ModalFormUser from './ModalFormUser';

const ROLE_TYPES = ["USER", "RECRUITER", "ADMIN"];

const UserManagement = () => {
  const dispatch = useDispatch();
  const isCanManageUser = usePermission("USER_MANAGE");
  const isCanManageRecruiter = usePermission("Recruiter_MANAGE");
  const isCanManageAdmin = usePermission("Admin_MANAGE");

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // ✅ Bộ lọc tìm kiếm
  const [filters, setFilters] = useState({
    search: '',
    username: '',
    email: '',
    deleted: 'all'
  });

  // ✅ Chuẩn hóa dữ liệu trả về từ backend
  const mapUserResponse = (user) => ({
    id: user.id,
    firstName: user.firstName || "Chưa có tên",
    lastName: user.lastName || "Chưa có họ",
    username: user.username || "Chưa có tên đăng nhập",
    email: user.email || "Không rõ email",
    phone: user.phone || "Không rõ số điện thoại",
    address: user.address || "Không rõ địa chỉ",
    deleted: user.deleted ?? 0,
    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "",
    updatedAt: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString("vi-VN") : "",
    avatarUrl: user.avatarUrl || "",
  });

  // ✅ Gọi API lấy danh sách user
  const loadUsers = async (isInitial = false, customFilters = null, customPagination = null) => {
    try {
      isInitial ? setInitialLoading(true) : setLoading(true);

      const currentFilters = customFilters || filters;
      const currentPagination = customPagination || pagination;

      const params = {
        page: currentPagination.current,
        size: currentPagination.pageSize,
        ...(currentFilters.deleted !== 'all' && { deleted: currentFilters.deleted }),
        ...(currentFilters.search && { search: currentFilters.search }),
        ...(currentFilters.username && { username: currentFilters.username }),
        ...(currentFilters.email && { email: currentFilters.email }),
      };

      const response = await getAllUsersAPI(params);
      if (response?.code === 1000 && response?.result) {
        const { data, currentPage, pageSize, totalElements } = response.result;
        setUsers(data.map(mapUserResponse));
        setPagination({
          current: currentPage,
          pageSize,
          total: totalElements,
        });
      } else {
        throw new Error(response?.message || "API trả về lỗi");
      }
    } catch (error) {
      console.error("❌ Lỗi loadUsers:", error);
      message.error("Không thể tải danh sách người dùng");
    } finally {
      isInitial ? setInitialLoading(false) : setLoading(false);
    }
  };

  // ✅ Khi thay đổi bộ lọc
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // ✅ Phân trang table
  const handleTableChange = (antPagination) => {
    const newPagination = {
      current: antPagination.current,
      pageSize: antPagination.pageSize,
      total: pagination.total,
    };
    loadUsers(false, filters, newPagination);
  };

  // ✅ Tạo hoặc cập nhật user
  const handleCreateOrUpdateUser = async (formValues) => {
    try {
      const isEdit = !!editingUser;
      const payload = { ...formValues, avatarUrl: formValues.avatarUrl || null, roles: formValues.roles || [] };
      delete payload.confirm;

      const response = isEdit
        ? await updateUserAPI(editingUser.id, payload)
        : await createUserAPI(payload);

      if (response?.code === 1000) {
        message.success(`${isEdit ? "Cập nhật" : "Tạo"} người dùng thành công`);
        await loadUsers(false, filters, { current: 1, pageSize: pagination.pageSize, total: 0 });
        setIsModalVisible(false);
      } else {
        throw new Error(response?.message || "Lỗi không xác định");
      }
    } catch (error) {
      message.error("Không thể tạo/cập nhật người dùng");
    }
  };

  // ✅ Lần đầu load
  useEffect(() => {
    dispatch(setLayoutData({ title: "Quản lý người dùng", icon: <FaUser /> }));
    loadUsers(true);
  }, [dispatch]);

  // ✅ Debounce filter (500ms)
  useEffect(() => {
    if (!initialLoading) {
      const timeoutId = setTimeout(() => {
        loadUsers(false, filters, { current: 1, pageSize: pagination.pageSize, total: 0 });
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [filters.search, filters.username, filters.email, filters.deleted]);

  return (
    <div className="manage-user-container">
      <div className="users-content" style={{ marginTop: "20px" }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Form form={form} layout="inline" name="searchForm" initialValues={filters}>
              <Form.Item name="search" style={{ minWidth: 200 }}>
                <Input
                  placeholder="Tìm kiếm chung (username, email)..."
                  allowClear
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </Form.Item>

              <Form.Item name="username" style={{ minWidth: 150 }}>
                <Input
                  placeholder="Tìm theo username..."
                  allowClear
                  onChange={(e) => handleFilterChange('username', e.target.value)}
                />
              </Form.Item>

              <Form.Item name="email" style={{ minWidth: 150 }}>
                <Input
                  placeholder="Tìm theo email..."
                  allowClear
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                />
              </Form.Item>

              <Form.Item name="deleted" style={{ minWidth: 120 }}>
                <Select
                  placeholder="Trạng thái"
                  onChange={(value) => handleFilterChange('deleted', value)}
                  defaultValue="all"
                  options={[
                    { value: 'all', label: 'Tất cả' },
                    { value: '0', label: 'Hoạt động' },
                    { value: '1', label: 'Vô hiệu hóa' }
                  ]}
                />
              </Form.Item>
            </Form>
          </Col>

          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <PrimaryButton
              icon={<FaUserPlus />}
              onClick={() => {
                setEditingUser(null);
                setIsModalVisible(true);
              }}
            >
              Tạo tài khoản
            </PrimaryButton>
          </Col>
        </Row>

        <div className="table-user" style={{ marginTop: "24px" }}>
          {initialLoading ? (
            <Spin />
          ) : (
            <TableUser
              handleEdit={(u) => setEditingUser(u) || setIsModalVisible(true)}
              handleAdd={() => setIsModalVisible(true)}
              dataSource={users}
              loading={loading}
              pagination={pagination}
              onTableChange={handleTableChange}
            />
          )}
        </div>

        <ModalFormUser
          onSubmit={handleCreateOrUpdateUser}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          editingUser={editingUser}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default UserManagement;
