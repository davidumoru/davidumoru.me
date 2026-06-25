import { useState } from "react";
import { Reorder } from "motion/react";
import styles from "./ReorderList.module.css";

const INITIAL = ["Research", "Design", "Prototype", "Build", "Ship"];

export default function ReorderList() {
  const [items, setItems] = useState(INITIAL);

  return (
    <div className={styles.root}>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className={styles.list}
      >
        {items.map((item) => (
          <Reorder.Item
            key={item}
            value={item}
            className={styles.item}
            whileDrag={{ scale: 1.03 }}
          >
            <span className={styles.grip} aria-hidden="true" />
            {item}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
