module.exports = (rows) => {
  // fixing 'CASING' let's say created_at to createdAt
  return rows.map((row) => {
    const replaced = {};
    for (let key in row) {
      const camelCase = key.replace(/([-_][a-z])/gi, ($1) =>
        $1.toUpperCase().replace("_", "")
      );
      replaced[camelCase] = row[key];
    }
    return replaced;
  });
};
