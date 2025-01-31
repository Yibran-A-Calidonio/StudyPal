import React, { useState, useEffect } from "react";
import api from "../api";
import "./GoalsList.css"; // ✅ Add styles here

const GoalsList = ({ user }) => {
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState("");

    // Fetch goals when the component mounts
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await api.get(`/studybuddy/study-goals/${user.id}`);
                setGoals(response.data);
            } catch (error) {
                console.error("Error fetching study goals:", error);
            }
        };

        fetchGoals();
    }, [user]);

    // Handle adding a new goal
    const handleAddGoal = async () => {
        if (!newGoal.trim()) return; // Prevent empty goals

        try {
            const response = await api.post("/studybuddy/add-study-goal", {
                userId: user.id,
                goalName: newGoal,
            });

            setGoals([...goals, { id: response.data.id, goalName: newGoal }]);
            setNewGoal(""); // Clear input after adding
        } catch (error) {
            console.error("Error adding goal:", error);
        }
    };

    // Handle deleting a goal
    const handleDeleteGoal = async (goalId) => {
        try {
            await api.delete(`/studybuddy/delete-study-goal/${goalId}`);
            setGoals(goals.filter((goal) => goal.id !== goalId));
        } catch (error) {
            console.error("Error deleting goal:", error);
        }
    };

    return (
        <div className="GoalsList">
            <h2>🎯 Study Goals</h2>

            <div className="goal-input">
                <input
                    type="text"
                    placeholder="Enter a new goal..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                />
                <button onClick={handleAddGoal}>➕ Add Goal</button>
            </div>

            <ul className="goal-list">
                {goals.length > 0 ? (
                    goals.map((goal) => (
                        <li key={goal.id} className="goal-item">
                            {goal.goalName}
                            <button onClick={() => handleDeleteGoal(goal.id)}>❌</button>
                        </li>
                    ))
                ) : (
                    <p>No goals set yet. Add one above!</p>
                )}
            </ul>
        </div>
    );
};

export default GoalsList;
