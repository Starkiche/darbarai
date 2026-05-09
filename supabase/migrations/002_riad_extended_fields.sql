-- ============================================================
-- Migration 002 – Champs étendus pour les riads
-- À exécuter dans Supabase SQL Editor
-- ============================================================

alter table public.riads
  -- Séjour minimum
  add column if not exists min_nights int not null default 2,

  -- Surface totale
  add column if not exists area_sqm int,

  -- Détail du couchage : [{label, label_en, beds, beds_en}]
  -- ex: [{label:"Suite Zitoun", label_en:"Zitoun Suite", beds:"1 lit king size", beds_en:"1 king size bed"}]
  add column if not exists sleeping_arrangements jsonb not null default '[]'::jsonb,

  -- Équipements : tableau de slugs prédéfinis
  -- ex: ["piscine","hammam","wifi","climatisation","terrasse","cuisine","parking","petit-dejeuner"]
  add column if not exists amenities text[] not null default '{}',

  -- Services proposés : [{name, name_en, description, description_en, price_cents}]
  -- price_cents = 0 signifie inclus
  add column if not exists services jsonb not null default '[]'::jsonb,

  -- Galerie groupée par pièce : [{label, label_en, photos: [url, ...]}]
  -- Remplace l'ancien champ images (text[])
  add column if not exists gallery jsonb not null default '[]'::jsonb,

  -- Localisation
  add column if not exists location jsonb,
  -- ex: {address:"12 Derb Lalla Azzouna, Médina", neighborhood:"Médina Sud",
  --      lat:31.624, lng:-7.982, google_maps_url:"https://maps.google.com/..."}

  -- Règles de la maison
  add column if not exists house_rules jsonb not null default '[]'::jsonb,
  -- ex: ["Non-fumeur", "Pas d'animaux", "Arrivée après 15h"]
  add column if not exists house_rules_en jsonb not null default '[]'::jsonb,

  -- Horaires
  add column if not exists checkin_time text not null default '15:00',
  add column if not exists checkout_time text not null default '11:00',

  -- Politique d'annulation
  add column if not exists cancellation_policy text,
  add column if not exists cancellation_policy_en text;

-- Seed de démonstration : Dar Baraï
update public.riads set
  min_nights = 2,
  area_sqm   = 210,
  checkin_time  = '15:00',
  checkout_time = '11:00',
  sleeping_arrangements = '[
    {"label":"Chambre 1","label_en":"Room 1","beds":"1 grand lit double","beds_en":"1 king size bed"},
    {"label":"Chambre 2","label_en":"Room 2","beds":"1 grand lit double","beds_en":"1 king size bed"},
    {"label":"Chambre 3 (terrasse)","label_en":"Room 3 (rooftop)","beds":"1 grand lit double","beds_en":"1 king size bed"}
  ]'::jsonb,
  amenities = ARRAY[
    'wifi','climatisation','terrasse','petit-dejeuner','cuisine','hammam','blanchisserie','navette-aeroport'
  ],
  services = '[
    {"name":"Petit-déjeuner marocain","name_en":"Moroccan breakfast","description":"Inclus, préparé par Lamia chaque matin","description_en":"Included, prepared daily by Lamia","price_cents":0},
    {"name":"Déjeuner ou dîner","name_en":"Lunch or dinner","description":"Sur réservation, cuisine traditionnelle marocaine","description_en":"On request, traditional Moroccan cuisine","price_cents":3500},
    {"name":"Cours de cuisine","name_en":"Cooking class","description":"Avec Lamia, visite du souk alimentaire incluse","description_en":"With Lamia, food market visit included","price_cents":5000},
    {"name":"Transfert aéroport","name_en":"Airport transfer","description":"Avec Hassan, chauffeur de confiance","description_en":"With Hassan, trusted driver","price_cents":15000},
    {"name":"Ménage quotidien","name_en":"Daily housekeeping","description":"Inclus","description_en":"Included","price_cents":0},
    {"name":"Blanchisserie","name_en":"Laundry service","description":"Sur demande","description_en":"On request","price_cents":500}
  ]'::jsonb,
  gallery = '[
    {"label":"Patio & Salon","label_en":"Patio & Living room","photos":["https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&q=80","https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80"]},
    {"label":"Chambres","label_en":"Rooms","photos":["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80"]},
    {"label":"Terrasse","label_en":"Rooftop terrace","photos":["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80"]},
    {"label":"Cuisine & Salle à manger","label_en":"Kitchen & Dining","photos":["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80"]}
  ]'::jsonb,
  location = '{
    "address":"168 Derb Rahala Road, Kasbah, 40000 Marrakech",
    "neighborhood":"Kasbah",
    "lat":31.6183,
    "lng":-7.9858,
    "google_maps_url":"https://maps.google.com/?q=168+Derb+Rahala+Road+Kasbah+Marrakech"
  }'::jsonb,
  house_rules = '[
    "Établissement entièrement non-fumeurs",
    "Animaux de compagnie non admis",
    "Fêtes et événements non autorisés",
    "Heures silencieuses de 22h00 à 08h00",
    "Âge minimum requis : 18 ans",
    "Arrivée entre 15h00 et 20h00 — indiquer votre heure à l''avance",
    "Départ avant 11h00",
    "Enterrements de vie de célibataire interdits"
  ]'::jsonb,
  house_rules_en = '[
    "Non-smoking throughout",
    "Pets not allowed",
    "Parties and events not permitted",
    "Quiet hours from 10pm to 8am",
    "Minimum age required: 18 years",
    "Check-in between 3pm and 8pm — please inform us of your arrival time in advance",
    "Check-out before 11am",
    "Stag/hen parties strictly prohibited"
  ]'::jsonb,
  cancellation_policy = 'Les conditions d''annulation et de prépaiement varient selon l''option choisie. Option remboursable : annulation gratuite jusqu''à 48h avant l''arrivée. Option non remboursable : aucun remboursement en cas d''annulation.',
  cancellation_policy_en = 'Cancellation and prepayment conditions vary by option. Refundable option: free cancellation up to 48 hours before arrival. Non-refundable option: no refund in case of cancellation.'
where slug = 'dar-barai';

-- Seed de démonstration : Dar Tanawi
update public.riads set
  min_nights = 2,
  area_sqm   = 320,
  checkin_time  = '15:00',
  checkout_time = '11:00',
  sleeping_arrangements = '[
    {"label":"Suite Jasmin","label_en":"Jasmine Suite","beds":"1 lit king size","beds_en":"1 king size bed"},
    {"label":"Suite Oranger","label_en":"Orange Tree Suite","beds":"1 lit king size","beds_en":"1 king size bed"},
    {"label":"Suite Menthe","label_en":"Mint Suite","beds":"2 lits jumeaux","beds_en":"2 twin beds"},
    {"label":"Suite Cèdre","label_en":"Cedar Suite","beds":"1 lit double + 1 lit simple","beds_en":"1 double bed + 1 single bed"}
  ]'::jsonb,
  amenities = ARRAY[
    'hammam','wifi','climatisation','terrasse','petit-dejeuner','jardin'
  ],
  services = '[
    {"name":"Petit-déjeuner marocain","name_en":"Moroccan breakfast","description":"Inclus","description_en":"Included","price_cents":0},
    {"name":"Hammam privatif","name_en":"Private hammam","description":"Sur réservation","description_en":"On request","price_cents":7000},
    {"name":"Cours de cuisine","name_en":"Cooking class","description":"Sur réservation","description_en":"On request","price_cents":12000},
    {"name":"Service blanchisserie","name_en":"Laundry service","description":"Par kg","description_en":"Per kg","price_cents":500}
  ]'::jsonb,
  gallery = '[
    {"label":"Patio & Jardin","label_en":"Patio & Garden","photos":["https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1200&q=80","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"]},
    {"label":"Suites","label_en":"Suites","photos":["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"]}
  ]'::jsonb,
  location = '{
    "address":"8 Derb Ben Ameur, Médina",
    "neighborhood":"Médina Nord",
    "lat":31.6320,
    "lng":-7.9895,
    "google_maps_url":"https://maps.google.com/?q=31.6320,-7.9895"
  }'::jsonb,
  house_rules = '["Non-fumeur à l''intérieur","Animaux non admis","Arrivée entre 15h et 22h","Départ avant 11h"]'::jsonb,
  house_rules_en = '["Non-smoking indoors","Pets not allowed","Check-in between 3pm and 10pm","Check-out before 11am"]'::jsonb,
  cancellation_policy = 'Annulation gratuite jusqu''à 7 jours avant l''arrivée. Moins de 7 jours : non remboursable.',
  cancellation_policy_en = 'Free cancellation up to 7 days before arrival. Less than 7 days: non-refundable.'
where slug = 'dar-tanawi';
