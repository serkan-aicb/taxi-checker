-- TaxiChecker – Initial Schema
-- Run in Supabase SQL Editor

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ================================================
-- USERS (extends Supabase auth.users)
-- ================================================
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null unique,
  role text not null default 'driver' check (role in ('driver', 'company', 'admin')),
  created_at timestamptz default now() not null
);

-- ================================================
-- DRIVER PROFILES
-- ================================================
create table if not exists public.driver_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete set null,
  first_name text not null,
  last_name text not null,
  gender text check (gender in ('male', 'female', 'diverse')),
  company text,
  bio text check (char_length(bio) <= 500),
  city text,
  region text,
  postal_area text,
  email text,
  phone text,
  mobile text,
  website text,
  facebook_url text,
  instagram_url text,
  whatsapp_url text,
  linkedin_url text,
  tiktok_url text,
  telegram_url text,
  profile_image text,
  slug text not null unique,
  created_at timestamptz default now() not null
);

create index if not exists driver_profiles_slug_idx on public.driver_profiles(slug);
create index if not exists driver_profiles_city_idx on public.driver_profiles(city);
create index if not exists driver_profiles_user_id_idx on public.driver_profiles(user_id);
create index if not exists driver_profiles_search_idx
  on public.driver_profiles using gin(
    (first_name || ' ' || last_name || ' ' || coalesce(company, '')) gin_trgm_ops
  );

-- ================================================
-- REVIEWS
-- ================================================
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  driver_id uuid references public.driver_profiles(id) on delete cascade not null,
  overall_rating smallint not null check (overall_rating between 1 and 5),
  question_1 smallint not null check (question_1 between 1 and 5), -- Freundlichkeit
  question_2 smallint not null check (question_2 between 1 and 5), -- Sauberkeit
  question_3 smallint not null check (question_3 between 1 and 5), -- Fahrstil
  question_4 smallint not null check (question_4 between 1 and 5), -- Pünktlichkeit
  question_5 smallint not null check (question_5 between 1 and 5), -- Gesamteindruck
  public_comment text check (char_length(public_comment) <= 1000),
  private_comment text check (char_length(private_comment) <= 500),
  created_at timestamptz default now() not null
);

create index if not exists reviews_driver_id_idx on public.reviews(driver_id);
create index if not exists reviews_created_at_idx on public.reviews(created_at desc);

-- ================================================
-- COMPANIES
-- ================================================
create table if not exists public.companies (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamptz default now() not null
);

-- ================================================
-- COMPANY_DRIVERS (junction)
-- ================================================
create table if not exists public.company_drivers (
  id uuid default uuid_generate_v4() primary key,
  company_id uuid references public.companies(id) on delete cascade not null,
  driver_id uuid references public.driver_profiles(id) on delete cascade not null,
  unique(company_id, driver_id)
);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

alter table public.users enable row level security;
alter table public.driver_profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.companies enable row level security;
alter table public.company_drivers enable row level security;

-- Driver profiles: public read, owner write
create policy "driver_profiles_public_read"
  on public.driver_profiles for select
  using (true);

create policy "driver_profiles_owner_update"
  on public.driver_profiles for update
  using (auth.uid() = user_id);

create policy "driver_profiles_owner_delete"
  on public.driver_profiles for delete
  using (auth.uid() = user_id);

-- Reviews: public read, anyone can insert (anonymous reviews), no update/delete by public
create policy "reviews_public_read"
  on public.reviews for select
  using (true);

create policy "reviews_anyone_insert"
  on public.reviews for insert
  with check (true);

-- Users: own data only
create policy "users_own_data"
  on public.users for all
  using (auth.uid() = id);

-- ================================================
-- TRIGGER: auto-create user record on signup
-- ================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ================================================
-- VIEW: driver stats (aggregated ratings)
-- ================================================
create or replace view public.driver_stats as
select
  dp.id,
  dp.slug,
  dp.first_name,
  dp.last_name,
  dp.city,
  dp.region,
  dp.company,
  dp.profile_image,
  count(r.id)::int as review_count,
  coalesce(avg(r.overall_rating), 0)::numeric(3,2) as avg_rating,
  coalesce(avg(r.question_1), 0)::numeric(3,2) as avg_q1,
  coalesce(avg(r.question_2), 0)::numeric(3,2) as avg_q2,
  coalesce(avg(r.question_3), 0)::numeric(3,2) as avg_q3,
  coalesce(avg(r.question_4), 0)::numeric(3,2) as avg_q4,
  coalesce(avg(r.question_5), 0)::numeric(3,2) as avg_q5
from public.driver_profiles dp
left join public.reviews r on r.driver_id = dp.id
group by dp.id;

-- ================================================
-- SAMPLE DATA (remove in production)
-- ================================================
insert into public.driver_profiles
  (first_name, last_name, company, bio, city, region, postal_area, slug)
values
  ('Max', 'Mustermann', 'Bamberg Taxi GmbH', 'Ich bin seit 10 Jahren Taxifahrer in Bamberg und schätze einen freundlichen, pünktlichen Service.', 'Bamberg', 'Bayern', '96050', 'max-mustermann'),
  ('Anna', 'Schmidt', 'Schmidt Fahrservice', 'Professionelle Fahrerin für alle Gelegenheiten. Sauber, pünktlich, freundlich.', 'München', 'Bayern', '80331', 'anna-schmidt'),
  ('Thomas', 'Weber', 'Taxi Weber', null, 'Berlin', 'Berlin', '10115', 'thomas-weber')
on conflict (slug) do nothing;
