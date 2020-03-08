/**
 * @todo build and export scheme in accordance with DB at runtim
 */
const id = a => d => d[a];
const number = a => d => +d[a];

const schema = [
  {
    name: "count",
    type: number
  },
  {
    name: "country",
    type: id
  },
  {
    name: "destination",
    type: id
  },
  {
    name: "diversity",
    type: number
  },
  {
    name: "femaleShare",
    type: number
  },
  {
    name: "id",
    type: id
  },
  {
    name: "ids",
    type: id
  },
  {
    name: "rca",
    type: number
  },
  {
    name: "source",
    type: id
  },
  {
    name: "topic",
    type: id
  },
  {
    name: "vector3d",
    type: id
  },
  {
    name: "year",
    type: number
  },
  {
    name: "weight",
    type: number
  }
];

const zipObj = xs => ys =>
  xs.reduce((obj, x, i) => ({ ...obj, [x]: ys[i] }), {});

export const accessors = {
  names: zipObj(schema.map(s => s.name))(schema.map(s => s.name)),
  types: zipObj(schema.map(s => s.name))(schema.map(s => s.type(s.name))),
  filters: {
    country: "byCountry",
    topic: "byTopic",
    year: "byYear"
  }
};
