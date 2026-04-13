-- Profiles Table
CREATE TABLE public.profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  tagline text,
  bio text,
  location text,
  email text,
  phone text,
  linkedin text,
  github text,
  twitter text,
  photo text,
  resume text,
  about jsonb
);

-- Projects Table
CREATE TABLE public.projects (
  id text PRIMARY KEY,
  title text,
  description text,
  tech text[],
  github text,
  live text,
  images text[],
  date date,
  category text
);

-- Skills Table
CREATE TABLE public.skills (
  id text PRIMARY KEY,
  name text,
  category text,
  level integer
);

-- Experience Table
CREATE TABLE public.experience (
  id text PRIMARY KEY,
  role text,
  organization text,
  "startDate" date,
  "endDate" date,
  description text,
  current boolean
);

-- Blogs Table
CREATE TABLE public.blogs (
  id text PRIMARY KEY,
  title text,
  slug text,
  excerpt text,
  content text,
  tags text[],
  date date
);

-- Certifications Table
CREATE TABLE public.certifications (
  id text PRIMARY KEY,
  name text,
  issuer text,
  date date,
  link text
);

-- Achievements Table
CREATE TABLE public.achievements (
  id text PRIMARY KEY,
  title text,
  description text,
  date date,
  link text
);
