export const formatPrice = (price) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatPriceShort = (price) => {
  if (price >= 1000000) {
    return `฿${(price / 1000000).toFixed(1)}M`;
  }
  if (price >= 1000) {
    return `฿${(price / 1000).toFixed(1)}K`;
  }
  return `฿${price}`;
};

export default formatPrice;
