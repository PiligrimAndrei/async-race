export const randomRGBColor = (min = 0, max = 255) => {
  const random = () => min + Math.floor(Math.random() * (max - min + 1));

  const r = random();
  const g = random();
  const b = random();

  return `rgb(${r},${g},${b})`;
};