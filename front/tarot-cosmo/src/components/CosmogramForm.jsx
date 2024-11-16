import React, { useState } from "react";
import styles from "../styles/cosmogram-Form.module.css";

const CosmogramForm = ({ onSubmit }) => {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Формируем объект данных на основе введенных значений
    const formData = {
      birthDate,
      birthTime,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    // Передаем данные в родительский компонент
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <label>Дата рождения:</label>
        <input
          type="date"
          value={birthDate}
          placeholder="11.11.2004"
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      <div>
        <label>Время рождения:</label>
        <input
          type="time"
          value={birthTime}
          placeholder="11:30"
          onChange={(e) => setBirthTime(e.target.value)}
        />
      </div>

      <div>
        <label>Широта:</label>
        <input
          type="number"
          value={latitude}
          placeholder="56.58"
          className={styles.input_location}
          onChange={(e) => setLatitude(e.target.value)}
        />
      </div>

      <div>
        <label>Долгота:</label>
        <input
          type="number"
          value={longitude}
          placeholder="57.26"
          className={styles.input_location}
          onChange={(e) => setLongitude(e.target.value)}
        />
      </div>

      <button type="submit" className={styles.button}>
        Построить космограмму
      </button>
    </form>
  );
};

export default CosmogramForm;
