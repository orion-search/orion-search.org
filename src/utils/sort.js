import { accessors } from "./accessors";

export const sortCitationsDesc = (a, b) => {
  return accessors.types.citations(b) - accessors.types.citations(a);
};
