update private.daily_english_card_catalog
set content_version = '2026.09.08.2'
where content_version is distinct from '2026.09.08.2';

do $$
begin
  if (select count(*) from private.daily_english_card_catalog) <> 150
    or (select min(sequence_no) from private.daily_english_card_catalog) <> 1
    or (select max(sequence_no) from private.daily_english_card_catalog) <> 150
    or (select count(*) from private.daily_english_card_catalog where content_version = '2026.09.08.2') <> 150 then
    raise exception 'daily_english_card_catalog semantic content version update is incomplete';
  end if;
end
$$;
