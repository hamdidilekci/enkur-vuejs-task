// src/stores/dataStore.js
import { defineStore } from "pinia";
import axios from "axios";

export const useDataStore = defineStore("dataStore", {
    state: () => ({
        episData: [],
        counterData: [],
        totalValues: [],
        loading: false,
        error: null,
    }),
    actions: {
        async fetchEpisData() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get(
                    "http://127.0.0.1:3001/epis-data",
                    {
                        params: {
                            page: 1,
                            limit: 10,
                            startDate: "2024-08-01",
                            endDate: "2024-08-03",
                        },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                this.episData = response.data;
            } catch (error) {
                this.error = "Error fetching Epis data";
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        async fetchCounterData() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get(
                    "http://127.0.0.1:3001/counter-data",
                    {
                        params: {
                            page: 1,
                            limit: 10,
                            startDate: "2023-12-01",
                            endDate: "2023-12-03",
                        },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                this.counterData = response.data;
            } catch (error) {
                this.error = "Error fetching Counter Log data";
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        async fetchTotalValues() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get(
                    "http://127.0.0.1:3001/multiplication/totals",
                    {
                        params: {
                            page: 1,
                            limit: 10,
                            day: "2024-08-20",
                            month: "2024-08",
                        },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                this.totalValues = response.data;
            } catch (error) {
                this.error = "Error fetching total values";
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
    },
});
