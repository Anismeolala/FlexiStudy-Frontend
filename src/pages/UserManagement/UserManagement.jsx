import { Col, Form, Input, message, Modal, Row, Select, Spin, Tabs } from 'antd';
import {  FaUser, FaUserPlus } from "react-icons/fa";
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { createUserAPI, deleteUserAPI, getAllUsersAPI, updateUserAPI } from '../../apis';
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
  const [activeRoleTab, setActiveRoleTab] = useState("USER");
  const [form] = Form.useForm();

  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    deleted: '0', // 'all', '0' (active), '1' (inactive)
    username: '',
    email: ''
  });

  // Pagination states
  const [paginationByRole, setPaginationByRole] = useState({
    USER: { current: 1, pageSize: 10, total: 0 },
    STAFF: { current: 1, pageSize: 10, total: 0 },
    MANAGER: { current: 1, pageSize: 10, total: 0 },
  });


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


  const loadUsers = async (isInitial = false, customFilters = null, customPagination = null) => {
    try {
      isInitial ? setInitialLoading(true) : setLoading(true);

      const currentFilters = customFilters || filters;
      const currentPagination = customPagination || pagination;

      const apiParams = {
        page: currentPagination.current,
        size: currentPagination.pageSize,
        // sort: "createdAt,desc", // nếu BE có hỗ trợ thì để, không thì bỏ
        ...(currentFilters.deleted !== 'all' && { deleted: currentFilters.deleted }),
        ...(currentFilters.search && { search: currentFilters.search }),
        ...(currentFilters.username && { username: currentFilters.username }),
        ...(currentFilters.email && { email: currentFilters.email }),
      };

      const response = await getAllUsersAPI(apiParams);
      console.log("loadUsers -> response", response);

      if (response?.code === 1000 && response?.result) {
        const { data, currentPage, pageSize, totalElements } = response.result;

        if (Array.isArray(data)) {
          const mapped = data.map(mapUserResponse);
          setUsers(mapped);
          setPagination({
            current: currentPage,
            pageSize: pageSize,
            total: totalElements,
          });
        } else {
          throw new Error("API không trả về danh sách hợp lệ");
        }
      } else {
        throw new Error(response?.message || "API response error");
      }
    } catch (error) {
      console.error("Lỗi khi load người dùng:", error);
      message.error("Không thể tải danh sách người dùng");
    } finally {
      isInitial ? setInitialLoading(false) : setLoading(false);
    }
};


  const handleCreateOrUpdateUser = async (formValues) => {
  try {
    const isEdit = !!editingUser;
    const payload = { ...formValues, avatarUrl: formValues.avatarUrl || null, roles: formValues.roles || [] };
    delete payload.confirm;

    const response = isEdit
      ? await updateUserAPI(editingUser.id, payload)
      : await createUserAPI(payload);
    console.log("handleCreateOrUpdateUser -> response", response);
    if (response?.code === 1000 && response?.result) {
      message.success(`${isEdit ? "Cập nhật" : "Tạo"} người dùng thành công`);
      // reload danh sách với pagination hiện tại (tạo mới có thể muốn quay về trang 1)
      const nextPagination = isEdit
        ? pagination
        : { current: 1, pageSize: pagination.pageSize, total: 0 };

      await loadUsers(false, filters, nextPagination);
      handleModalCancel();
    } else {
      throw new Error(response?.message || "Lỗi không xác định");
    }
  } catch (error) {
    message.error(error?.response?.data?.message || "Không thể tạo/cập nhật người dùng");
  }
};

  const handleStatusChange = async (user, newStatus) => {
  const isActivating = newStatus === 0;
  const actionText = isActivating ? "kích hoạt" : "vô hiệu hóa";

  Modal.confirm({
    title: `Xác nhận ${actionText} tài khoản`,
    content: `Bạn có chắc chắn muốn ${actionText} tài khoản "${user.username}"?`,
    okText: isActivating ? "Kích hoạt" : "Vô hiệu hóa",
    okType: isActivating ? "primary" : "danger",
    cancelText: "Hủy",
    onOk: async () => {
      try {
        await deleteUserAPI(user.id);
        message.success("Đã vô hiệu hóa tài khoản thành công");
        await loadUsers(false, filters, pagination);
      } catch (error) {
        console.error(`Lỗi khi ${actionText} tài khoản:`, error);
        message.error(`Không thể ${actionText} tài khoản`);
      }
    },
  });
};

  const handleAdd = useCallback(() => {
    setEditingUser(null);
    setIsModalVisible(true);
  }, []);

  const handleEdit = useCallback((user) => {
    setEditingUser(user);
    setIsModalVisible(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
    setEditingUser(null);
  }, []);

  const handleSearch = async (formValues) => {
  const newFilters = {
    search: formValues.search || '',
    deleted: formValues.deleted || 'all',
    username: formValues.username || '',
    email: formValues.email || ''
  };
  setFilters(newFilters);
  await loadUsers(false, newFilters, { current: 1, pageSize: pagination.pageSize, total: 0 });
};

  const handleFilterChange = async (filterType, value) => {
  const newFilters = { ...filters, [filterType]: value };
  setFilters(newFilters);
  if (filterType === 'deleted') {
    await loadUsers(false, newFilters, { current: 1, pageSize: pagination.pageSize, total: 0 });
  }
};



  const handleTableChange = async (antPagination) => {
  const newPagination = {
    current: antPagination.current,
    pageSize: antPagination.pageSize,
    total: pagination.total,
  };
  await loadUsers(false, filters, newPagination);
};

   // Set title và icon cho trang
  // initial load
useEffect(() => {
  dispatch(setLayoutData({ title: "Quản lý người dùng", icon: <FaUser /> }));
  loadUsers(true, {
    search: '',
    deleted: 'all',
    username: '',
    email: ''
  }, { current: 1, pageSize: 10, total: 0 });
}, [dispatch]);

// debounce text filters
useEffect(() => {
  const timeoutId = setTimeout(() => {
    const resetPagination = { current: 1, pageSize: pagination.pageSize, total: 0 };
    loadUsers(false, filters, resetPagination);
  }, 500);
  return () => clearTimeout(timeoutId);
}, [filters.search, filters.username, filters.email]); 


  const items = ROLE_TYPES.filter((role) =>( isCanManageUser && role === "USER") || 
  (isCanManageRecruiter && role === "RECRUITER" )|| (isCanManageAdmin && role === "ADMIN")).map((role, index) => ({
    key: role,
    label:
      role === "USER"
        ? "Khách hàng"
        : role === "STAFF"
          ? "Nhân viên"
          : "Quản lý",
    children: (
      <TableUser
        handleEdit={handleEdit}
        handleAdd={handleAdd}
        loading={loading}
        handleStatusChange={handleStatusChange}
        pagination={paginationByRole[role]}
        onTableChange={handleTableChange}
      />
    ),
  }));


    return (
    <>
      <div className="manage-user-container">
        <div className="users-content" style={{ marginTop: "20px" }}>
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Form
                form={form}
                layout="inline"
                name="searchForm"
                onFinish={handleSearch}
                initialValues={filters}
              >

                <Form.Item name="search" style={{ minWidth: 200 }}>
                  <Input
                    placeholder="Tìm kiếm chung..."
                    allowClear
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </Form.Item>

                <Form.Item name="username" style={{ minWidth: 150 }}>
                  <Input
                    placeholder="Tên đăng nhập..."
                    allowClear
                    value={filters.username}
                    onChange={(e) => handleFilterChange('username', e.target.value)}
                  />
                </Form.Item>

                <Form.Item name="email" style={{ minWidth: 150 }}>
                  <Input
                    placeholder="Email..."
                    allowClear
                    value={filters.email}
                    onChange={(e) => handleFilterChange('email', e.target.value)}
                  />
                </Form.Item>

                <Form.Item name="deleted" style={{ minWidth: 120 }}>
                  <Select
                    placeholder="Trạng thái"
                    value={filters.deleted}
                    onChange={(value) => handleFilterChange('deleted', value)}
                    defaultValue="0"
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
                style={{
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                }}
                onClick={() => handleAdd()}
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
                handleEdit={handleEdit}
                handleAdd={handleAdd}
                dataSource={users}
                loading={loading}
                handleStatusChange={handleStatusChange}
                pagination={pagination}
                onTableChange={handleTableChange}
              />
            )}
          </div>


          <ModalFormUser
            isCanManageUser={isCanManageUser}
            isCanManageRecruiter={isCanManageRecruiter}
            isCanManageAdmin={isCanManageAdmin}
            onSubmit={handleCreateOrUpdateUser}
            visible={isModalVisible}
            onCancel={handleModalCancel}
            editingUser={editingUser}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}

export default UserManagement