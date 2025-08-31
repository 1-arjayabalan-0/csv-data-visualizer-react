import HeaderTabBtn from "./header-tab-btn";
import { useTabContext } from "../../context/TabContext";
import { Paper, Box } from "@mui/material";

const HeadTabs = () => {
  const { activeTab, setActiveTab, hasData } = useTabContext();

  const handleTabClick = (tabType: 'upload' | 'table' | 'chart') => {
    // Tab switching is now handled by the context's setActiveTab function
    // which already includes validation for data availability
    setActiveTab(tabType);
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        borderRadius: 4, 
        width: '100%', 
        height: 48, 
        bgcolor: 'grey.100', 
        border: '1px solid',
        borderColor: 'grey.300',
        p: 0.75, 
        display: 'flex', 
        gap: 0.5,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      <Box 
        onClick={() => handleTabClick('upload')} 
        sx={{ 
          cursor: 'pointer', 
          flex: 1 
        }}
      >
        <HeaderTabBtn
          btnType={"upload"}
          btnSize={"size-6"}
          btnTxt={"Upload CSV"}
          btnActive={activeTab === 'upload'}
        />
      </Box>
      <Box 
        onClick={() => handleTabClick('table')} 
        sx={{ 
          cursor: hasData ? 'pointer' : 'not-allowed', 
          opacity: hasData ? 1 : 0.5, 
          flex: 1 
        }}
      >
        <HeaderTabBtn
          btnType={"table"}
          btnSize={"size-6"}
          btnTxt={"Data Table"}
          btnActive={activeTab === 'table'}
        />
      </Box>
      <Box 
        onClick={() => handleTabClick('chart')} 
        sx={{ 
          cursor: hasData ? 'pointer' : 'not-allowed', 
          opacity: hasData ? 1 : 0.5, 
          flex: 1 
        }}
      >
        <HeaderTabBtn
          btnType={"chart"}
          btnSize={"size-6"}
          btnTxt={"Charts"}
          btnActive={activeTab === 'chart'}
        />
      </Box>
    </Paper>
  );
};
export default HeadTabs;
