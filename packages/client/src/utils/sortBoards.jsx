export const sortBoards = (boards, sortKey, sortOrder) => {
    return [...boards].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
  
      if (typeof valA === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
    });
  };
  