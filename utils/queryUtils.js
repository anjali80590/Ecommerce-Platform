
const synonyms = {
  sasta: "cheap",
  sastha: "cheap",
  mehenga: "expensive",
  red: "red",
  blue: "blue",
  black: "black",
  white: "white",
  strong: "durable",
};


exports.normalizeQuery = (query) => {
  return query
    .split(" ")
    .map((word) => synonyms[word.toLowerCase()] || word)
    .join(" ");
};


exports.applyFilters = (products, filters) => {
  return products.filter((p) => {
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    if (
      filters.color &&
      p.metadata.color?.toLowerCase() !== filters.color.toLowerCase()
    )
      return false;
    if (filters.ram && p.metadata.ram !== filters.ram) return false;
    if (filters.storage && p.metadata.storage !== filters.storage) return false;
    return true;
  });
};
