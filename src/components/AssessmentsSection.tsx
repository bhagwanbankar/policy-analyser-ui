import React, { useEffect, useState } from 'react';
import AssessmentFramework from './AssessmentFramework';
import { Assessment, DocumentType } from '@/model/documentModels';
import { getAssessmentsByDocumentType } from '@/services/documentService';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import { Card } from 'antd';

const AssessmentModal: React.FC<{ documentType: DocumentType }> = ({ documentType }) => {
  const [assessmentData, setAssessmentData] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await getAssessmentsByDocumentType(documentType.id);
        setAssessmentData(data);
      } catch (err) {
        setError('Failed to fetch assessments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [documentType.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card
      className="shadow-md rounded-lg mb-8"
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          gap: "1.5rem",
        },
      }}
    >
      <div className="text-center">
        <Title level={3} style={{ margin: 0, color: "#1f2937" }}>
          Assessment Framework for {documentType.name}
        </Title>
        <Paragraph type="secondary">
          This framework outlines the key assessments for the {documentType.name} document type.
        </Paragraph>
      </div>
      {assessmentData.map((item, index) => (
        <AssessmentFramework key={index} assessment={item} index={index + 1} />
      ))}
    </Card>
  );
};

export default AssessmentModal;
