import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

type AnyClient = SupabaseClient<any>;
export type Ctx = {
  supabase: AnyClient;
  supabaseAdmin: AnyClient;
  userClaims: { id: string; role?: string; email?: string; appMetadata?: any; userMetadata?: any } | null;
  jwtClaims: Record<string, any> | null;
  authMode: string;
};

class CtxError extends Error {
  status: number;
  constructor(message: string, status: number = 401) {
    super(message);
    this.status = status;
    this.name = "CtxError";
  }
}

function parseCookies(request: Request): { name: string; value: string }[] {
  const header = request.headers.get("cookie") || "";
  if (!header) return [];
  return header
    .split(";")
    .map((c) => {
      const eq = c.indexOf("=");
      if (eq === -1) return null;
      return { name: c.slice(0, eq).trim(), value: c.slice(eq + 1).trim() };
    })
    .filter(Boolean) as { name: string; value: string }[];
}

export async function createSupabaseContext(request: Request, opts?: any) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const authMode = opts?.auth ?? "user";

  const requestCookies = parseCookies(request);
  const responseCookies: { name: string; value: string; options?: any }[] = [];

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return requestCookies;
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((c) => responseCookies.push(c));
      },
    },
  });

  if (authMode === "none") {
    const supabaseAdmin = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    return {
      data: {
        supabase: supabase as AnyClient,
        supabaseAdmin: supabaseAdmin as AnyClient,
        userClaims: null,
        jwtClaims: null,
        authMode: "none",
        _responseCookies: responseCookies,
      },
      error: null,
    };
  }

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { data: null, error: error || new CtxError("Unauthorized") };
  }

  const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const userClaims = {
    id: user.id,
    role: user.role,
    email: user.email,
    appMetadata: user.app_metadata,
    userMetadata: user.user_metadata,
  };

  return {
    data: {
      supabase: supabase as AnyClient,
      supabaseAdmin: supabaseAdmin as AnyClient,
      userClaims,
      jwtClaims: null,
      authMode: "user",
      _responseCookies: responseCookies,
    },
    error: null,
  };
}

export function withSupabase(config: any, handler: (req: Request, ctx: Ctx) => Promise<Response>) {
  return async (request: Request) => {
    const { data: ctx, error } = await createSupabaseContext(request, config);
    if (error || !ctx) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const response = await handler(request, ctx);
    const rc = (ctx as any)._responseCookies as { name: string; value: string; options?: any }[];
    if (rc && rc.length > 0) {
      const headers = new Headers(response.headers);
      for (const c of rc) {
        headers.append("Set-Cookie", `${c.name}=${c.value}; Path=/; HttpOnly; SameSite=Lax; Secure`);
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
    return response;
  };
}
