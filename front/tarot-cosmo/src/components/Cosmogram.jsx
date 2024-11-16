import React, { useState, useEffect } from "react";

const Cosmogram = ({ formData }) => {
  const radius = 200; // Радиус космограммы
  const padding = 50; // Отступы вокруг космограммы
  const center = radius + padding; // Центр космограммы
  const svgSize = center * 2; // Размер SVG

  const [planetPositions, setPlanetPositions] = useState([]);
  const [aspects, setAspects] = useState([]);

  const zodiacSigns = [
    "Овен",
    "Телец",
    "Близнецы",
    "Рак",
    "Лев",
    "Дева",
    "Весы",
    "Скорпион",
    "Стрелец",
    "Козерог",
    "Водолей",
    "Рыбы",
  ];

  const planetColors = {
    Sun: "gold",
    Moon: "silver",
    Mercury: "blue",
    Venus: "green",
    Mars: "red",
    Jupiter: "orange",
    Saturn: "purple",
  };

  const getPosition = (angle, radius) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: center + radius * Math.cos(radian),
      y: center + radius * Math.sin(radian),
    };
  };

  const getZodiacSign = (angle) => {
    const sector = Math.floor(angle / 30) % 12;
    return zodiacSigns[sector];
  };

  const normalizeAngle = (angle) => ((angle % 360) + 360) % 360;

  const calculatePlanetPositions = (data) => {
    const { birthDate, birthTime } = data;
    const date = new Date(`${birthDate}T${birthTime}:00`);
    const epoch2000 = new Date("2000-01-01T12:00:00Z");
    const daysSinceEpoch = (date - epoch2000) / (1000 * 60 * 60 * 24);

    const orbitalParams = {
      Sun: { N: 0, i: 0, w: 282.9404, a: 1, e: 0.016709, M0: 356.047 },
      Moon: {
        N: 125.1228,
        i: 5.145,
        w: 318.0634,
        a: 0.00257,
        e: 0.0549,
        M0: 115.3654,
      },
      Mercury: {
        N: 48.3313,
        i: 7.0047,
        w: 29.1241,
        a: 0.387098,
        e: 0.205635,
        M0: 168.6562,
      },
      Venus: {
        N: 76.6799,
        i: 3.3946,
        w: 54.891,
        a: 0.72333,
        e: 0.006773,
        M0: 48.0052,
      },
      Mars: {
        N: 49.5574,
        i: 1.8497,
        w: 286.5016,
        a: 1.523688,
        e: 0.093405,
        M0: 18.6021,
      },
      Jupiter: {
        N: 100.4542,
        i: 1.303,
        w: 273.8777,
        a: 5.20256,
        e: 0.048498,
        M0: 19.895,
      },
      Saturn: {
        N: 113.6634,
        i: 2.4886,
        w: 339.3939,
        a: 9.55475,
        e: 0.055546,
        M0: 316.967,
      },
    };

    const calculatePosition = (params, daysSinceEpoch) => {
      const { w, e, M0 } = params;

      const M = normalizeAngle(M0 + (360 / 365.25) * daysSinceEpoch);
      const E = solveKepler(M, e);

      const x = Math.cos(toRadians(E)) - e;
      const y = Math.sqrt(1 - e * e) * Math.sin(toRadians(E));
      const v = toDegrees(Math.atan2(y, x));

      return normalizeAngle(v + w);
    };

    const toRadians = (deg) => (deg * Math.PI) / 180;
    const toDegrees = (rad) => (rad * 180) / Math.PI;

    const solveKepler = (M, e) => {
      let E = M;
      const epsilon = 0.0001;
      while (true) {
        const deltaE =
          (E - e * Math.sin(toRadians(E)) - M) /
          (1 - e * Math.cos(toRadians(E)));
        E -= deltaE;
        if (Math.abs(deltaE) < epsilon) break;
      }
      return E;
    };

    return Object.entries(orbitalParams).map(([planet, params]) => {
      const angle = calculatePosition(params, daysSinceEpoch);
      const sign = getZodiacSign(angle);
      return { name: planet, angle, sign };
    });
  };

  const calculateAspects = (positions) => {
    const aspectAngles = {
      соединение: 0,
      квадрат: 90,
      трин: 120,
      секстиль: 60,
      оппозиция: 180,
    };
    const tolerance = 2; // Допустимое отклонение в градусах
    const aspects = [];

    positions.forEach((fromPlanet) => {
      positions.forEach((toPlanet) => {
        if (fromPlanet.name !== toPlanet.name) {
          const angleDiff = Math.abs(fromPlanet.angle - toPlanet.angle) % 360;
          for (const [type, aspectAngle] of Object.entries(aspectAngles)) {
            if (Math.abs(angleDiff - aspectAngle) <= tolerance) {
              aspects.push({
                from: fromPlanet.name,
                to: toPlanet.name,
                type,
                color:
                  type === "квадрат"
                    ? "red"
                    : type === "трин"
                    ? "green"
                    : type === "секстиль"
                    ? "blue"
                    : "gray",
              });
            }
          }
        }
      });
    });

    return aspects;
  };

  useEffect(() => {
    if (formData) {
      const positions = calculatePlanetPositions(formData);
      setPlanetPositions(positions);
      setAspects(calculateAspects(positions));
    }
  }, [formData]);

  return (
    <div style={{ textAlign: "center" }}>
      <svg
        width={svgSize}
        height={svgSize}
        style={{ overflow: "visible" }}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
      >
        {/* Основной круг */}
        <circle
          cx={center}
          cy={center}
          r={radius + 20}
          stroke="black"
          fill="none"
        />
        {/* Сектора и подписи зодиака */}
        {zodiacSigns.map((sign, i) => {
          const angle = i * 30;
          const start = getPosition(angle, radius + 20);
          const textPos = getPosition(angle + 15, radius + 50);
          return (
            <React.Fragment key={i}>
              <line
                x1={center}
                y1={center}
                x2={start.x}
                y2={start.y}
                stroke="black"
              />
              <text
                x={textPos.x}
                y={textPos.y}
                fontSize="14"
                textAnchor="middle"
                style={{ fill: "black", fontWeight: "bold" }}
              >
                {sign}
              </text>
            </React.Fragment>
          );
        })}
        {/* Планеты */}
        {planetPositions.map((planet, index) => {
          const pos = getPosition(planet.angle, radius);
          return (
            <circle
              key={index}
              cx={pos.x}
              cy={pos.y}
              r="6"
              fill={planetColors[planet.name] || "black"}
              stroke="none"
            />
          );
        })}
        {/* Аспекты */}
        {aspects.map((aspect, index) => {
          const fromPlanet = planetPositions.find(
            (p) => p.name === aspect.from
          );
          const toPlanet = planetPositions.find((p) => p.name === aspect.to);

          if (fromPlanet && toPlanet) {
            const fromPos = getPosition(fromPlanet.angle, radius);
            const toPos = getPosition(toPlanet.angle, radius);
            return (
              <line
                key={index}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={aspect.color}
                strokeWidth="2"
                strokeDasharray={aspect.type === "секстиль" ? "4 2" : undefined}
              />
            );
          }
          return null;
        })}
      </svg>
      {/* Легенда */}
      <div style={{ marginTop: "20px" }}>
        <h4>Планеты и знаки зодиака</h4>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {planetPositions.map((planet, index) => (
            <li
              key={index}
              style={{ color: planetColors[planet.name] || "black" }}
            >
              {planet.name}: находится в знаке {planet.sign}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Cosmogram;
