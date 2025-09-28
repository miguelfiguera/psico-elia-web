-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type appointment_status as enum ('scheduled', 'completed', 'cancelled');
create type payment_status as enum ('pending', 'confirmed', 'rejected');

-- Create admins table
create table public.admins (
    id uuid primary key references auth.users(id) on delete cascade,
    email text unique not null,
    full_name text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create patients table
create table public.patients (
    id uuid primary key references auth.users(id) on delete cascade,
    email text unique not null,
    first_name text not null,
    last_name text not null,
    citizen_id text unique not null,
    phone text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create appointments table
create table public.appointments (
    id uuid primary key default uuid_generate_v4(),
    patient_id uuid references public.patients(id) on delete cascade not null,
    appointment_date date not null,
    appointment_time time not null,
    status appointment_status default 'scheduled' not null,
    notes text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create payments table
create table public.payments (
    id uuid primary key default uuid_generate_v4(),
    patient_id uuid references public.patients(id) on delete cascade not null,
    appointment_id uuid references public.appointments(id) on delete set null,
    payment_date timestamptz not null,
    amount decimal(10,2) not null check (amount > 0),
    platform text,
    tx_id text,
    status payment_status default 'pending' not null,
    notes text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Create availability table
create table public.availability (
    id uuid primary key default uuid_generate_v4(),
    day_of_week int not null check (day_of_week >= 0 and day_of_week <= 6),
    start_time time not null,
    end_time time not null,
    is_active boolean default true not null,
    max_appointments int default 8 not null check (max_appointments > 0),
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,

    -- Ensure start_time is before end_time
    check (start_time < end_time),

    -- Prevent overlapping time slots for the same day
    unique (day_of_week, start_time, end_time)
);

-- Create indexes for better performance
create index idx_patients_citizen_id on public.patients(citizen_id);
create index idx_patients_email on public.patients(email);
create index idx_appointments_date on public.appointments(appointment_date);
create index idx_appointments_patient_id on public.appointments(patient_id);
create index idx_payments_patient_id on public.payments(patient_id);
create index idx_payments_date on public.payments(payment_date);
create index idx_availability_day on public.availability(day_of_week);

-- Create function to automatically update updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger admins_updated_at
    before update on public.admins
    for each row execute function public.handle_updated_at();

create trigger patients_updated_at
    before update on public.patients
    for each row execute function public.handle_updated_at();

create trigger appointments_updated_at
    before update on public.appointments
    for each row execute function public.handle_updated_at();

create trigger payments_updated_at
    before update on public.payments
    for each row execute function public.handle_updated_at();

create trigger availability_updated_at
    before update on public.availability
    for each row execute function public.handle_updated_at();

-- Create helper function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
    return exists (
        select 1 from public.admins
        where id = auth.uid()
    );
end;
$$ language plpgsql security definer;

-- Create helper function to get user role
create or replace function public.get_user_role()
returns text as $$
begin
    if exists (select 1 from public.admins where id = auth.uid()) then
        return 'admin';
    elsif exists (select 1 from public.patients where id = auth.uid()) then
        return 'patient';
    else
        return 'unknown';
    end if;
end;
$$ language plpgsql security definer;

-- Enable Row Level Security
alter table public.admins enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.payments enable row level security;
alter table public.availability enable row level security;

-- RLS Policies for admins table
create policy "Admins can manage all admin records"
    on public.admins for all
    using (public.is_admin());

create policy "Users can view their own admin record"
    on public.admins for select
    using (auth.uid() = id);

-- RLS Policies for patients table
create policy "Admins can manage all patient records"
    on public.patients for all
    using (public.is_admin());

create policy "Patients can view and update their own record"
    on public.patients for select
    using (auth.uid() = id);

create policy "Patients can update their own record"
    on public.patients for update
    using (auth.uid() = id);

-- RLS Policies for appointments table
create policy "Admins can manage all appointments"
    on public.appointments for all
    using (public.is_admin());

create policy "Patients can view their own appointments"
    on public.appointments for select
    using (
        auth.uid() in (
            select id from public.patients where id = appointments.patient_id
        )
    );

-- RLS Policies for payments table
create policy "Admins can manage all payments"
    on public.payments for all
    using (public.is_admin());

create policy "Patients can view their own payments"
    on public.payments for select
    using (
        auth.uid() in (
            select id from public.patients where id = payments.patient_id
        )
    );

-- RLS Policies for availability table
create policy "Admins can manage availability"
    on public.availability for all
    using (public.is_admin());

create policy "Anyone can view availability"
    on public.availability for select
    using (is_active = true);

-- Insert default availability (Monday to Friday, 9 AM to 5 PM)
insert into public.availability (day_of_week, start_time, end_time, max_appointments)
values
    (1, '09:00:00', '17:00:00', 8), -- Monday
    (2, '09:00:00', '17:00:00', 8), -- Tuesday
    (3, '09:00:00', '17:00:00', 8), -- Wednesday
    (4, '09:00:00', '17:00:00', 8), -- Thursday
    (5, '09:00:00', '17:00:00', 8); -- Friday