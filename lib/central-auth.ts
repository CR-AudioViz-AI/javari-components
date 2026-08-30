/**
 * CR AudioViz AI - Central Authentication Client
 * 
 * ALL APPS must use this for authentication.
 * Connects to craudiovizai.com central auth service.
 * 
 * Usage:
 *   import { signIn, signOut, getSession, useAuth } from '@/lib/central-auth';
 *   
 * @author CR AudioViz AI
 * @created December 25, 2025
 * @standard Henderson Standard v2.0
 */

import { createClient } from '@supabase/supabase-js';
import { publishableKey, supabaseUrl } from "@craudioviz/platform-sdk";

// Central Supabase instance - ALL apps connect here
const SUPABASE_URL = supabaseUrl();
const SUPABASE_ANON_KEY = publishableKey();

// Create single shared Supabase client
// Lazy singleton — prevents build-time crash when env vars are absent
let _supabase: ReturnType<typeof createClient> | null = null;
function _getClient() {
  if (!_supabase) _supabase = createClient(
    supabaseUrl() || SUPABASE_URL,
    publishableKey() || SUPABASE_ANON_KEY
  );
  return _supabase;
}
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_t, prop) { return (_getClient() as any)[prop as string]; }
});

// App identifier - set this in each app's env
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'unknown';

/**
 * Sign in with email/password
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (data.user) {
    await trackUserActivity(data.user.id, 'sign_in');
  }
  
  return { data, error };
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(provider: 'google' | 'github' | 'discord' | 'twitter' | 'facebook' | 'linkedin' | 'twitch') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  return { data, error };
}

/**
 * Sign up new user
 */
export async function signUp(email: string, password: string, metadata?: { full_name?: string }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  
  if (data.user) {
    // Track first app they signed up from
    await updateUserProfile(data.user.id, {
      first_seen_app: APP_ID,
      apps_used: [APP_ID],
    });
    await trackUserActivity(data.user.id, 'sign_up');
  }
  
  return { data, error };
}

/**
 * Sign out
 */
export async function signOut() {
  const session = await getSession();
  if (session?.user) {
    await trackUserActivity(session.user.id, 'sign_out');
  }
  
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get current session
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get current user
 */
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Update user profile in central CRM
 */
export async function updateUserProfile(userId: string, updates: {
  full_name?: string;
  avatar_url?: string;
  first_seen_app?: string;
  last_active_app?: string;
  apps_used?: string[];
}) {
  // Add current app to apps_used if not already there
  if (updates.apps_used === undefined) {
    // 2026-08-29: the result is annotated because this Supabase client is created
    // WITHOUT generated Database types, so every .select() resolves to `never` and
    // any property access on it is TS2339. That is a typing gap, not a data one.
    //
    // The data gap was real and separate: profiles.apps_used DID NOT EXIST. This
    // code has read and written it since it was written — the read returned nothing
    // and the write would have been rejected by PostgREST. The column was added on
    // 2026-08-29 with a comment recording that.
    //
    // Found only because this repo had no tsconfig.json at all, so its 22
    // TypeScript files had NEVER been checked. It reported zero errors, which reads
    // as clean and meant the opposite.
    const { data: profile } = await supabase
      .from('profiles')
      .select('apps_used')
      .eq('id', userId)
      .single<{ apps_used: string[] | null }>();

    const currentApps = profile?.apps_used ?? [];
    if (!currentApps.includes(APP_ID)) {
      updates.apps_used = [...currentApps, APP_ID];
    }
  }
  
  // Always update last_active_app
  updates.last_active_app = APP_ID;
  
  // 2026-08-29: cast because this client is built WITHOUT generated Database
  // types, so every table resolves to `never` and any object literal is TS2353.
  //
  // The real defect underneath was profiles.last_active_app NOT EXISTING. Line 159
  // above sets it on EVERY sign-in, so this upsert named a column PostgREST would
  // reject — meaning sign-in tracking has never worked for any app using this
  // library. Verified against the live database, then added 2026-08-29 with a
  // column comment recording the history. apps_used was missing the same way.
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...updates,
      updated_at: new Date().toISOString(),
    } as never);
  
  return { error };
}

/**
 * Track user activity for CRM
 */
async function trackUserActivity(userId: string, action: string) {
  try {
    // 2026-08-29: same untyped-client cast. UNLIKE the profiles upsert above, the
    // shape here is CORRECT — activity_logs really does carry user_id, app_id,
    // action and metadata, checked against the live schema rather than assumed.
    // Only the compiler was missing the schema.
    await supabase.from('activity_logs').insert({
      user_id: userId,
      app_id: APP_ID,
      action,
      metadata: {
        url: typeof window !== 'undefined' ? window.location.href : null,
        timestamp: new Date().toISOString(),
      },
    } as never);
  } catch (e) {
    console.error('Failed to track activity:', e);
  }
}

/**
 * Hook to track page views and update user activity
 */
export function useTrackActivity() {
  if (typeof window === 'undefined') return;
  
  // Update last_active_app when user visits
  getSession().then(session => {
    if (session?.user) {
      updateUserProfile(session.user.id, {});
    }
  });
}

export default {
  supabase,
  signInWithEmail,
  signInWithOAuth,
  signUp,
  signOut,
  getSession,
  getUser,
  updateUserProfile,
  useTrackActivity,
};
