import Header from "../../components/common/header";
import HeadTabs from "../../components/common/header-tabs";
import DataTable from "../../components/data-visualizer/datatable";
import { UploadForm } from "../../components/data-visualizer/upload-form";
import ChartView from "../../components/data-visualizer/chart-view";
import { useState, useEffect } from "react";
import axios from "axios";
import { csvApi } from "../../services/api";
import { useTabContext } from "../../context/TabContext";
import { Box, Container } from "@mui/material";
import { useRef } from "react";

interface CSVData {
  id: string;
  headers: string[];
  data: any[];
}

const DataAnalyser = () => {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [loading, setLoading] = useState(false); // Start with false to avoid SSR mismatch
  const [error, setError] = useState<string | null>(null);
  const { activeTab, setHasData, hasData } = useTabContext();
  const isMounted = useRef(false);

  // Function to fetch latest CSV data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await csvApi.getLatestCsvData();
      if (isMounted.current) {
        setCsvData(response.data.data);
        // If we have data, update the context
        if (response.data.data) {
          setHasData(true);
        }
      }
    } catch (err) {
      if (isMounted.current) {
        console.error('Error fetching CSV data:', err);
        setError('Failed to fetch CSV data');
        setCsvData(null);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Skip data fetching during SSR
    if (typeof window === 'undefined') return;
    
    // Set isMounted to true to indicate client-side rendering
    isMounted.current = true;
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Refetch data when switching to table or chart tabs (indicating new upload)
  useEffect(() => {
    if ((activeTab === 'table' || activeTab === 'chart') && hasData) {
      fetchData();
    }
  }, [activeTab, hasData]);

  // Render components based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadForm />;
      case 'table':
        return <DataTable data={csvData?.data || []} headers={csvData?.headers || []} loading={loading} error={error} />;
      case 'chart':
        return <ChartView data={csvData?.data || []} headers={csvData?.headers || []} loading={loading} error={error} />;
      default:
        return <UploadForm />;
    }
  };

  return (
    <Box>
      <Header />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <HeadTabs />
        {renderContent()}
      </Box>
    </Box>
  );
};
export default DataAnalyser;
