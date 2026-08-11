-- ThreatForge threat-intelligence data model
-- Designed for PostgreSQL/Supabase. Upstream MITRE records remain attributable
-- through source, external_id and source_url.

create extension if not exists pgcrypto;

create table if not exists threat_sources (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  version text,
  source_url text,
  synced_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists threat_objects (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references threat_sources(id) on delete cascade,
  upstream_id text not null,
  object_type text not null,
  external_id text,
  name text not null,
  description text,
  severity text,
  platforms text[] not null default '{}',
  tactics text[] not null default '{}',
  properties jsonb not null default '{}'::jsonb,
  references jsonb not null default '[]'::jsonb,
  created_at timestamptz,
  modified_at timestamptz,
  unique(source_id, upstream_id)
);

create index if not exists threat_objects_external_id_idx on threat_objects(external_id);
create index if not exists threat_objects_type_idx on threat_objects(object_type);
create index if not exists threat_objects_name_idx on threat_objects using gin(to_tsvector('english', name || ' ' || coalesce(description, '')));

create table if not exists threat_relationships (
  id uuid primary key default gen_random_uuid(),
  source_object_id uuid references threat_objects(id) on delete cascade,
  target_object_id uuid references threat_objects(id) on delete cascade,
  relationship_type text not null,
  properties jsonb not null default '{}'::jsonb,
  unique(source_object_id, target_object_id, relationship_type)
);

create table if not exists architecture_components (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  description text,
  default_zone text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists component_threat_mappings (
  component_id uuid references architecture_components(id) on delete cascade,
  threat_object_id uuid references threat_objects(id) on delete cascade,
  confidence numeric(4,3) default 0.8,
  rationale text,
  primary key(component_id, threat_object_id)
);

create table if not exists methodology_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  scope text,
  description text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists threat_model_findings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid,
  component_id uuid references architecture_components(id),
  threat_object_id uuid references threat_objects(id),
  methodology_id uuid references methodology_catalog(id),
  likelihood numeric(4,2),
  impact numeric(4,2),
  risk_score numeric(6,2),
  status text not null default 'open',
  owner text,
  mitigation text,
  evidence text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Useful query for the AI/risk engine:
-- SELECT t.*, r.relationship_type
-- FROM threat_objects t
-- LEFT JOIN threat_relationships r ON r.source_object_id = t.id
-- WHERE t.external_id = 'T1059';
