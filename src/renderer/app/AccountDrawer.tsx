import React, { useCallback } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  ListItemIcon,
  MenuItem,
  MenuList,
  Toolbar,
  Typography,
} from '@mui/material';
import { CloseOutlined, LogoutOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { User } from '../../github/user';
import { useDrawerOptions } from '../routing/accountDrawerOptions';
import { MenuOption } from '../../models/menus/menuOption';

export interface AccountDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const AccountDrawer: React.FC<AccountDrawerProps> = ({
  open,
  onClose,
  user,
}) => {
  const navigate = useNavigate();

  const { accountOptions, footerOptions } = useDrawerOptions();

  const handleLogOut = useCallback(() => {
    window.electron.ipcRenderer.logout();
  }, []);

  const handleOptionClick = useCallback(
    (option: MenuOption) => () => {
      if (option.external) {
        window.open(option.destination, '_blank');
        return;
      }

      navigate(option.destination);
    },
    [navigate],
  );

  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <Toolbar>
        <Avatar sx={{ width: 32, height: 32 }}>
          <img src={user?.avatar_url} height="100%" alt="Profile Avatar" />
        </Avatar>
        <Box marginLeft={1} marginRight={2}>
          <Typography variant="body1" color="textPrimary" fontWeight="bold">
            {user?.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user?.login}
          </Typography>
        </Box>
        <Button variant="text" onClick={handleLogOut}>
          <LogoutOutlined />
        </Button>
        <Button variant="text" onClick={onClose}>
          <CloseOutlined />
        </Button>
      </Toolbar>
      <Divider />
      <MenuList sx={{ flexGrow: 1 }}>
        {accountOptions.map((option) => (
          <MenuItem key={option.label} onClick={handleOptionClick(option)}>
            <ListItemIcon>
              <option.icon />
            </ListItemIcon>
            <Typography variant="body2" color="textPrimary">
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <MenuList>
        {footerOptions.map((option) => (
          <MenuItem key={option.label} onClick={handleOptionClick(option)}>
            <ListItemIcon>
              <option.icon />
            </ListItemIcon>
            <Typography variant="body2" color="textPrimary">
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </MenuList>
    </Drawer>
  );
};
export { AccountDrawer };
