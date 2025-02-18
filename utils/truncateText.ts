export const truncateText = (text: string) => {
  if (text.length <= 25) return text;

  return `${text.slice(0, 25)}...`;
};
