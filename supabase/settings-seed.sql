-- =============================================================
-- Settings seed: Mission & Vision (managed via Admin > Site Settings)
-- Only inserts if the key doesn't already exist (preserves edits).
-- =============================================================
INSERT INTO public.settings (key, value)
SELECT v.key, v.value
FROM (VALUES
  ('mission_title', 'Confident Communicators'),
  ('mission_text', 'We help every learner speak with ease. You build strong English basics and the confidence to use them in class, at work, and in daily life.'),
  ('vision_title', 'Lifelong Success'),
  ('vision_text', 'We aim to be the most trusted English academy in the region. Here you learn English, find your strengths, and build a career you can be proud of.')
) AS v(key, value)
WHERE NOT EXISTS (SELECT 1 FROM public.settings s WHERE s.key = v.key);

