-- Aggiungi le colonne per la verifica degli utenti se non esistono già
DO $$
BEGIN
    -- Verifica se la colonna documentUrl esiste
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'documentUrl') THEN
        ALTER TABLE "User" ADD COLUMN "documentUrl" TEXT;
    END IF;

    -- Verifica se la colonna documentType esiste
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'documentType') THEN
        ALTER TABLE "User" ADD COLUMN "documentType" TEXT;
    END IF;

    -- Verifica se la colonna verificationNotes esiste
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'verificationNotes') THEN
        ALTER TABLE "User" ADD COLUMN "verificationNotes" TEXT;
    END IF;
END
$$;
