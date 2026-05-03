/**
 * Compact share code format (v1):
 * Photo is intentionally excluded — it would make the code enormous.
 * Short property names keep the JSON small before base64 encoding.
 *
 * Compact → Full field mapping:
 *   n  → name
 *   e  → nameEn
 *   c  → category
 *   p  → portions
 *   t  → totalCost
 *   i  → ingredients  [ {n, a, u} → {name, amount, unit} ]
 *   s  → steps
 *   y  → youtubeId
 */

export function encodeRecipe(recipe) {
  const compact = {
    v: 1,
    n: recipe.name,
    ...(recipe.nameEn   && { e: recipe.nameEn }),
    c: recipe.category,
    p: recipe.portions,
    t: recipe.totalCost,
    i: recipe.ingredients.map(ing => ({
      n: ing.name,
      a: ing.amount,
      u: ing.unit,
    })),
    ...(recipe.steps?.length    && { s: recipe.steps }),
    ...(recipe.youtubeId        && { y: recipe.youtubeId }),
  };

  const json = JSON.stringify(compact);
  const bytes = new TextEncoder().encode(json);
  const binary = Array.from(bytes, b => String.fromCharCode(b)).join('');
  return btoa(binary);
}

export function decodeRecipe(code) {
  try {
    const binary = atob(code.trim());
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const d = JSON.parse(json);

    // Support both compact (v1) and legacy (full field names) codes
    const isCompact = d.v === 1;

    if (isCompact) {
      if (!d.n || !Array.isArray(d.i)) return null;
      return {
        id: Date.now(),
        name: d.n,
        nameEn: d.e ?? '',
        category: d.c ?? '',
        portions: d.p ?? 1,
        totalCost: d.t ?? 0,
        costPerPortion: d.p > 0 ? +(d.t / d.p).toFixed(2) : 0,
        photo: null,
        ingredients: d.i.map((ing, idx) => ({
          id: idx + 1,
          name: ing.n,
          amount: ing.a,
          unit: ing.u,
          priceTotal: 0,
        })),
        steps: d.s ?? [],
        youtubeId: d.y ?? null,
      };
    } else {
      // Legacy format — full field names, may include photo
      if (!d.name || !Array.isArray(d.ingredients)) return null;
      return { ...d, id: Date.now() };
    }
  } catch {
    return null;
  }
}
