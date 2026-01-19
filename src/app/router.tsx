import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "@pages/home";
import { TaskDetailsPage } from "@pages/task-details";

export const AppRouter: React.FC = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/task/:id" element={<TaskDetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};
