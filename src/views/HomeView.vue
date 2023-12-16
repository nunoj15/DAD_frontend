<template>
    <div>
      <h1>Welcome {{ usuario }}</h1>
      <p>Current Balance: {{ currentBalance }} €</p>
  
      <!-- Doughnut Chart to show top spending categories -->
      <canvas ref="topCategoriesChart" width="200" height="200"></canvas>
  
      <!-- Bar Chart to show transaction types count -->
      <canvas ref="transactionTypesChart" width="400" height="200"></canvas>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { Chart, DoughnutController, BarController, CategoryScale } from 'chart.js/auto';
  
  Chart.register(DoughnutController, BarController, CategoryScale);
  
  const usuario = ref(null);
  const currentBalance = ref(null);
  const topCategoriesChart = ref(null);
  const transactionTypesChart = ref(null);
  
  onMounted(async () => {
    try {
      // Fetch user information
      const userResponse = await axios.get('/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      usuario.value = userResponse.data.usuario.name;
  
      // Fetch current balance
      const balanceResponse = await axios.get('/get-balance', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      currentBalance.value = balanceResponse.data.currentBalance;
  
      // Fetch top spending categories
      const topCategoriesResponse = await axios.get('/top-categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const topCategoriesData = topCategoriesResponse.data.topCategories;
  
      // Draw doughnut chart for top spending categories
      drawTopCategoriesChart(topCategoriesData);
  
      // Fetch transaction types count
      const transactionTypesCountResponse = await axios.get('/transaction-types-count', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const transactionTypesCountData = transactionTypesCountResponse.data.transactionTypesCount;
  
      // Draw bar chart for transaction types count
      drawTransactionTypesChart(transactionTypesCountData);
    } catch (error) {
      console.error('Failed to fetch user information, current balance, top spending categories, or transaction types count:', error);
    }
  });
  
  // Function to draw the doughnut chart for top spending categories
  const drawTopCategoriesChart = (data) => {
    const ctx = topCategoriesChart.value.getContext('2d');
  
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(category => category.category_name),
        datasets: [{
          data: data.map(category => category.total_spent),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
        }],
      },
    });
  };
  
  // Function to draw the bar chart for transaction types count
  const drawTransactionTypesChart = (data) => {
    const ctx = transactionTypesChart.value.getContext('2d');
  
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(type => type.type),
        datasets: [{
          label: 'Transaction Types Count',
          data: data.map(type => type.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
          ],
        }],
      },
      options: {
        scales: {
          x: {
            type: 'category',
            labels: ['Debit (D)', 'Credit (C)'],
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count',
            },
          },
        },
      },
    });
  };
  </script>
  