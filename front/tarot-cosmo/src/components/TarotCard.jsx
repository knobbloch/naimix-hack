// import React, { useState } from "react";

// // Тестовые данные
// const testCardData = {
//   id: 1,
//   name: "The Fool",
//   image: "../assets/1.png", // Замените на реальное изображение
//   description: "Represents new beginnings, spontaneity, and adventure.",
// };

// const TarotCard = () => {
//   const [cardData] = useState(testCardData);

//   return (
//     <div
//       className="tarot-card"
//       style={{ border: "1px solid #ccc", padding: "16px", width: "300px" }}
//     >
//       <h2>{cardData.name}</h2>
//       <img src={cardData.image} alt={cardData.name} style={{ width: "100%" }} />
//       <p>{cardData.description}</p>
//     </div>
//   );
// };

// export default TarotCard;

import React, { useEffect, useState } from "react";

const TarotCard = () => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/analysis/tarot`);
        if (!response.ok) {
          throw new Error("Failed to fetch card data");
        }
        const data = await response.json();
        setCardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="tarot-card">
      <h2>{cardData.name}</h2>
      <p>
        <strong>Card Number:</strong> {cardData.num}
      </p>
      <p>
        <strong>Meaning:</strong> {cardData.meaning}
      </p>
    </div>
  );
};

export default TarotCard;
