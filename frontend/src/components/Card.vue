<template>
    <div class="card">
        <div class="card-header">{{ title }}</div>
        <div class="card-value">{{ value }}</div>
        <input
            type="date"
            v-model="selectedDate"
            @change="onDateChange"
            class="date-picker"
        />
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
        onDateChanged: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            selectedDate: new Date().toISOString().substr(0, 10), // Default to current date
        };
    },
    methods: {
        onDateChange() {
            this.onDateChanged(this.selectedDate);
        },
    },
};
</script>

<style scoped>
.card {
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
    width: 220px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-header {
    font-size: 18px;
    font-weight: bold;
    color: #333;
}

.card-value {
    font-size: 24px;
    color: #42b883;
    font-weight: bold;
}

.date-picker {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}
</style>
