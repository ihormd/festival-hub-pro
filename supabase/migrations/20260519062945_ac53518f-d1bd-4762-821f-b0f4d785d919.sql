
REVOKE EXECUTE ON FUNCTION public.book_vendor_spot(uuid, payment_method, text, text, text, text) FROM anon, public;
GRANT  EXECUTE ON FUNCTION public.book_vendor_spot(uuid, payment_method, text, text, text, text) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.confirm_vendor_booking(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.release_expired_vendor_holds() FROM anon, authenticated, public;
