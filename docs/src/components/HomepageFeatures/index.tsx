import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import useBaseUrl from "@docusaurus/useBaseUrl";

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Easy to Use",
    image: "img/undraw_docusaurus_mountain.svg",
    description: (
      <>
        Bitcoin MCP Server is designed to be simple to install and use. Start
        with a single command and integrate with your AI models instantly.
      </>
    ),
  },
  {
    title: "AI-First Design",
    image: "img/undraw_docusaurus_tree.svg",
    description: (
      <>
        Built specifically for AI models to interact with Bitcoin. Standardized
        interface through the Model Context Protocol.
      </>
    ),
  },
  {
    title: "Comprehensive Tools",
    image: "img/undraw_docusaurus_react.svg",
    description: (
      <>
        From key generation to blockchain queries, get all the Bitcoin
        functionality your AI models need in one package.
      </>
    ),
  },
];

function Feature({ title, image, description }: FeatureItem) {
  const imagePath = useBaseUrl(image);
  console.log("Image path:", imagePath); // Debug log
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img
          className={styles.featureSvg}
          role="img"
          src={imagePath}
          onError={(e) => {
            console.error("Image failed to load:", imagePath); // Debug log
            e.currentTarget.style.border = "1px solid red";
          }}
        />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
