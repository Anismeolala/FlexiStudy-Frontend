import { Card, Input, Table,Skeleton, message, Avatar, Tooltip, Space, Button, Popconfirm } from 'antd';
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { FaSubway } from 'react-icons/fa';
import CompanyModal from './CompanyModal';
import { setLayoutData } from '../../redux/layoutSlice';
import { deleteCompanyAPI, getAllCompaniesAPI } from '../../apis';
import './CompanyManagement.css';

const CompanyManagement = () => {
  const dispatch = useDispatch();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchText, setSearchText] = useState('');
    // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} công ty`,
  });
  
    // Load  from API with pagination
  const loadCompanies = async (isInitial = false, page = 1, pageSize = 10, searchQuery = '') => {
  try {
    if (isInitial) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }

    const response = await getAllCompaniesAPI({
      page,
      size: pageSize,
      search: searchQuery,
    });

    if (response.code === 1000) {
      const { data, currentPage, pageSize: returnedPageSize, totalElements } = response.result;

      const transformed = data.map((company) => ({
        id: company.id,
        name: company.name || "Chưa có tên",
        website: company.website || "N/A",
        memberCount: company.memberNumber ?? "N/A", 
        logoUrl: company.logoUrl || null,
        createdAt: company.createdAt
          ? new Date(company.createdAt).toLocaleDateString("vi-VN")
          : "-",
        updatedAt: company.updatedAt
          ? new Date(company.updatedAt).toLocaleDateString("vi-VN")
          : "-",
      }));

      setCompanies(transformed);
      setFilteredCompanies(transformed);

      setPagination((prev) => ({
        ...prev,
        current: currentPage,
        pageSize: returnedPageSize,
        total: totalElements,
      }));
    } else {
      throw new Error("API response error");
    }
  } catch (error) {
    console.error("Error loading companies:", error);
    message.error("Không thể tải danh sách công ty");
  } finally {
    if (isInitial) {
      setInitialLoading(false);
    } else {
      setLoading(false);
    }
  }
};
    useEffect(() => {
        dispatch(setLayoutData({
        title: "Quản lý công ty",
        icon: <FaSubway />,
        }));
        
        // Load data from API
        loadCompanies(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    // Handle search with debounce effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadCompanies(false, 1, pagination.pageSize, searchText);
        }, 500);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [searchText]);


  const handleAdd = () => {
    setEditingCompany(null);
    setIsModalVisible(true);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteCompanyAPI(id);
      
      // Calculate if we should go to previous page after deletion
      const remainingItems = pagination.total - 1;
      const totalPages = Math.ceil(remainingItems / pagination.pageSize);
      const currentPage = pagination.current > totalPages && totalPages > 0 ? totalPages : pagination.current;
      
      // Reload data
      await loadCompanies(false, currentPage, pagination.pageSize, searchText);
      message.success('Xóa công ty thành công');
    } catch (error) {
      console.error('Error deleting company:', error);
      message.error('Xóa công ty thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleModalSuccess = async () => {
    setIsModalVisible(false);
    setEditingCompany(null);
    
    // Reload  after success
    if (editingCompany) {
      // For edit, stay on current page
      await loadCompanies(false, pagination.current, pagination.pageSize, searchText);
    } else {
      // For create, go to first page
      await loadCompanies(false, 1, pagination.pageSize, searchText);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingCompany(null);
  };

  const handleRefresh = async () => {
    try {
      await loadCompanies(false, pagination.current, pagination.pageSize, searchText);
      message.success('Dữ liệu đã được làm mới');
    } catch (error) {
      message.error('Làm mới dữ liệu thất bại');
    }
  };

  // Handle pagination change
  const handleTableChange = (paginationConfig) => {
    const { current, pageSize } = paginationConfig;
    loadCompanies(false, current, pageSize, searchText);
  };

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logoUrl',
      key: 'image',
      width: 100,
      render: (url) => (
        <Avatar shape="square" size={48} src={url} icon={<FaSubway />} />
      )
    },
    {
      title: 'Tên công ty',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
        </div>
      )
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      render: (website) => (
        <Tooltip placement="topLeft" title={website}>
          {website}
        </Tooltip>
      )
    },
    {
      title: 'Số lượng thành viên',
      dataIndex: 'memberCount',
      key: 'memberCount',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (memberCount) => (
        <Tooltip placement="topLeft" title={memberCount}>
          {memberCount}
        </Tooltip>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => (
        <span style={{ fontSize: '12px' }}>{date}</span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa công ty này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="company-management">
      {/* Main Content */}
      <Card className="main-card">
        {/* Header Actions */}
        <div className="header-actions">
          <div className="filters">
            <Input
              placeholder="Tìm kiếm công ty..."
              allowClear
              style={{ width: 300 }}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />

          </div>
          <div className="actions">
            <PrimaryButton
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              type="button"
            >
              Làm mới
            </PrimaryButton>
            <PrimaryButton
              icon={<PlusOutlined />}
              onClick={handleAdd}
              type="button"
            >
              Thêm công ty
            </PrimaryButton>
          </div>
        </div>

        {/* Table */}
        {initialLoading ? (
          <div style={{ padding: '24px' }}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={companies}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
            />
        )}
      </Card>

      {/* company Modal */}
      <CompanyModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSuccess={handleModalSuccess}
        editingCompany={editingCompany}
        loading={loading}
        />
    </div>
  )
}

export default CompanyManagement;