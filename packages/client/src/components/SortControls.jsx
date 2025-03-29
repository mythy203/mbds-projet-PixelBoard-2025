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
  filterStatus,
  setFilterStatus,
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

      <label>
        Statut :
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">Tous</option>
          <option value="en cours">En cours</option>
          <option value="terminée">Terminée</option>
        </select>
      </label>
    </div>
  );
};

export default SortControls;
