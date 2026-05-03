/**
 * Encodes a recipe object into a compact base64 string safe for copy-paste.
 * Uses TextEncoder so Polish characters and photo data URLs are handled correctly.
 */
export function encodeRecipe(recipe) {
  const json = JSON.stringify(recipe);
  const bytes = new TextEncoder().encode(json);
  const binary = Array.from(bytes, b => String.fromCharCode(b)).join('');
  return btoa(binary);
}

/**
 * Decodes a base64 recipe code back into a recipe object.
 * Assigns a fresh id so it never collides with existing recipes.
 * Returns null if the code is invalid.
 */
export function decodeRecipe(code) {
  try {
    const binary = atob(code.trim());
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json);
    if (!data.name || !Array.isArray(data.ingredients)) return null;
    return { ...data, id: Date.now() };
  } catch {
    return null;
  }
}
