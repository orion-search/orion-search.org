/** @jsx jsx */
import { jsx } from "@emotion/core";

import { Row } from "../../components/shared/layout";
import { Header, Subheader } from "../../components/shared/typography";

const Explainer = () => {
  return (
    <Row>
      <Header>Explore Papers</Header>
      <p>
        Explore the academic papers in Orion's database. Every particle is a
        paper and the distance between them corresponds to their semantic
        similarity; the closer two particles are, the more similar their content
        is.
      </p>
      <Subheader>Navigating the particle space</Subheader>
      <p>
        Use keys{" "}
        <strong>
          <code>Q/E</code>
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
        Use the left click to rotate the view and the middle click to pan the
        camera.
      </p>
    </Row>
  );
};

export default Explainer;
