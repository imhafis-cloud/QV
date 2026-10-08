// Supabase connection for the contact form.
// Both values are safe to publish: the anon key can only INSERT into callback_requests (see supabase/schema.sql).
// Never put the service_role key here.
window.QV_CONFIG = {
  supabaseUrl: "",      // e.g. https://abcdxyz.supabase.co
  supabaseAnonKey: ""   // Project Settings > API > anon public key
};
