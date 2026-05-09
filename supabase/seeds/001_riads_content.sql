-- ============================================================
-- Seed contenu – Dar Baraï & Dar Tanawi
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- Dar Baraï
update public.riads set
  name              = 'Dar Baraï',
  name_en           = 'Dar Baraï',
  description       = 'Niché au cœur de la médina de Marrakech, Dar Baraï est un riad d''exception alliant architecture andalouse et art de vivre marocain. Autour de son patio central aux fontaines murmurantes, cinq suites décorées à la main vous accueillent dans un décor de zellige, de moucharabieh et de cèdre sculpté. La piscine sur le toit-terrasse vous offre une vue imprenable sur les toits ocres et les minarets de la ville. Laissez-vous envoûter par la quiétude de ce havre privé, à deux pas des souks et de la Djemaa el-Fna.',
  description_en    = 'Nestled in the heart of the Marrakech medina, Dar Baraï is an exceptional riad blending Andalusian architecture with Moroccan art de vivre. Around its central patio with murmuring fountains, five hand-decorated suites welcome you amid zellige tilework, moucharabieh screens and sculpted cedar. The rooftop pool offers a breathtaking view over the ochre rooftops and minarets. Let yourself be enchanted by the serenity of this private haven, steps from the souks and Djemaa el-Fna.',
  max_guests        = 10,
  base_price_per_night = 25000,
  cover_image       = 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&q=80',
  images            = ARRAY[
    'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80'
  ]
where slug = 'dar-barai';

-- Dar Tanawi
update public.riads set
  name              = 'Dar Tanawi',
  name_en           = 'Dar Tanawi',
  description       = 'À quelques ruelles de la place Jemaa el-Fna, Dar Tanawi est un havre de paix où le temps suspend son vol. Ce riad du XVIIIe siècle, entièrement restauré dans le respect des traditions artisanales marocaines, abrite quatre suites lumineuses autour d''un jardin intérieur planté d''orangers et de jasmin. Ses hammam privatif, salon marocain et terrasse panoramique en font le cadre idéal pour une retraite romantique ou un séjour en famille en plein cœur de Marrakech.',
  description_en    = 'A few alleyways from Jemaa el-Fna square, Dar Tanawi is a haven of peace where time stands still. This 18th-century riad, fully restored in the tradition of Moroccan craftsmanship, houses four bright suites around an interior garden of orange trees and jasmine. Its private hammam, Moroccan lounge and panoramic terrace make it the ideal setting for a romantic retreat or a family stay in the heart of Marrakech.',
  max_guests        = 8,
  base_price_per_night = 20000,
  cover_image       = 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1200&q=80',
  images            = ARRAY[
    'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80'
  ]
where slug = 'dar-tanawi';
