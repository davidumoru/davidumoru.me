import { componentRegistry, type ComponentKey } from "./componentRegistry";
import "../../style/tailwind/index.css";

interface Props {
  componentKey: ComponentKey;
}

const showcaseStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  marginBottom: "3rem",
  border: "1px solid var(--gray-6)",
  overflow: "hidden",
  backgroundColor: "var(--gray-2)",
  minHeight: "23rem",
};

export default function ExperimentRenderer({ componentKey }: Props) {
  const Component = componentRegistry[componentKey];
  return (
    <div style={showcaseStyles}>
      <Component />
    </div>
  );
}
