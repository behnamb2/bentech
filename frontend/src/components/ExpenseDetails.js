import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ExpenseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await fetch(`/api/expenses/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch expense details');
        }
        const data = await response.json();
        setExpense(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      navigate('/expenses');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error: {error}
        </Alert>
      </Container>
    );
  }

  if (!expense) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Expense not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/expenses')}
            color="inherit"
          >
            Back to Expenses
          </Button>
          <Box>
            <Button
              startIcon={<EditIcon />}
              variant="contained"
              color="primary"
              onClick={() => navigate(`/expenses/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="contained"
              color="error"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          Expense Details
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Description
          </Typography>
          <Typography variant="h6" gutterBottom>
            {expense.description}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
            Amount
          </Typography>
          <Typography variant="h6" gutterBottom>
            ${expense.amount.toFixed(2)}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
            Category
          </Typography>
          <Typography variant="h6" gutterBottom>
            {expense.category}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
            Date
          </Typography>
          <Typography variant="h6" gutterBottom>
            {new Date(expense.date).toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default ExpenseDetails; 