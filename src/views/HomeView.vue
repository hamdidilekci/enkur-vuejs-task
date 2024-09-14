<template>
  <div class="home-view">
    <h1>Data Overview</h1>

    <!-- Epis Data Table -->
    <section class="table-section">
      <h2>Epis Data</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Read Time</th>
            <th>MCP Value</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in episData" :key="item._id">
            <td>{{ item._id }}</td>
            <td>{{ formatDate(item.read_time) }}</td>
            <td>{{ item.mcp_value }}</td>
            <td>{{ formatDate(item.created_at) }}</td>
            <td>{{ formatDate(item.updated_at) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="changePage('epis', currentPageEpis - 1)" :disabled="currentPageEpis <= 1">Previous</button>
        <span>Page {{ currentPageEpis }} of {{ totalPagesEpis }}</span>
        <button @click="changePage('epis', currentPageEpis + 1)" :disabled="currentPageEpis >= totalPagesEpis">Next</button>
      </div>
    </section>

    <!-- Counter Log Data Table -->
    <section class="table-section">
      <h2>Counter Log Data</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Counter ID</th>
            <th>Read Time</th>
            <th>CN Value</th>
            <th>GN Value</th>
            <th>RC Value</th>
            <th>RCO Value</th>
            <th>RI Value</th>
            <th>RIO Value</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in counterData" :key="item._id">
            <td>{{ item._id }}</td>
            <td>{{ formatDate(item.read_time) }}</td>
            <td>{{ item.cn_value }}</td>
            <td>{{ item.gn_value }}</td>
            <td>{{ item.rc_value }}</td>
            <td>{{ item.rco_value }}</td>
            <td>{{ item.ri_value }}</td>
            <td>{{ item.rio_value }}</td>
            <td>{{ formatDate(item.created_at) }}</td>
            <td>{{ formatDate(item.updated_at) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="changePage('counter', currentPageCounter - 1)" :disabled="currentPageCounter <= 1">Previous</button>
        <span>Page {{ currentPageCounter }} of {{ totalPagesCounter }}</span>
        <button @click="changePage('counter', currentPageCounter + 1)" :disabled="currentPageCounter >= totalPagesCounter">Next</button>
      </div>
    </section>

    <!-- Daily Total Values Table -->
    <section class="table-section">
      <h2>Daily Total Values</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(total, date) in totalValues.dailyTotals" :key="date">
            <td>{{ date }}</td>
            <td>{{ total.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Monthly Total Values Table -->
    <section class="table-section">
      <h2>Monthly Total Values</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(total, month) in totalValues.monthlyTotals" :key="month">
            <td>{{ month }}</td>
            <td>{{ total.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  data() {
    return {
      episData: [],
      counterData: [],
      totalValues: {},
      accessToken: localStorage.getItem('accessToken'),
      currentPageEpis: 1,
      currentPageCounter: 1,
      itemsPerPage: 10,
      totalPagesEpis: 1,
      totalPagesCounter: 1,
    };
  },

  mounted() {
    this.fetchEpisData();
    this.fetchCounterData();
    this.fetchTotalValues();
  },

  computed: {
    paginatedEpisData() {
      const start = (this.currentPageEpis - 1) * this.itemsPerPage;
      return this.episData.slice(start, start + this.itemsPerPage);
    },
    paginatedCounterData() {
      const start = (this.currentPageCounter - 1) * this.itemsPerPage;
      return this.counterData.slice(start, start + this.itemsPerPage);
    }
  },

  methods: {
    async fetchEpisData() {
      try {
        const response = await axios.get('http://127.0.0.1:3001/epis-data', {
          params: {
            page: this.currentPageEpis,
            limit: this.itemsPerPage,
            startDate: '2024-08-01',
            endDate: '2024-08-03',
          },
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        });
        this.episData = response.data.episData;
        this.totalPagesEpis = Math.ceil(response.data.totalRecords / this.itemsPerPage);
      } catch (error) {
        console.error('Error fetching Epis data:', error);
      }
    },

    async fetchCounterData() {
      try {
        const response = await axios.get('http://127.0.0.1:3001/counter-data', {
          params: {
            page: this.currentPageCounter,
            limit: this.itemsPerPage,
            startDate: '2023-12-05',
            endDate: '2023-12-13',
          },
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        });

        this.counterData = response.data.counterData;
        this.totalPagesCounter = Math.ceil(response.data.totalRecords / this.itemsPerPage);
      } catch (error) {
        console.error('Error fetching Counter Log data:', error);
      }
    },

    async fetchTotalValues() {
      try {
        const response = await axios.get('http://127.0.0.1:3001/multiplication/totals', {
          params: {
            page: 0,
            limit: 0,
            day: '2024-08-20',
            month: '2024-08',
          },
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        });
        this.totalValues = response.data;
      } catch (error) {
        console.error('Error fetching total values:', error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    },

    changePage(tableType, newPage) {
      if (tableType === 'epis') {
        this.currentPageEpis = newPage;
        this.fetchEpisData();
      } else if (tableType === 'counter') {
        this.currentPageCounter = newPage;
        this.fetchCounterData();
      }
    }

  }
};
</script>

<style scoped>
.home-view {
  padding: 5rem;
  font-family: Arial, sans-serif;
  color: #333;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #4A90E2;
}

.table-section {
  margin-bottom: 40px;
}

.table-section h2 {
  border-bottom: 2px solid #4A90E2;
  padding-bottom: 10px;
  margin-bottom: 15px;
  color: #ffffff;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f9f9f9;
}

.data-table th, .data-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.data-table th {
  background-color: #4A90E2;
  color: #fff;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.data-table tbody tr:hover {
  background-color: #ddd;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #4A90E2;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  font-size: 16px;
  color: #ffffff;
}
</style>
