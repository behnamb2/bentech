import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <AccountBalanceWalletIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Expense Manager
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<AccountBalanceWalletIcon />}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/add"
            startIcon={<AddIcon />}
          >
            Add Expense
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/expenses"
            startIcon={<ListIcon />}
          >
            All Expenses
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 