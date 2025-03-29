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
    <fieldset className={styles.sortControls}>
      <legend>🔎 Filtres & Tri</legend>

      <div className={styles.sortRow}>
        <label>
          Trier par :
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="title">Titre</option>
            <option value="size">Taille</option>
            <option value="createdAt">Date de création</option>
            <option value="endTime">Date de fin</option>
          </select>
        </label>

        <button
          type="button"
          title={sortOrder === "asc" ? "Tri ascendant" : "Tri descendant"}
          onClick={() => setSortOrder(order => order === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "⬆️" : "⬇️"}
        </button>

      </div>

      <div className={styles.filtersRow}>
        <label>
          Titre :
          <input
            type="text"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
            placeholder="ex: PixelArt"
          />
        </label>

        <label>
          Taille min :
          <input
            type="number"
            value={filterMinSize}
            onChange={(e) => setFilterMinSize(Number(e.target.value))}
            min={0}
          />
        </label>

        <label>
          Taille max :
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
    </fieldset>
  );
};

export default SortControls;
