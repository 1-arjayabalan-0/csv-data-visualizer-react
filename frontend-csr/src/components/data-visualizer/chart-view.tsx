import CardHeader from "../common/card-header";
import { Box, CircularProgress, Typography, Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useState, useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface ChartViewProps {
  data: any[];
  headers: string[];
  loading: boolean;
  error: string | null;
}

const ChartView = ({ data, headers, loading, error }: ChartViewProps) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [labelColumn, setLabelColumn] = useState<string>('');

  // Get numeric columns for chart visualization
  const numericColumns = useMemo(() => {
    if (!data.length || !headers.length) return [];
    
    return headers.filter(header => {
      const sampleValues = data.slice(0, 10).map(row => row[header]);
      return sampleValues.some(value => {
        const num = parseFloat(value);
        return !isNaN(num) && isFinite(num);
      });
    });
  }, [data, headers]);

  // Get non-numeric columns for labels
  const labelColumns = useMemo(() => {
    if (!data.length || !headers.length) return [];
    
    return ['auto', ...headers.filter(header => {
      const sampleValues = data.slice(0, 10).map(row => row[header]);
      return sampleValues.some(value => {
        const num = parseFloat(value);
        return isNaN(num) || !isFinite(num);
      });
    })];
  }, [data, headers]);

  // Set default selected columns
  useMemo(() => {
    if (numericColumns.length > 0 && !selectedColumn) {
      setSelectedColumn(numericColumns[0]);
    }
    if (labelColumns.length > 0 && !labelColumn) {
      setLabelColumn('auto');
    }
  }, [numericColumns, selectedColumn, labelColumns, labelColumn]);

  // Generate chart data
  const chartData = useMemo(() => {
    if (!data.length || !selectedColumn) return null;

    const colors = [
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 99, 132, 0.8)',
      'rgba(255, 205, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(199, 199, 199, 0.8)',
      'rgba(83, 102, 255, 0.8)',
      'rgba(255, 99, 255, 0.8)',
      'rgba(99, 255, 132, 0.8)'
    ];

    if (chartType === 'pie') {
      // For pie chart, group by values and count occurrences
      const valueCount: { [key: string]: number } = {};
      data.forEach(row => {
        const value = row[selectedColumn];
        if (value !== undefined && value !== null && value !== '') {
          const key = String(value);
          valueCount[key] = (valueCount[key] || 0) + 1;
        }
      });

      const labels = Object.keys(valueCount).slice(0, 10); // Limit to 10 slices
      const values = labels.map(label => valueCount[label]);

      return {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
          borderWidth: 2
        }]
      };
    } else {
        // For bar and line charts
        const chartData = data.slice(0, 20);
        
        // Determine which column to use for x-axis labels
        let actualLabelColumn = null;
        if (labelColumn === 'auto') {
          // Find a suitable column for x-axis labels (preferably first non-numeric column)
          actualLabelColumn = headers.find(header => {
            const sampleValues = data.slice(0, 5).map(row => row[header]);
            return sampleValues.some(value => {
              const num = parseFloat(value);
              return isNaN(num) || !isFinite(num);
            });
          });
        } else if (labelColumn && labelColumn !== 'auto') {
          actualLabelColumn = labelColumn;
        }

        const labels = chartData.map((row, index) => {
          if (actualLabelColumn && row[actualLabelColumn] !== undefined && row[actualLabelColumn] !== null && row[actualLabelColumn] !== '') {
            return String(row[actualLabelColumn]).substring(0, 15); // Truncate long labels
          }
          return `Row ${index + 1}`;
        });
        
        const values = chartData.map(row => {
          const value = parseFloat(row[selectedColumn]);
          return isNaN(value) ? 0 : value;
        });

        return {
          labels,
          datasets: [{
            label: selectedColumn,
            data: values,
            backgroundColor: chartType === 'bar' ? colors[0] : 'transparent',
            borderColor: colors[0].replace('0.8', '1'),
            borderWidth: 2,
            fill: chartType === 'line' ? false : true,
            tension: chartType === 'line' ? 0.4 : 0
          }]
        };
      }
  }, [data, selectedColumn, chartType, labelColumn]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${selectedColumn}`,
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: chartType !== 'pie' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    } : undefined
  };

  const handleChartTypeChange = (event: SelectChangeEvent) => {
    setChartType(event.target.value as 'bar' | 'line' | 'pie');
  };

  const handleColumnChange = (event: SelectChangeEvent) => {
    setSelectedColumn(event.target.value);
  };

  const handleLabelColumnChange = (event: SelectChangeEvent) => {
    setLabelColumn(event.target.value);
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
        <CircularProgress size={50} />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  if (!data.length || !headers.length) {
    return (
      <Paper sx={{ p: 3, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
        <Typography>No data available for visualization</Typography>
      </Paper>
    );
  }

  if (numericColumns.length === 0) {
    return (
      <>
        <CardHeader
          mainTxt={"Data Visualization"}
          subTxt={`Visual representation of your CSV data`}
        />
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Chart Visualization
            </Typography>
            <Typography color="warning.main" sx={{ textAlign: 'center', py: 4 }}>
              No numeric columns found in your data. Charts require at least one numeric column for visualization.
            </Typography>
          </Box>
        </Paper>
      </>
    );
  }

  return (
    <>
      <CardHeader
        mainTxt={"Data Visualization"}
        subTxt={`Interactive charts for your CSV data (${data.length} rows, ${headers.length} columns)`}
      />
      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Chart Visualization
          </Typography>
          
          {/* Chart Controls */}
           <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
             <FormControl size="small" sx={{ minWidth: 120 }}>
               <InputLabel>Chart Type</InputLabel>
               <Select
                 value={chartType}
                 label="Chart Type"
                 onChange={handleChartTypeChange}
               >
                 <MenuItem value="bar">Bar Chart</MenuItem>
                 <MenuItem value="line">Line Chart</MenuItem>
                 <MenuItem value="pie">Pie Chart</MenuItem>
               </Select>
             </FormControl>
             
             <FormControl size="small" sx={{ minWidth: 150 }}>
               <InputLabel>Data Column</InputLabel>
               <Select
                 value={selectedColumn}
                 label="Data Column"
                 onChange={handleColumnChange}
               >
                 {numericColumns.map((column) => (
                   <MenuItem key={column} value={column}>
                     {column}
                   </MenuItem>
                 ))}
               </Select>
             </FormControl>

             {chartType !== 'pie' && (
               <FormControl size="small" sx={{ minWidth: 150 }}>
                 <InputLabel>X-Axis Labels</InputLabel>
                 <Select
                   value={labelColumn}
                   label="X-Axis Labels"
                   onChange={handleLabelColumnChange}
                 >
                   <MenuItem value="auto">Auto-detect</MenuItem>
                   {labelColumns.slice(1).map((column) => (
                     <MenuItem key={column} value={column}>
                       {column}
                     </MenuItem>
                   ))}
                 </Select>
               </FormControl>
             )}
           </Box>

          {/* Chart Container */}
          <Box 
            sx={{
              p: 2, 
              border: 1, 
              borderColor: 'divider', 
              borderRadius: 2, 
              bgcolor: 'grey.50',
              height: 400,
              position: 'relative'
            }}
          >
            {chartData && (
              <>
                {chartType === 'bar' && <Bar data={chartData} options={chartOptions} />}
                {chartType === 'line' && <Line data={chartData} options={chartOptions} />}
                {chartType === 'pie' && <Pie data={chartData} options={chartOptions} />}
              </>
            )}
          </Box>
          
          {/* Chart Info */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" color="info.contrastText">
              <strong>Tip:</strong> {chartType === 'pie' 
                ? 'Pie chart shows the distribution of values in the selected column.' 
                : `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} chart displays the first 20 rows of numeric data.`
              }
            </Typography>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default ChartView;