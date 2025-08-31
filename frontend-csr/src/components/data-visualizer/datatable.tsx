import CardHeader from "../common/card-header";
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from "@mui/material";

interface DataTableProps {
  data: any[];
  headers: string[];
  loading: boolean;
  error: string | null;
}
const DataTable = ({ data, headers, loading, error }: DataTableProps) => {
  return (
    <>
      <CardHeader
        mainTxt={"Data Table"}
        subTxt={`View and analyze your CSV data in a tabular format`}
      />
      <Stack spacing={2}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <CircularProgress />
              </div>
            ) : error ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <Typography color="error">{error}</Typography>
              </div>
            ) : data.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <Typography>No data available. Please upload a CSV file first.</Typography>
              </div>
            ) : (
              <Table stickyHeader aria-label="csv data table" size="small">
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index} hover>
                      {headers.map((header) => (
                        <TableCell key={`${index}-${header}`}>{row[header]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Paper>
      </Stack>
    </>
  );
};
export default DataTable;
