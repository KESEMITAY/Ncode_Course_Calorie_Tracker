-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  daily_calorie_goal integer default 2000,
  created_at timestamptz default now()
);

-- Meals table
create table if not exists meals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  meal_category text check (meal_category in ('breakfast', 'lunch', 'dinner', 'snack')),
  calories integer not null,
  protein integer default 0,
  carbs integer default 0,
  fats integer default 0,
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table meals enable row level security;

-- Profiles RLS policies
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Meals RLS policies
create policy "Users can view own meals"
  on meals for select using (auth.uid() = user_id);

create policy "Users can insert own meals"
  on meals for insert with check (auth.uid() = user_id);

create policy "Users can delete own meals"
  on meals for delete using (auth.uid() = user_id);

-- Auto-create profile on sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
