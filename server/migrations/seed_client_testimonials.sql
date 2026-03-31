-- Seed client testimonials (with avatar images in /public/uploads)
BEGIN;

ALTER TABLE testimonials
ADD COLUMN IF NOT EXISTS avatar_image VARCHAR(255),
ADD COLUMN IF NOT EXISTS banner_image VARCHAR(255);

INSERT INTO testimonials (name, role, text, rating, avatar_image, banner_image, created_at)
SELECT
  'Rakesh Bhadu',
  'CEO, MDL Creation Pvt. Ltd.',
  'Company registration se lekar ROC compliances tak, Wealthora Compliance Hub ne sab kuch time-bound aur sahi tarike se complete kiya. CA Laxmikant Gupta ji ki guidance se hamara business setup bahut hi smooth ho gaya.',
  5,
  'testimonial-rakesh-bhadu.png',
  NULL,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM testimonials WHERE name = 'Rakesh Bhadu' AND role = 'CEO, MDL Creation Pvt. Ltd.'
);

INSERT INTO testimonials (name, role, text, rating, avatar_image, banner_image, created_at)
SELECT
  'Dr. Kshitiz Gupta',
  'Co-Founder, Poornansh Welfare Foundation',
  'The compliance support provided by Wealthora was extremely professional. NGO documentation, registration and filings were handled with complete transparency and clarity. A highly reliable team.',
  5,
  'testimonial-dr-kshitiz-gupta.jpeg',
  NULL,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM testimonials WHERE name = 'Dr. Kshitiz Gupta' AND role = 'Co-Founder, Poornansh Welfare Foundation'
);

INSERT INTO testimonials (name, role, text, rating, avatar_image, banner_image, created_at)
SELECT
  'Gurashish Paul',
  'CEO, Xcanun Science & Tech Pvt. Ltd.',
  'Managing GST, IEC, and ROC work for a tech company can be tough, but Wealthora made it seamless. Their structured approach allowed us to focus on innovation while they took care of the compliance side.',
  5,
  'testimonial-gurashish-paul.jpeg',
  NULL,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM testimonials WHERE name = 'Gurashish Paul' AND role = 'CEO, Xcanun Science & Tech Pvt. Ltd.'
);

INSERT INTO testimonials (name, role, text, rating, avatar_image, banner_image, created_at)
SELECT
  'Riya Rathore',
  'Co-Founder, Ladytailor.com',
  'Wealthora understands startup needs perfectly. From Trademark to monthly GST filings, everything is being delivered smoothly. Their customer support has been excellent.',
  5,
  'testimonial-riya-rathore.jpg',
  NULL,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM testimonials WHERE name = 'Riya Rathore' AND role = 'Co-Founder, Ladytailor.com'
);

INSERT INTO testimonials (name, role, text, rating, avatar_image, banner_image, created_at)
SELECT
  'Akshay Jindal',
  'Director, Global Agriculture & Science Academy',
  'Compliance requirements for education entities are complex, but Wealthora offered complete end-to-end support. Their timely work and clear communication really reduced our workload.',
  5,
  'testimonial-akshay-jindal.jpeg',
  NULL,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM testimonials WHERE name = 'Akshay Jindal' AND role = 'Director, Global Agriculture & Science Academy'
);

INSERT INTO testimonials (name, role, text, rating, avatar_image, banner_image, created_at)
SELECT
  'Meetha Lal Saini',
  'Co-Founder, Shri Gurukripa Building & Colonizers Pvt. Ltd.',
  'Real estate business me documentation aur GST compliances kaafi challenging hote hain, par Wealthora ne sab kuch bilkul perfect aur time par handle kiya. Inki professionalism aur dedication bahut hi lajawab hai.',
  5,
  'testimonial-meetha-lal-saini.png',
  NULL,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM testimonials WHERE name = 'Meetha Lal Saini' AND role = 'Co-Founder, Shri Gurukripa Building & Colonizers Pvt. Ltd.'
);

COMMIT;

