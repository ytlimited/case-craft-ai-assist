-- Add Gemini API key to edge function secrets
-- This will be handled through the Supabase dashboard

-- Update case generation to support different interaction modes
ALTER TABLE cases ADD COLUMN interaction_mode TEXT DEFAULT 'simple';
ALTER TABLE cases ADD COLUMN conversation_history JSONB DEFAULT '[]'::jsonb;

-- Update subscription plans with new features
UPDATE subscriptions SET plan = 'free' WHERE plan = 'free';
-- Add new plan features in application logic