
drop policy contact_anyone_insert on public.contact_messages;
create policy contact_anyone_insert on public.contact_messages
  for insert with check (
    char_length(name) between 1 and 200
    and char_length(email) between 3 and 320
    and email like '%_@_%.__%'
    and char_length(message) between 5 and 5000
    and (subject is null or char_length(subject) <= 300)
  );
