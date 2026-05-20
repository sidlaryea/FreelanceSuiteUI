export const formatPhone = (value) => {
  const n = value.replace(/\D/g, "");

  const m = n.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

  if (!m) return value;

  const [, a, b, c] = m;

  return !b ? a : `(${a}) ${b}${c ? `-${c}` : ""}`;
};

export const getFlagEmoji = (countryCode) => {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );
};




// Utility to build full image URL from a given path
export const buildImageUrl = (path) => {
  if (!path) return "/user-placeholder.png";

  // Already full URL
  if (path.startsWith("http")) {
    return path;
  }

  //if path starts with "/Images/", it's likely a relative path from the API, so we need to prepend the base URL.
  if (path.startsWith("/Images/")) {
    const baseUrl = "http://localhost:5078";
    const cleanBase = (baseUrl || "").replace(/\/$/, "");
    return `${cleanBase}${path}`;
  }

  // If it's a relative path coming from API (common case): ""/Images/...png""
  // Ensure we return the correct absolute URL using VITE_API_URL.
  const baseUrl = import.meta.env.VITE_API_URL;
  const cleanBase = (baseUrl || "").replace(/\/$/, "");

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};
