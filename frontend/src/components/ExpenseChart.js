import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ExpenseChart = ({ data }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography variant="body1" color="textSecondary">
                    No data available
                </Typography>
            </Box>
        );
    }

    const chartData = {
        labels: data.map(item => item.month),
        datasets: [{
            label: 'Monthly Expenses',
            data: data.map(item => item.total),
            backgroundColor: '#2196f3',
            borderColor: '#1976d2',
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: value => `$${value.toLocaleString()}`
                }
            }
        }
    };

    return (
        <Box height="300px">
            <Bar data={chartData} options={options} />
        </Box>
    );
};

export default ExpenseChart; 