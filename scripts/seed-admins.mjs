import { createClient } from "@supabase/supabase-js";

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const supabaseUrl = required("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = required("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const admins = JSON.parse(required("ADMIN_SEED_USERS_JSON"));

if (!Array.isArray(admins) || admins.length === 0) {
  throw new Error("ADMIN_SEED_USERS_JSON must be a non-empty JSON array");
}

for (const admin of admins) {
  if (!admin?.email || !admin?.password || !admin?.username || !admin?.role) {
    throw new Error("Each admin seed record requires email, password, username, and role");
  }
}

async function provisionAdmins() {
  console.log("=== Provisioning Authorized Admin Accounts in Supabase ===");

  for (const admin of admins) {
    console.log(`\nProcessing admin: ${admin.email} (${admin.username})...`);

    // 1. Check if user already exists in auth.users
    const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error("Error listing auth users:", listError.message);
      continue;
    }

    const existingAuthUser = userList.users.find(
      (u) => u.email?.toLowerCase() === admin.email.toLowerCase()
    );

    let authUserId = existingAuthUser?.id;

    if (existingAuthUser) {
      console.log(`User exists with UID: ${authUserId}. Updating password and metadata...`);
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        authUserId,
        {
          password: admin.password,
          email_confirm: true,
          user_metadata: {
            username: admin.username,
            full_name: admin.username,
          },
        }
      );
      if (updateError) {
        console.error("Failed to update user:", updateError.message);
      } else {
        console.log("Auth user updated successfully.");
      }
    } else {
      console.log("Creating new auth user...");
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
        user_metadata: {
          username: admin.username,
          full_name: admin.username,
        },
      });

      if (createError) {
        console.error("Failed to create auth user:", createError.message);
        continue;
      }
      authUserId = created.user.id;
      console.log(`Auth user created with UID: ${authUserId}`);
    }

    // 2. Ensure user is in public.admin_users table for RLS is_admin() access
    const { data: existingAdmin, error: adminQueryError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", admin.email)
      .maybeSingle();

    if (adminQueryError) {
      console.error("Error checking public.admin_users:", adminQueryError.message);
    }

    if (existingAdmin) {
      const { error: updateAdminError } = await supabase
        .from("admin_users")
        .update({
          id: authUserId,
          full_name: admin.username,
          role: admin.role,
        })
        .eq("email", admin.email);

      if (updateAdminError) {
        console.error("Failed to update admin_users record:", updateAdminError.message);
      } else {
        console.log(`public.admin_users record updated for ${admin.email}`);
      }
    } else {
      const { error: insertAdminError } = await supabase
        .from("admin_users")
        .insert({
          id: authUserId,
          email: admin.email,
          full_name: admin.username,
          role: admin.role,
        });

      if (insertAdminError) {
        console.error("Failed to insert admin_users record:", insertAdminError.message);
      } else {
        console.log(`public.admin_users record inserted for ${admin.email}`);
      }
    }
  }

  // 3. Remove any unauthorized admin records not in the allowed list
  const allowedEmails = admins.map((a) => a.email.toLowerCase());
  const { data: allAdmins } = await supabase.from("admin_users").select("*");
  if (allAdmins) {
    for (const record of allAdmins) {
      if (!allowedEmails.includes(record.email.toLowerCase())) {
        console.log(`Removing unauthorized admin record: ${record.email}`);
        await supabase.from("admin_users").delete().eq("id", record.id);
      }
    }
  }

  console.log("\n=== Admin Provisioning Complete ===");
}

provisionAdmins().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
