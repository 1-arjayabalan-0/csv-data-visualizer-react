import { ChartIcon } from "../../assets/icons/chart-icon";
import { TableIcon } from "../../assets/icons/table-icon";
import { UploadIcon } from "../../assets/icons/upload-icon";
import { Box, Typography } from "@mui/material";

const HeaderTabBtn = (props: any) => {
  const renderIcon = () => {
    switch (props.btnType) {
      case "upload":
        return <UploadIcon size={"size-6"} />;
      case "table":
        return <TableIcon size={"size-6"} />;
      case "chart":
        return <ChartIcon size={"size-6"} />;
      default:
        return null;
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: props.btnActive ? 'background.paper' : 'transparent',
        boxShadow: props.btnActive ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        border: props.btnActive ? '1px solid rgba(0,0,0,0.08)' : 'none',
        p: 1.5,
        height: '100%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          bgcolor: props.btnActive ? 'background.paper' : 'rgba(255,255,255,0.5)',
          transform: 'translateY(-1px)',
          boxShadow: props.btnActive ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.08)'
        }
      }}
    >
      <Box sx={{ 
        color: props.btnActive ? 'primary.main' : 'text.secondary',
        transition: 'color 0.2s ease-in-out'
      }}>
        {renderIcon()}
      </Box>
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: props.btnActive ? 600 : 500,
          color: props.btnActive ? 'primary.main' : 'text.secondary',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        {props.btnTxt}
      </Typography>
    </Box>
  );
};
export default HeaderTabBtn;