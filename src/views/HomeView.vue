<template>
    <div>
        <h1>Welcome {{ usuario }}</h1>
        <p>Current Balance: {{ currentBalance }} €</p>

        <div v-if="usuarioType === 'A'">
            <p>Hello, Admin!</p>
            <label>
                Transaction Type:
                <input type="radio" v-model="selectedTransactionType" value="D" name="transactionType"
                    @change="updateAdminGraphs"> Debit
                <input type="radio" v-model="selectedTransactionType" value="C" name="transactionType"
                    @change="updateAdminGraphs"> Credit
            </label>
            <div class="chart-container">
                <canvas ref="transactionCountChart"></canvas>
            </div>
            <div class="chart-container">
                <canvas ref="totalTransactionValueChart"></canvas>
            </div>
        </div>
        <div v-else class="charts-container">
            <div class="chart-container">
                <button @click="toggleFilters">Filter Options</button>
                <div v-if="showFilters" class="filter-options">
                    <label>
                        Select Year:
                        <select v-model="selectedYearFilter" @change="updateDoughnutChart">
                            <option value="None">None</option>
                            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                        </select>
                    </label>
                    <label v-if="selectedYearFilter !== 'None'">
                        Show Categories:
                        <select v-model="showCategoriesOption" @change="updateDoughnutChart">
                            <option value="all">All Categories</option>
                            <option value="5">Top 5 Categories</option>
                            <option value="10">Top 10 Categories</option>
                        </select>
                    </label>
                    <label v-if="selectedYearFilter === 'None'">
                        Show Categories:
                        <select v-model="showCategoriesOptionDate" @change="fetchDoughnutChartDataByDate">
                            <option value="all">All Categories</option>
                            <option value="5">Top 5 Categories</option>
                            <option value="10">Top 10 Categories</option>
                        </select>
                    </label>
                    <br>
                    <label>
                        Transaction Type:
                        <input type="radio" v-model="selectedTransactionType" value="D" name="transactionType"
                            @change="updateDoughnutChart"> Debit
                        <input type="radio" v-model="selectedTransactionType" value="C" name="transactionType"
                            @change="updateDoughnutChart"> Credit
                    </label>
                    <br>
                    <label v-if="selectedYearFilter == 'None'">
                        Select Start Date:
                        <DatePicker v-model="startDate" @change="fetchDoughnutChartDataByDate" :format="formatDate"
                            placeholder="Select start date" style="color: white;"></DatePicker>
                    </label>
                    <label v-if="selectedYearFilter == 'None'">
                        Select End Date:
                        <DatePicker v-model="endDate" @change="fetchDoughnutChartDataByDate" :format="formatDate"
                            placeholder="Select end date" style="color: white;"></DatePicker>
                    </label>
                    <label v-if="selectedYearFilter !== 'None'">
                        Select Month:
                        <select v-model="selectedMonth" @change="updateDoughnutChart">
                            <option value="all">All Months</option>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </label>
                </div>
                <canvas ref="topCategoriesChart"></canvas>
            </div>

            <div class="chart-container">
                Filter Options
                <canvas ref="transactionTypesChart"></canvas>
            </div>

            <div class="chart-container">
                Select the year:
                <select v-model="selectedYear" @change="updateLineChart">
                    <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                </select>
                <canvas ref="lineChart"></canvas>
            </div>
        </div>
    </div>
</template>
<script setup>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import DatePicker from 'vue3-datepicker';
import { Chart, DoughnutController, BarController, LineController, CategoryScale } from 'chart.js/auto';

Chart.register(DoughnutController, BarController, LineController, CategoryScale);

const usuario = ref(null);
const usuarioType = ref(null);
const currentBalance = ref(null);
const topCategoriesChart = ref(null);
const transactionTypesChart = ref(null);
const lineChart = ref({ value: null });
const showFilters = ref(false);
const availableYears = ref([]);
const selectedYear = ref(new Date().getFullYear());
const selectedYearFilter = ref(new Date().getFullYear());
const selectedMonth = ref('all');
const showCategoriesOption = ref('all');
const showCategoriesOptionDate = ref('all');
const startDate = ref(null);
const endDate = ref(null);
const formatDate = 'yyyy-MM-dd';
const selectedTransactionType = ref('debit');
const totalAmountChart = ref(null);
const transactionCountChart = ref(null);
const totalTransactionValueChart = ref({ value: null });











onMounted(async () => {
    try {
        const userResponse = await axios.get('/users/me', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        usuario.value = userResponse.data.usuario.name;
        usuarioType.value = userResponse.data.usuario.user_type;
        if (usuarioType.value != 'A') {
            const balanceResponse = await axios.get('/get-balance', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            currentBalance.value = balanceResponse.data.currentBalance;

            const topCategoriesResponse = await axios.get('/top-categories', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const topCategoriesData = topCategoriesResponse.data.topCategories;

            drawTopCategoriesChart(topCategoriesData);

            const transactionTypesCountResponse = await axios.get('/transaction-types-count', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const transactionTypesCountData = transactionTypesCountResponse.data.transactionTypesCount;

            drawTransactionTypesChart(transactionTypesCountData);

            const availableYearsResponse = await axios.get('/available-years', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            availableYears.value = availableYearsResponse.data.availableYears;

            await updateLineChart();
        } else {
            // Call the route for transaction count
            const transactionCountResponse = await axios.get('/transaction-count', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const transactionCountData = transactionCountResponse.data.transactionCount;

            // Draw the graph for transaction count
            drawTransactionCountGraph(transactionCountData);

            const totalTransactionValueResponse = await axios.get('/all-transactions-value', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const totalTransactionValueData = totalTransactionValueResponse.data.transactionCount;

            // Draw the graph for total transaction value
            drawTotalTransactionValueGraph(totalTransactionValueData);
        
            

        }
    } catch (error) {
        console.error('Failed to fetch user information, current balance, top spending categories, or transaction types count:', error);
    }
});


const toggleFilters = () => {
    showFilters.value = !showFilters.value;
};


const updateLineChart = async () => {
    try {
        // Destroy existing line chart
        if (lineChart.value.value) {
            lineChart.value.value.destroy();
        }

        // Fetch transactions for the selected year
        const yearTransactionsResponse = await axios.get(`/year-transactions?year=${selectedYear.value}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const yearTransactionsData = yearTransactionsResponse.data.yearTransactions;

        // Draw line chart for amounts spent and earned over the year
        drawLineChart(yearTransactionsData);
    } catch (error) {
        console.error('Failed to update line chart:', error);
    }
};

const updateDoughnutChart = async () => {
    try {
        console.log(topCategoriesChart.value.value)
        if (topCategoriesChart.value.value) {
            topCategoriesChart.value.value.destroy();
            console.log("destrui com sucesso");
        }

        if (selectedYearFilter.value == 'None') {
            fetchDoughnutChartDataByDate();
        }
        // Fetch data for the Doughnut chart based on filter options
        const doughnutChartDataResponse = await axios.get('/doughnut-chart-data', {
            params: {
                year: selectedYearFilter.value,
                type: selectedTransactionType.value,
                showCategoriesOption: showCategoriesOption.value,
                month: selectedMonth.value,
                startDate: startDate.value,
                endDate: endDate.value,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        // Update the Doughnut chart with the new data
        drawTopCategoriesChart(doughnutChartDataResponse.data.doughnutChartData);
    } catch (error) {
        console.error('Failed to update Doughnut chart:', error);
    }
};

const fetchDoughnutChartDataByDate = async () => {
    try {
        if (topCategoriesChart.value.value) {
            topCategoriesChart.value.value.destroy();
        }
        // Fetch data for the Doughnut chart based on filter options
        const doughnutChartDataResponseByDate = await axios.get('/doughnut-chart-data-by-date', {
            params: {
                showCategoriesOption: showCategoriesOptionDate.value,
                type: selectedTransactionType.value,
                startDate: startDate.value,
                endDate: endDate.value,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        // Update the Doughnut chart with the new data
        drawTopCategoriesChart(doughnutChartDataResponseByDate.data.doughnutChartData);
    } catch (error) {
        console.error('Failed to update Doughnut chart:', error);
    }
};


watch([selectedYearFilter, showCategoriesOption, selectedMonth, startDate, endDate, selectedTransactionType], updateDoughnutChart, fetchDoughnutChartDataByDate);


watch(selectedYear, updateLineChart);

// Function to draw the doughnut chart for top spending categories
const drawTopCategoriesChart = (data) => {
    const ctx = topCategoriesChart.value.getContext('2d');

    topCategoriesChart.value.value = new Chart(ctx, {
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
        options: {
            plugins: {
                legend: {
                    display: false, // Hide the legend
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.formattedValue || '';
                            return `${label}: ${value} €`;
                        },
                    },
                },
            },
        },
    });
};


const drawLineChart = (data) => {
    const ctx = lineChart.value.getContext('2d');

    lineChart.value.value = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(entry => entry.month),
            datasets: [
                {
                    label: 'Amount Spent',
                    data: data.map(entry => entry.amountSpent),
                    borderColor: 'rgba(255, 99, 132, 0.8)',
                    fill: false,
                },
                {
                    label: 'Amount Earned',
                    data: data.map(entry => entry.amountEarned),
                    borderColor: 'rgba(54, 162, 235, 0.8)',
                    fill: false,
                },
            ],
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    labels: data.map(entry => entry.month),
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (€)',
                    },
                },
            },
        },
    });
};

// Function to draw the bar chart for transaction types count
const drawTransactionTypesChart = (data) => {
    const ctx = transactionTypesChart.value.getContext('2d');

    new Chart(ctx, {
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

const updateAdminGraphs = async () => {

};

const drawTransactionCountGraph = (transactionCountData) => {
    const ctx = transactionCountChart.value.getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: transactionCountData.map(item => item.payment_type),
            datasets: [{
                label: 'Transaction Count',
                data: transactionCountData.map(item => item.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    // Add more colors as needed
                ],
            }],
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Transaction Count',
                    },
                },
            },
        },
    });
};

const drawTotalTransactionValueGraph = (totalTransactionValueData) => {
    const ctx = totalTransactionValueChart.value.getContext('2d');

    // Check if totalTransactionValueData is defined and is an array
    if (totalTransactionValueData && Array.isArray(totalTransactionValueData)) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: totalTransactionValueData.map(item => item.payment_type),
                datasets: [{
                    data: totalTransactionValueData.map(item => item.count),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                        // Add more colors as needed
                    ],
                }],
            },
        });
    } else {
        console.error('totalTransactionValueData is undefined or not an array');
    }
};





</script>

<style scoped>
.charts-container {
    display: flex;
}

.chart-container {
    width: 500px;
    height: 500px;
    margin-right: 20px;
}

select {
    font-size: 16px;
    /* Adjust font size as needed */
    border: 1px solid white;
    /* Add a white border */
    border-radius: 5px;
    /* Add border-radius for rounded corners */
    color: white;
    /* Set the text color for selected options */
}

option {
    color: black;
    /* Set the text color for options */
}
</style>
