// =============================================================================
// SUPABASE CONFIGURATION
// =============================================================================
// You can enter your Supabase Project credentials below, OR enter them directly
// in the application under "Database Settings" modal (persisted in LocalStorage).
//
// To get your credentials:
// 1. Log in to https://app.supabase.com
// 2. Select your project -> Project Settings -> API
// 3. Copy Project URL and 'anon' public API Key.
// =============================================================================

window.SUPABASE_CONFIG = {
    // If you prefer hardcoding them into the project repository, put them here:
    url: localStorage.getItem("SB_URL") || "",
    anonKey: localStorage.getItem("SB_KEY") || ""
};
