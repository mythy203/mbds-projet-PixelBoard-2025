import React from "react";
import styles from "../styles/AdminPage.module.css";

const SortControls = ({
  sortKey,
  sortOrder,
  setSortKey,
  setSortOrder,
  filterTitle,
  setFilterTitle,
  filterMinSize,
  setFilterMinSize,
  filterMaxSize,
  setFilterMaxSize,
}) => {
  return (
    <div className={styles.sortControls}>
      <label>
        Trier par :
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="title">Titre</option>
          <option value="size">Taille</option>
        </select>
      </label>

      <button onClick={() => setSortOrder(order => order === "asc" ? "desc" : "asc")}>
        {sortOrder === "asc" ? "⬆️ Ascendant" : "⬇️ Descendant"}
      </button>

      <label>
        Filtrer par titre :
        <input
          type="text"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
          placeholder="ex: PixelArt"
        />
      </label>

      <label>
        Taille minimale :
        <input
          type="number"
          value={filterMinSize}
          onChange={(e) => setFilterMinSize(Number(e.target.value))}
          min={0}
        />
      </label>

      <label>
        Taille maximale :
        <input
          type="number"
          value={filterMaxSize}
          onChange={(e) => setFilterMaxSize(Number(e.target.value))}
          min={0}
        />
      </label>
    </div>
  );
};

export default SortControls;
