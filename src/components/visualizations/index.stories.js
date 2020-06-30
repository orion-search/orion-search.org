import React from "react";
import { WordCloud } from ".";

export default {
  title: "Design System/Visualizations",
  component: WordCloud,
  decorators: [],
};

const data = [
  ["Biology", 66],
  ["Genetics", 50],
  ["Cell biology", 15],
  ["Biophysics", 14],
  ["Bioinformatics", 14],
  ["Intracellular", 9],
  ["Gene", 7],
  ["Mutant", 7],
  ["Genome", 6],
  ["Calcium", 6],
];

export const Word_Cloud = () => {
  return <WordCloud histogram={data} />;
};
