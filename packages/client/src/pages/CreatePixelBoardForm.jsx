import React, { useState } from 'react';
import axios from 'axios';

const CreatePixelBoardForm = () => {
  const [title, setTitle] = useState('');
  const [size, setSize] = useState(10);
  const [mode, setMode] = useState(true);
  const [delayBetweenPixels, setDelayBetweenPixels] = useState(10);
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!endTime) {
      setMessage({ type: 'error', text: 'La date de fin est obligatoire.' });
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:8000/api/pixelboards',
        {
          title,
          size,
          mode,
          delayBetweenPixels,
          endTime,
        },
        {
          withCredentials: true,
        }
      );

      setMessage({ type: 'success', text: 'PixelBoard créé avec succès !' });
      console.log(res.data);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Erreur lors de la création.' });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Créer un PixelBoard</h2>
      {message && (
        <div
          className={`mb-4 p-2 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Titre</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Taille (grille)</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            required
            min={5}
            max={200}
          />
        </div>
        <div>
          <label className="block font-medium">Mode</label>
          <select
            className="w-full border rounded p-2"
            value={mode}
            onChange={(e) => setMode(e.target.value === 'true')}
          >
            <option value="true">Autoriser modification de pixels</option>
            <option value="false">Interdire modification</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Délai entre pixels (sec)</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={delayBetweenPixels}
            onChange={(e) => setDelayBetweenPixels(Number(e.target.value))}
            min={1}
            max={3600}
          />
        </div>
        <div>
          <label className="block font-medium">Date de fin <span className="text-red-600"></span></label>
          <input
            type="datetime-local"
            className="w-full border rounded p-2"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Créer
        </button>
      </form>
    </div>
  );
};

export default CreatePixelBoardForm;
