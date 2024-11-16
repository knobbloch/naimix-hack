import React, { useState } from "react";
import styles from "./styles/app.module.css";
import CosmogramForm from "./components/CosmogramForm";
import Cosmogram from "./components/Cosmogram";
import TarotCard from "./components/TarotCard";

const App = () => {
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = (data) => {
    setFormData(data); // Получаем данные из формы
  };

  return (
    <>
      <div
        style={{ textAlign: "center", padding: "20px" }}
        className={styles.app}
      >
        <h1>Космограмма</h1>
        <CosmogramForm onSubmit={handleFormSubmit} />
        {formData && <Cosmogram formData={formData} />}
      </div>
      <TarotCard />
    </>
  );
};

export default App;
