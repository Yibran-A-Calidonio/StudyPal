import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../api";
import "./GraphPanel.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraphPanel = ({ user }) => {
    const [studyData, setStudyData] = useState([]);

    useEffect(() => {
        const fetchStudyData = async () => {
            try {
                const response = await api.get(`/studybuddy/study-summary/${user.id}`);
                setStudyData(response.data);
            } catch (error) {
                console.error("Error fetching study data:", error);
            }
        };

        fetchStudyData();
    }, [user]);

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const todayIndex = new Date().getDay() - 1; // Get current day (0=Sunday, adjust to start at Monday)

    // Ensure we have 7 values, fill missing days with 0
    const studyTimeData = Array(7).fill(0);
    studyData.forEach((entry) => {
        const index = daysOfWeek.indexOf(entry.day);
        if (index !== -1) {
            studyTimeData[index] = entry.studyTime;
        }
    });

    const chartData = {
        labels: daysOfWeek,
        datasets: [
            {
                label: "Study Time (minutes)",
                data: studyTimeData,
                backgroundColor: (ctx) =>
                    ctx.dataIndex === todayIndex ? "rgba(255, 99, 132, 0.8)" : "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(0,0,0,0.2)",
                borderWidth: 1,
                borderRadius: 5,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (tooltipItem) => `${tooltipItem.raw} minutes` } },
        },
        scales: {
            y: { beginAtZero: true, max: Math.max(...studyTimeData) + 10 },
        },
    };

    return (
        <div className="GraphPanel">
            <h2>📊 Weekly Study Progress</h2>
            <div className="chart-container">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default GraphPanel;
