
-- Public read for sponsor logos so the marquee can display them
CREATE POLICY "sponsor-logos public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'sponsor-logos');

-- Allow anyone (including unauthenticated applicants) to upload a sponsor logo
DROP POLICY IF EXISTS "sponsor-logos auth upload" ON storage.objects;
CREATE POLICY "sponsor-logos anyone upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'sponsor-logos');

-- Admins can update / delete sponsor logos
CREATE POLICY "sponsor-logos admin update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'sponsor-logos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "sponsor-logos admin delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'sponsor-logos' AND has_role(auth.uid(), 'admin'));
