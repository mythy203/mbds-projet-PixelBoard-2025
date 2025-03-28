export const filterBoards = (boards, { title = "", minSize = 0, maxSize = Infinity }) => {
    return boards.filter(board => {
      const matchesTitle = board.title.toLowerCase().includes(title.toLowerCase());
      const matchesMinSize = board.size >= minSize;
      const matchesMaxSize = board.size <= maxSize;
      return matchesTitle && matchesMinSize && matchesMaxSize;
    });
  };
  