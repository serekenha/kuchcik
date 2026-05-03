export const sampleRecipes = [
  {
    id: 1,
    name: 'Makaron z łososiem w sosie śmietanowym',
    nameEn: 'Salmon pasta in cream sauce',
    category: 'Makaron',
    portions: 4,
    costPerPortion: 12.50,
    totalCost: 50.00,
    ingredients: [
      { id: 1, name: 'Makaron tagliatelle', amount: 400, unit: 'g', priceTotal: 7.20 },
      { id: 2, name: 'Łosoś wędzony', amount: 200, unit: 'g', priceTotal: 17.00 },
      { id: 3, name: 'Śmietana 30%', amount: 250, unit: 'ml', priceTotal: 5.50 },
      { id: 4, name: 'Czosnek', amount: 3, unit: 'ząbki', priceTotal: 0.90 },
      { id: 5, name: 'Kapary', amount: 2, unit: 'łyżki', priceTotal: 1.60 },
      { id: 6, name: 'Cytryna', amount: 1, unit: 'szt.', priceTotal: 1.20 },
      { id: 7, name: 'Oliwa z oliwek', amount: 3, unit: 'łyżki', priceTotal: 1.80 },
      { id: 8, name: 'Sól i pieprz', amount: 1, unit: 'do smaku', priceTotal: 0.20 }
    ]
  },
];

// Legacy — kept for any remaining references
export const categories = ['Wszystkie', 'Makaron', 'Ryż', 'Kasza', 'Zupa', 'Deser', 'Przekąska', 'Śniadanie'];

export function getCategoryStyle(category) {
  const map = {
    Makaron:   { bg: '#F3F0FF', text: '#6B4FBB' },
    Ryż:       { bg: '#EBF5FF', text: '#1A6DB5' },
    Kasza:     { bg: '#F0FFF8', text: '#1A8050' },
    Zupa:      { bg: '#EBF5FF', text: '#1A6DB5' },
    Deser:     { bg: '#FFF0F6', text: '#C0547A' },
    Przekąska: { bg: '#FFF0EB', text: '#D4500A' },
    Śniadanie: { bg: '#FFFAE8', text: '#9A7200' },
  };
  return map[category] || { bg: '#F0F2F5', text: '#4B5563' };
}

export const sampleSteps = [
  'Ugotuj makaron tagliatelle w osolonej wodzie al dente według wskazówek na opakowaniu. Odcedź i zachowaj szklankę wody z gotowania.',
  'Na dużej patelni rozgrzej oliwę z oliwek na średnim ogniu. Dodaj posiekany czosnek i smaż przez minutę. Wlej śmietanę i gotuj 3–4 minuty aż sos zgęstnieje. Dodaj kapary i skrop sokiem z cytryny. Dopraw solą i pieprzem.',
  'Dodaj ugotowany makaron do sosu i delikatnie wymieszaj. Ułóż na talerzach, połóż płaty łososia wędzonego i podawaj od razu.'
];
