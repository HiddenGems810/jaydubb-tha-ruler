type SupabaseEnvironment = Partial<
  Record<
    | "NEXT_PUBLIC_SUPABASE_URL"
    | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    | "SUPABASE_SERVICE_ROLE_KEY",
    string
  >
>;

function runtimeEnvironment(): SupabaseEnvironment {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

function required(environment: SupabaseEnvironment, name: keyof SupabaseEnvironment): string {
  const value = environment[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabasePublicEnv(environment = runtimeEnvironment()) {
  return {
    url: required(environment, "NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: required(environment, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function getSupabaseServiceEnv(environment = runtimeEnvironment()) {
  return {
    ...getSupabasePublicEnv(environment),
    serviceRoleKey: required(environment, "SUPABASE_SERVICE_ROLE_KEY"),
  };
}
