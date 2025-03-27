import React from "react";
import styles from "../styles/AdminPage.module.css"; // tu peux créer un fichier dédié si tu préfères

const SortControls = ({ sortKey, sortOrder, setSortKey, setSortOrder }) => {
  return (
    <div className={styles.sortControls}>
      <label>
        Trier par :{" "}
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="title">Titre</option>
          <option value="size">Taille</option>
        </select>
      </label>
      <button onClick={() => setSortOrder(order => order === "asc" ? "desc" : "asc")}>
        {sortOrder === "asc" ? "⬆️ Ascendant" : "⬇️ Descendant"}
      </button>
    </div>
  );
};

export default SortControls;
