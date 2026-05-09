-- ================================================
-- Activate sample drivers + add sample reviews
-- ================================================

-- Set sample drivers to active subscription
UPDATE public.driver_profiles
SET subscription_status = 'active',
    current_period_end = NOW() + INTERVAL '1 year'
WHERE slug IN ('max-mustermann', 'anna-schmidt', 'thomas-weber');

-- Add bio to Thomas Weber
UPDATE public.driver_profiles
SET bio = 'Berliner Taxifahrer mit Leidenschaft. Ich kenne die Stadt wie meine Westentasche und bringe Sie sicher und entspannt ans Ziel.'
WHERE slug = 'thomas-weber';

-- Sample reviews for Max Mustermann
INSERT INTO public.reviews (driver_id, overall_rating, question_1, question_2, question_3, question_4, question_5, private_comment, created_at)
SELECT id, 5, 5, 5, 5, 5, 5, 'Sehr freundlicher Fahrer, absolute Weiterempfehlung!', NOW() - INTERVAL '2 days'
FROM public.driver_profiles WHERE slug = 'max-mustermann';

INSERT INTO public.reviews (driver_id, overall_rating, question_1, question_2, question_3, question_4, question_5, private_comment, created_at)
SELECT id, 5, 5, 4, 5, 5, 5, 'Pünktlich, sauberes Fahrzeug, sehr angenehme Fahrt.', NOW() - INTERVAL '8 days'
FROM public.driver_profiles WHERE slug = 'max-mustermann';

INSERT INTO public.reviews (driver_id, overall_rating, question_1, question_2, question_3, question_4, question_5, private_comment, created_at)
SELECT id, 4, 4, 5, 4, 5, 4, 'Sehr guter Fahrer, immer wieder gerne.', NOW() - INTERVAL '20 days'
FROM public.driver_profiles WHERE slug = 'max-mustermann';

-- Sample reviews for Anna Schmidt
INSERT INTO public.reviews (driver_id, overall_rating, question_1, question_2, question_3, question_4, question_5, private_comment, created_at)
SELECT id, 5, 5, 5, 5, 5, 5, 'Anna ist einfach die beste Fahrerin – immer pünktlich und super nett!', NOW() - INTERVAL '1 day'
FROM public.driver_profiles WHERE slug = 'anna-schmidt';

INSERT INTO public.reviews (driver_id, overall_rating, question_1, question_2, question_3, question_4, question_5, private_comment, created_at)
SELECT id, 5, 5, 5, 5, 4, 5, 'Sehr professionell, das Auto war makellos sauber.', NOW() - INTERVAL '14 days'
FROM public.driver_profiles WHERE slug = 'anna-schmidt';

INSERT INTO public.reviews (driver_id, overall_rating, question_1, question_2, question_3, question_4, question_5, private_comment, created_at)
SELECT id, 5, 4, 5, 5, 5, 5, 'Ruhige und sichere Fahrweise, fühlt man sich sofort wohl.', NOW() - INTERVAL '30 days'
FROM public.driver_profiles WHERE slug = 'anna-schmidt';

-- Sample reviews for Thomas Weber
INSERT INTO public.reviews (driver_id, overall_rating, question_1, question_2, question_3, question_4, question_5, private_comment, created_at)
SELECT id, 5, 5, 5, 5, 5, 5, 'Thomas kennt Berlin perfekt, hat sogar den kürzesten Weg genommen!', NOW() - INTERVAL '3 days'
FROM public.driver_profiles WHERE slug = 'thomas-weber';

INSERT INTO public.reviews (driver_id, overall_rating, question_1, question_2, question_3, question_4, question_5, private_comment, created_at)
SELECT id, 4, 5, 4, 5, 4, 4, 'Netter Fahrer, gute Unterhaltung auf der Fahrt.', NOW() - INTERVAL '11 days'
FROM public.driver_profiles WHERE slug = 'thomas-weber';
