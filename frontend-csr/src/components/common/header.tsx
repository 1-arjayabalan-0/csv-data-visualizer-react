import { AppBar, Toolbar, Typography, Box, Button, Avatar } from '@mui/material';
import { LogoutIcon } from '../../assets/icons/logout-icon';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return user?.email || 'User';
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight="bold">
          CSV Data Analyzer
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {getInitials(user?.firstName, user?.lastName)}
          </Avatar>
          <Typography>{getDisplayName()}</Typography>
          <Button 
            variant="text" 
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon size="size-6" />}
            sx={{ 
              textTransform: 'none',
              '& .size-4': {
                width: '16px',
                height: '16px'
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
