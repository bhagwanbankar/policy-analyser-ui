import {
  Table,
  Button,
  Input,
  Typography,
  Popconfirm,
  message,
  Spin,
} from 'antd';
import { useEffect, useState } from 'react';
import DocumentTypeForm from './DocumentTypeForm';
import {
  getDocumentTypes,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
} from '@/services/prompt-dashboard/documentTypeService';
import { DocumentType } from '@/model/DocumentModels';
import { removeEmptyFields } from '@/utils/helpers';

const { Title, Text } = Typography;

const DocumentTypes = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const docs = await getDocumentTypes();
      setData(docs);
    } catch (error) {
      message.error('Failed to load document types');
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setFormMode('add');
    setSelectedDoc(null);
    setModalVisible(true);
  };

  const handleRowClick = (record: DocumentType) => {
    setFormMode('edit');
    setSelectedDoc(record);
    setModalVisible(true);
  };

  const handleSubmit = async (doc: DocumentType) => {

    const cleanedDoc = removeEmptyFields(doc);
    
    try {
      if (formMode === 'add') {
        const createdDoc = await createDocumentType(cleanedDoc as DocumentType);
        setData((prev) => [...prev, createdDoc]);
        message.success('Document type created');
      } else {
        const updatedDoc = await updateDocumentType(cleanedDoc as DocumentType);
        setData((prev) =>
          prev.map((d) => (d.doc_type_id === updatedDoc.doc_type_id ? updatedDoc : d))
        );
        message.success('Document type updated');
      }
    } catch (err) {
      message.error('Operation failed');
    } finally {
      setModalVisible(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDocumentType(id);
      setData((prev) => prev.filter((doc) => doc.doc_type_id !== id));
      message.success('Document type deleted');
    } catch (err) {
      message.error('Failed to delete document type');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'doc_type_name',
      key: 'doc_type_name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
    },
    {
      title: 'Created On',
      dataIndex: 'created_on',
      key: 'created_on',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: DocumentType) => (
        <div className="flex gap-4">
          <Button
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(record);
            }}
            className="text-blue-600 px-0"
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure to delete this document type?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record.doc_type_id);
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              className="px-0"
              onClick={(e) => e.stopPropagation()}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={2}>Policy Dashboard</Title>
      <Text type="secondary" className="mb-4 block">
        Manage Document Types
      </Text>

      <div className="flex justify-between items-center mb-4">
        <Input.Search
          placeholder="Search document types..."
          className="w-1/2 mr-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="primary" onClick={showAddModal}>
          Add Document Type
        </Button>
      </div>

      {loading ? (
        <div className="text-center mt-10">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={data.filter((d) =>
            d.doc_type_name.toLowerCase().includes(search.toLowerCase())
          )}
          rowKey="doc_type_id"
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      )}

      <DocumentTypeForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        mode={formMode}
        initialData={selectedDoc ?? undefined}
      />
    </div>
  );
};

export default DocumentTypes;
