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
  {
    id: 2,
    name: 'Żurek z jajkiem i kiełbasą',
    nameEn: 'Sourdough soup with egg and sausage',
    category: 'Zupa',
    portions: 6,
    costPerPortion: 4.20,
    totalCost: 25.20,
    ingredients: [
      { id: 1, name: 'Zakwas na żurek', amount: 500, unit: 'ml', priceTotal: 4.50 },
      { id: 2, name: 'Kiełbasa biała', amount: 300, unit: 'g', priceTotal: 7.50 },
      { id: 3, name: 'Jajka', amount: 6, unit: 'szt.', priceTotal: 4.80 },
      { id: 4, name: 'Śmietana 18%', amount: 200, unit: 'ml', priceTotal: 3.20 },
      { id: 5, name: 'Czosnek', amount: 4, unit: 'ząbki', priceTotal: 1.20 },
      { id: 6, name: 'Majeranek', amount: 1, unit: 'łyżka', priceTotal: 0.50 },
      { id: 7, name: 'Chrzan', amount: 2, unit: 'łyżki', priceTotal: 1.80 }
    ]
  },
  {
    id: 3,
    name: 'Schabowy z ziemniakami i surówką',
    nameEn: 'Pork cutlet with potatoes and slaw',
    category: 'Przekąska',
    portions: 4,
    costPerPortion: 9.80,
    totalCost: 39.20,
    ingredients: [
      { id: 1, name: 'Schab bez kości', amount: 600, unit: 'g', priceTotal: 19.80 },
      { id: 2, name: 'Ziemniaki', amount: 800, unit: 'g', priceTotal: 3.20 },
      { id: 3, name: 'Kapusta biała', amount: 400, unit: 'g', priceTotal: 2.40 },
      { id: 4, name: 'Marchew', amount: 2, unit: 'szt.', priceTotal: 1.00 },
      { id: 5, name: 'Jajka', amount: 2, unit: 'szt.', priceTotal: 1.60 },
      { id: 6, name: 'Bułka tarta', amount: 100, unit: 'g', priceTotal: 1.20 },
      { id: 7, name: 'Olej', amount: 100, unit: 'ml', priceTotal: 2.00 }
    ]
  },
  {
    id: 4,
    name: 'Sałatka grecka z fetą',
    nameEn: 'Greek salad with feta',
    category: 'Przekąska',
    portions: 2,
    costPerPortion: 7.30,
    totalCost: 14.60,
    ingredients: [
      { id: 1, name: 'Pomidory', amount: 3, unit: 'szt.', priceTotal: 3.60 },
      { id: 2, name: 'Ogórek', amount: 1, unit: 'szt.', priceTotal: 1.50 },
      { id: 3, name: 'Ser feta', amount: 150, unit: 'g', priceTotal: 5.50 },
      { id: 4, name: 'Oliwki czarne', amount: 50, unit: 'g', priceTotal: 2.20 },
      { id: 5, name: 'Cebula czerwona', amount: 1, unit: 'szt.', priceTotal: 0.80 },
      { id: 6, name: 'Oliwa z oliwek', amount: 3, unit: 'łyżki', priceTotal: 1.80 }
    ]
  },
  {
    id: 5,
    name: 'Sernik na zimno z malinami',
    nameEn: 'No-bake cheesecake with raspberries',
    category: 'Deser',
    portions: 8,
    costPerPortion: 3.90,
    totalCost: 31.20,
    ingredients: [
      { id: 1, name: 'Twaróg kremowy', amount: 500, unit: 'g', priceTotal: 8.50 },
      { id: 2, name: 'Śmietana 36%', amount: 300, unit: 'ml', priceTotal: 7.20 },
      { id: 3, name: 'Maliny', amount: 250, unit: 'g', priceTotal: 6.50 },
      { id: 4, name: 'Cukier puder', amount: 100, unit: 'g', priceTotal: 1.20 },
      { id: 5, name: 'Herbatniki', amount: 200, unit: 'g', priceTotal: 3.80 },
      { id: 6, name: 'Masło', amount: 80, unit: 'g', priceTotal: 2.40 },
      { id: 7, name: 'Żelatyna', amount: 10, unit: 'g', priceTotal: 1.60 }
    ]
  },
  {
    id: 6,
    name: 'Risotto z grzybami leśnymi',
    nameEn: 'Wild mushroom risotto',
    category: 'Ryż',
    portions: 4,
    costPerPortion: 11.20,
    totalCost: 44.80,
    ingredients: [
      { id: 1, name: 'Ryż arborio', amount: 300, unit: 'g', priceTotal: 6.50 },
      { id: 2, name: 'Grzyby leśne mrożone', amount: 250, unit: 'g', priceTotal: 9.80 },
      { id: 3, name: 'Bulion warzywny', amount: 1, unit: 'litr', priceTotal: 3.50 },
      { id: 4, name: 'Parmezan', amount: 80, unit: 'g', priceTotal: 7.20 },
      { id: 5, name: 'Cebula', amount: 1, unit: 'szt.', priceTotal: 0.80 },
      { id: 6, name: 'Białe wino', amount: 150, unit: 'ml', priceTotal: 4.50 },
      { id: 7, name: 'Masło', amount: 50, unit: 'g', priceTotal: 1.50 }
    ]
  },
  {
    id: 7,
    name: 'Jajecznica na bekonie z tostami',
    nameEn: 'Scrambled eggs with bacon and toast',
    category: 'Śniadanie',
    portions: 2,
    costPerPortion: 5.40,
    totalCost: 10.80,
    ingredients: [
      { id: 1, name: 'Jajka', amount: 4, unit: 'szt.', priceTotal: 3.20 },
      { id: 2, name: 'Boczek wędzony', amount: 100, unit: 'g', priceTotal: 4.50 },
      { id: 3, name: 'Chleb tostowy', amount: 4, unit: 'kromki', priceTotal: 1.60 },
      { id: 4, name: 'Masło', amount: 20, unit: 'g', priceTotal: 0.60 },
      { id: 5, name: 'Szczypiorek', amount: 1, unit: 'pęczek', priceTotal: 1.20 }
    ]
  },
  {
    id: 8,
    name: 'Zupa pomidorowa z ryżem',
    nameEn: 'Tomato soup with rice',
    category: 'Zupa',
    portions: 6,
    costPerPortion: 3.10,
    totalCost: 18.60,
    ingredients: [
      { id: 1, name: 'Pomidory pelati', amount: 800, unit: 'g', priceTotal: 5.60 },
      { id: 2, name: 'Ryż', amount: 150, unit: 'g', priceTotal: 1.80 },
      { id: 3, name: 'Bulion drobiowy', amount: 1, unit: 'litr', priceTotal: 3.50 },
      { id: 4, name: 'Cebula', amount: 1, unit: 'szt.', priceTotal: 0.80 },
      { id: 5, name: 'Marchew', amount: 2, unit: 'szt.', priceTotal: 1.00 },
      { id: 6, name: 'Śmietana 18%', amount: 100, unit: 'ml', priceTotal: 1.60 },
      { id: 7, name: 'Cukier', amount: 1, unit: 'łyżeczka', priceTotal: 0.10 }
    ]
  },
  {
    id: 9,
    name: 'Kasza gryczana z warzywami',
    nameEn: 'Buckwheat groats with vegetables',
    category: 'Kasza',
    portions: 3,
    costPerPortion: 4.60,
    totalCost: 13.80,
    ingredients: [
      { id: 1, name: 'Kasza gryczana', amount: 250, unit: 'g', priceTotal: 3.20 },
      { id: 2, name: 'Cukinia', amount: 1, unit: 'szt.', priceTotal: 2.50 },
      { id: 3, name: 'Papryka czerwona', amount: 1, unit: 'szt.', priceTotal: 2.80 },
      { id: 4, name: 'Cebula', amount: 1, unit: 'szt.', priceTotal: 0.80 },
      { id: 5, name: 'Oliwa z oliwek', amount: 3, unit: 'łyżki', priceTotal: 1.80 },
      { id: 6, name: 'Czosnek', amount: 2, unit: 'ząbki', priceTotal: 0.60 }
    ]
  }
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
