-- ============================================================
-- Générateur de Lettre de Change (Cambiala / Traite)
-- Schéma Supabase : table, RLS et trigger de mise à jour.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Create Enum for Print Method Tracking
CREATE TYPE print_method_type AS ENUM ('FULL_A4', 'OVERLAY_PHYSICAL');

-- Create Cambialas Table
CREATE TABLE public.cambialas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date_echeance DATE NOT NULL,
    ville VARCHAR(255) NOT NULL,
    date_edition DATE DEFAULT CURRENT_DATE,
    rib VARCHAR(20) NOT NULL CHECK (length(rib) = 20),
    montant NUMERIC(15, 3) NOT NULL,
    monnaie VARCHAR(3) DEFAULT 'DT' NOT NULL,
    a_lordre_de VARCHAR(255) NOT NULL,
    payeur VARCHAR(255) NOT NULL,
    aval VARCHAR(255),
    banque VARCHAR(255) NOT NULL,
    protestable BOOLEAN DEFAULT TRUE NOT NULL,
    print_method print_method_type NOT NULL,
    offset_x NUMERIC(5,2) DEFAULT 0.00,
    offset_y NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.cambialas ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create their own records" ON public.cambialas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own records" ON public.cambialas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own records" ON public.cambialas
    FOR UPDATE USING (auth.uid() = user_id);

-- Automatic Updated_At Trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cambialas_modtime
    BEFORE UPDATE ON public.cambialas
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
