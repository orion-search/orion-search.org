/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Row } from "../../components/shared/layout";

const Explainer = () => {
  return (
    <Row>
      <h2>Particle Space</h2>
      <p>
        In this view, each paper is a node — the particle space indicates the
        universe of all the papers inside the Orion Search database.
      </p>
      <p>
        These papers are clustered algorithmically (either with the TFIDF or LDA
        algorithm) based on the semantic properties of a paper's contents.
      </p>
      <h3>Selecting Clusters of Papers</h3>
      <p>
        Use keys{" "}
        <strong>
          <code>E/R</code>
        </strong>{" "}
        to rotate the latent space.
      </p>
      <p>
        Hold{" "}
        <strong>
          <code>SHIFT</code>
        </strong>{" "}
        and drag to select regions of papers.
      </p>
      <p>
        Use{" "}
        <strong>
          <code>option (⌥) + mouse</code>
        </strong>{" "}
        to rotate the view and{" "}
        <strong>
          <code>middle click</code>
        </strong>{" "}
        to pan the camera.
      </p>
    </Row>
  );
};

export default Explainer;
