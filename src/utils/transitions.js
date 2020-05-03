const durations = {
  short: 500,
  medium: 1000,
  long: 1500,
};

// export const fadeInUp = {
//   from: { transform: "translate3d(0, 30px, 0)", opacity: 0 },
//   // to: { transform: "translate3d(0, 0, 0)", opacity: 1 },
//   to: async (next, cancel) => {
//     await next({
//       opacity: 1,
//       transform: "translate3d(0, 0, 0)"
//     });
//     // await next({  });
//   },
//   config: {
//     duration: durations.medium
//   },
//   delay: 100
// };

export const fadeInUp = {
  from: { transform: "translate3d(0, 20px, 0)", opacity: 0 },
  to: { transform: "translate3d(0, 0, 0)", opacity: 1 },
  config: {
    duration: durations.short,
  },
};

export const fadeIn = {
  from: { opacity: 0.5 },
  to: { opacity: 1 },
  config: {
    duration: durations.medium,
  },
};

export const fadeOut = {
  from: { opacity: 1 },
  to: { opacity: 0.5 },
  config: {
    duration: durations.medium,
  },
};
