export const getCoordinates = (placeName) => {
  const API_KEY = process.env.REACT_APP_YANDEX_API_KEY;

  fetch(
    `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&geocode=${placeName}&format=json`
  )
    .then((response) => response.json())
    .then((data) => {
      const coords =
        data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
          .split(" ")
          .map((strCoord) => strCoord.substr(0, 5));

      const resCoord = [
        coords[1].replace(".", "n"),
        coords[0].replace(".", "e"),
      ];

      console.log(resCoord);

      return resCoord;
    });
};
