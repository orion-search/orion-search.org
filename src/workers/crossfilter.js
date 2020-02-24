/* eslint-env worker */
/* eslint no-restricted-globals: 0 */
let nodes;

self.addEventListener("message", ({ data }) => {
  if (data) {
    const { type, nodes } = data;

    switch (type) {
      case "init":
        self.postMessage({
          type: "init"
        });
        nodes = nodes;
        break;
      case "filter":
        self.postMessage({
          type: "filter"
        });
        break;
      default:
        break;
    }
  }
});
/* eslint no-restricted-globals: 1 */
