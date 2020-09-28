/**
 * @todo build and export scheme in accordance with DB at runtim
 */
const id = (a) => (d) => d[a];
const number = (a) => (d) => +d[a];

const schema = [
  {
    name: "citations",
    type: number,
  },
  {
    name: "country",
    type: id,
  },
  {
    name: "diversity",
    type: number,
    ui: "research diversity",
  },
  {
    name: "femaleShare",
    type: number,
    ui: "gender diversity",
  },
  {
    name: "id",
    type: id,
  },
  {
    name: "ids",
    type: id,
  },
  {
    name: "rca",
    type: number,
    ui: "research specialization",
  },
  {
    name: "topic",
    type: id,
  },
  {
    name: "vector3d",
    type: id,
  },
  {
    name: "year",
    type: number,
  },
];

const zipObj = (xs) => (ys) =>
  xs.reduce((obj, x, i) => ({ ...obj, [x]: ys[i] }), {});

export const accessors = {
  names: zipObj(schema.map((s) => s.name))(schema.map((s) => s.name)),
  types: zipObj(schema.map((s) => s.name))(schema.map((s) => s.type(s.name))),
  ui: zipObj(schema.map((s) => s.name))(schema.map((s) => s.ui || s.name)),
  filters: {
    country: "byCountry",
    topic: "byTopic",
    year: "byYear",
  },
};
