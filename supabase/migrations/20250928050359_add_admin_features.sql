-- Create time_off table for vacations and travel
create table public.time_off (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    start_date date not null,
    end_date date not null,
    is_active boolean default true not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,

    -- Ensure start_date is before or equal to end_date
    check (start_date <= end_date)
);

-- Create announcements table for promotions/workshops/masterclasses
create table public.announcements (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    content text,
    announcement_type text default 'general' not null, -- 'promotion', 'workshop', 'masterclass', 'general'
    start_date timestamptz,
    end_date timestamptz,
    is_active boolean default true not null,
    priority int default 1 not null, -- Higher number = higher priority
    target_audience text default 'all' not null, -- 'patients', 'public', 'all'
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,

    -- Ensure start_date is before end_date if both are set
    check (start_date is null or end_date is null or start_date <= end_date)
);

-- Create services table for psychology clinic services
create table public.services (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    duration_minutes int default 60 not null,
    price decimal(10,2) not null check (price > 0),
    is_active boolean default true not null,
    category text default 'therapy' not null, -- 'therapy', 'evaluation', 'workshop', 'consultation'
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create indexes
create index idx_time_off_dates on public.time_off(start_date, end_date);
create index idx_time_off_active on public.time_off(is_active);
create index idx_announcements_active on public.announcements(is_active);
create index idx_announcements_dates on public.announcements(start_date, end_date);
create index idx_announcements_type on public.announcements(announcement_type);
create index idx_services_active on public.services(is_active);
create index idx_services_category on public.services(category);

-- Add triggers for updated_at
create trigger time_off_updated_at
    before update on public.time_off
    for each row execute function public.handle_updated_at();

create trigger announcements_updated_at
    before update on public.announcements
    for each row execute function public.handle_updated_at();

create trigger services_updated_at
    before update on public.services
    for each row execute function public.handle_updated_at();

-- Enable Row Level Security
alter table public.time_off enable row level security;
alter table public.announcements enable row level security;
alter table public.services enable row level security;

-- RLS Policies for time_off table
create policy "Admins can manage time off"
    on public.time_off for all
    using (public.is_admin());

create policy "Anyone can view active time off"
    on public.time_off for select
    using (is_active = true);

-- RLS Policies for announcements table
create policy "Admins can manage announcements"
    on public.announcements for all
    using (public.is_admin());

create policy "Anyone can view active announcements"
    on public.announcements for select
    using (
        is_active = true and
        (start_date is null or start_date <= now()) and
        (end_date is null or end_date >= now())
    );

-- RLS Policies for services table
create policy "Admins can manage services"
    on public.services for all
    using (public.is_admin());

create policy "Anyone can view active services"
    on public.services for select
    using (is_active = true);

-- Insert default services
insert into public.services (name, description, duration_minutes, price, category)
values
    ('Consulta Individual', 'Sesion de terapia psicologica individual', 60, 80000, 'therapy'),
    ('Evaluacion Psicologica', 'Evaluacion completa del estado mental y emocional', 90, 120000, 'evaluation'),
    ('Terapia de Pareja', 'Sesion de terapia para parejas', 75, 100000, 'therapy'),
    ('Consulta de Seguimiento', 'Sesion de seguimiento y monitoreo', 45, 60000, 'consultation'),
    ('Taller Grupal', 'Talleres tematicos grupales', 120, 50000, 'workshop');

-- Create function to check if a date conflicts with time off
create or replace function public.is_date_available(check_date date)
returns boolean as $$
begin
    return not exists (
        select 1 from public.time_off
        where is_active = true
        and check_date between start_date and end_date
    );
end;
$$ language plpgsql security definer;

-- Create function to get payment statistics
create or replace function public.get_payment_stats(
    start_date timestamptz default null,
    end_date timestamptz default null
)
returns table (
    total_amount decimal,
    confirmed_amount decimal,
    pending_amount decimal,
    rejected_amount decimal,
    total_count bigint,
    confirmed_count bigint,
    pending_count bigint,
    rejected_count bigint
) as $$
begin
    -- Default to last 7 days if no dates provided
    if start_date is null then
        start_date := now() - interval '7 days';
    end if;
    if end_date is null then
        end_date := now();
    end if;

    return query
    select
        coalesce(sum(p.amount), 0) as total_amount,
        coalesce(sum(case when p.status = 'confirmed' then p.amount else 0 end), 0) as confirmed_amount,
        coalesce(sum(case when p.status = 'pending' then p.amount else 0 end), 0) as pending_amount,
        coalesce(sum(case when p.status = 'rejected' then p.amount else 0 end), 0) as rejected_amount,
        count(*) as total_count,
        count(case when p.status = 'confirmed' then 1 end) as confirmed_count,
        count(case when p.status = 'pending' then 1 end) as pending_count,
        count(case when p.status = 'rejected' then 1 end) as rejected_count
    from public.payments p
    where p.payment_date between start_date and end_date;
end;
$$ language plpgsql security definer;

-- Create function to get appointments summary
create or replace function public.get_appointments_summary(
    start_date date default null,
    end_date date default null
)
returns table (
    total_count bigint,
    scheduled_count bigint,
    completed_count bigint,
    cancelled_count bigint
) as $$
begin
    -- Default to current month if no dates provided
    if start_date is null then
        start_date := date_trunc('month', current_date)::date;
    end if;
    if end_date is null then
        end_date := (date_trunc('month', current_date) + interval '1 month - 1 day')::date;
    end if;

    return query
    select
        count(*) as total_count,
        count(case when a.status = 'scheduled' then 1 end) as scheduled_count,
        count(case when a.status = 'completed' then 1 end) as completed_count,
        count(case when a.status = 'cancelled' then 1 end) as cancelled_count
    from public.appointments a
    where a.appointment_date between start_date and end_date;
end;
$$ language plpgsql security definer;