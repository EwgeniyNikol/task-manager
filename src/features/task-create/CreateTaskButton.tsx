import React, { useState } from "react";
import { Modal } from "@shared/ui/modal";
import { CreateTaskForm } from "./CreateTaskForm";
import styles from "./CreateTaskButton.module.scss";

export const CreateTaskButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    // Можно добавить уведомление об успешном создании
  };

  return (
    <>
      <button
        className={styles.button}
        onClick={() => setIsModalOpen(true)}
      >
        <span className={styles.plus}>+</span>
        Создать задачу
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Создание новой задачи"
        width="600px"
      >
        <CreateTaskForm
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};
