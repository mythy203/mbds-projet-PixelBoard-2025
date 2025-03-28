import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/AdminPage.module.css";
import Header from "../components/Header";
import CreatePixelBoardForm from "../components/CreatePixelBoardForm";
import EditPixelBoardForm from "../components/EditPixelBoardForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { getUserInfo } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import SortControls from "../components/SortControls";
import { sortBoards } from "../utils/sortBoards";
import { filterBoards } from "../utils/filterBoards";

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [pixelBoards, setPixelBoards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editBoard, setEditBoard] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [sortKey, setSortKey] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterTitle, setFilterTitle] = useState("");
  const [filterMinSize, setFilterMinSize] = useState(0);
  const [filterMaxSize, setFilterMaxSize] = useState(Infinity);

  const navigate = useNavigate();

  const fetchBoards = async () => {
    const response = await axios.get("http://localhost:8000/api/pixelboards");
    setPixelBoards(response.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserInfo();
      if (userInfo?.role !== "admin") {
        navigate("/");
      } else {
        setUser(userInfo);
        await fetchBoards();
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Erreur de déconnexion :", err);
    }
  };

  const boardsEnCours = sortBoards(
    filterBoards(pixelBoards.filter(b => b.status === "en cours"), {
      title: filterTitle,
      minSize: filterMinSize,
      maxSize: filterMaxSize
    }),
    sortKey,
    sortOrder
  );

  const boardsTermines = sortBoards(
    filterBoards(pixelBoards.filter(b => b.status === "terminée"), {
      title: filterTitle,
      minSize: filterMinSize,
      maxSize: filterMaxSize
    }),
    sortKey,
    sortOrder
  );

  const renderBoards = (boards) => (
    <div className={styles.grid}>
      {boards.map(board => (
        <div key={board._id} className={styles.card}>
          <div className={styles.cardActions}>
            <button
              className={styles.editButton}
              title="Modifier ce PixelBoard"
              onClick={() => setEditBoard(board)}
            >
              ✏️
            </button>
            <button
              className={styles.deleteButton}
              title="Supprimer ce PixelBoard"
              onClick={() => setConfirmDelete(board)}
            >
              🗑️
            </button>
          </div>
          <Link to={`/pixelboard/${board._id}`} className={styles.cardContent}>
            <h4>{board.title}</h4>
            <p>Status : <strong>{board.status}</strong></p>
            <p>Dimensions : {board.size} x {board.size}</p>
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.page}>
      <Header user={user} onLogout={handleLogout} />

      <main className={styles.content}>
        <h2 className={styles.title}>Espace Administrateur</h2>

        <div className={styles.adminActions}>
          <button className={styles.createButton} onClick={() => setShowForm(true)}>
            ➕ Créer un PixelBoard
          </button>
          {showForm && (
            <CreatePixelBoardForm
              onCreated={() => {
                setShowForm(false);
                fetchBoards();
              }}
              onCancel={() => setShowForm(false)}
            />
          )}
        </div>

        <p className={styles.stats}>
          Nombre total de PixelBoards : <strong>{pixelBoards.length}</strong>
        </p>

        <SortControls
          sortKey={sortKey}
          sortOrder={sortOrder}
          setSortKey={setSortKey}
          setSortOrder={setSortOrder}
          filterTitle={filterTitle}
          setFilterTitle={setFilterTitle}
          filterMinSize={filterMinSize}
          setFilterMinSize={setFilterMinSize}
          filterMaxSize={filterMaxSize}
          setFilterMaxSize={setFilterMaxSize}
        />

        <section className={styles.section}>
          <h3>🟢 En cours de création</h3>
          {boardsEnCours.length > 0 ? renderBoards(boardsEnCours) : <p>Aucun PixelBoard en cours.</p>}
        </section>

        <section className={styles.section}>
          <h3>🔒 PixelBoards terminés</h3>
          {boardsTermines.length > 0 ? renderBoards(boardsTermines) : <p>Aucun PixelBoard terminé.</p>}
        </section>

        {editBoard && (
          <EditPixelBoardForm
            board={editBoard}
            onUpdated={() => {
              setEditBoard(null);
              fetchBoards();
            }}
            onCancel={() => setEditBoard(null)}
          />
        )}

        {confirmDelete && (
          <ConfirmDialog
            message={`Supprimer le PixelBoard "${confirmDelete.title}" ?`}
            onConfirm={async () => {
              try {
                await axios.delete(`http://localhost:8000/api/pixelboards/${confirmDelete._id}`, {
                  withCredentials: true,
                });
                await fetchBoards();
                setConfirmDelete(null);
              } catch (err) {
                console.error("Erreur lors de la suppression :", err);
                setConfirmDelete(null);
              }
            }}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </main>
    </div>
  );
};

export default AdminPage;
