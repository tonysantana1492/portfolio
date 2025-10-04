import { PROFILE } from "../src/content/profile";
import { migrateProfileToDatabase } from "../src/services/profile";

async function main() {
  try {
    console.log("Starting profile migration...");
    console.log("Profile data:", {
      id: PROFILE.id,
      name: PROFILE.displayName,
      username: PROFILE.username,
      email: PROFILE.email,
    });

    await migrateProfileToDatabase(PROFILE);

    console.log("✅ Profile migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error migrating profile:", error);
    process.exit(1);
  }
}

main();
