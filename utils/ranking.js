exports.rankProducts = (products) => {
  if (!products.length) return [];

  const maxPrice = Math.max(...products.map((p) => p.price));
  const minPrice = Math.min(...products.map((p) => p.price));

  return products
    .map((p) => {
      let textScore = 1;
      let ratingScore = p.rating / 5;
      let priceScore = 1 - (p.price - minPrice) / (maxPrice - minPrice);
      let stockScore = p.stock > 0 ? 1 : 0;
      let unitsSoldScore =
        Math.log(1 + p.unitsSold) /
        Math.log(1 + Math.max(...products.map((p) => p.unitsSold)));

      p.score =
        0.35 * textScore +
        0.25 * ratingScore +
        0.2 * priceScore +
        0.1 * stockScore +
        0.1 * unitsSoldScore;
      return p;
    })
    .sort((a, b) => b.score - a.score);
};
