const LikelihoodColor = (score) => {
  if (score >= 75) return "bg-green-500";
  if (score >= 50) return "bg-yellow-400";
  return "bg-red-500";
};
export default LikelihoodColor;