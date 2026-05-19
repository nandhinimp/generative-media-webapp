#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const argv = process.argv.slice(2);

  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;
      args[key] = val;
      if (val !== true) i++;
    }
  }

  const uid = args.uid || process.env.CLAIM_UID;
  const name = args.name || process.env.CLAIM_NAME || null;
  const image = args.image || process.env.CLAIM_IMAGE || null;
  const id = args.id || null; // optional single generation id to claim

  if (!uid && !id) {
    console.error('Usage: node scripts/claim-legacy.js --uid <UID> [--name "User Name"] [--image "https://..."]');
    console.error('Or:    node scripts/claim-legacy.js --id <GENERATION_ID> --uid <UID>');
    process.exit(1);
  }

  try {
    if (id) {
      const updated = await prisma.$executeRaw`
        UPDATE "Generation"
        SET "userId" = ${uid}, "userName" = COALESCE("userName", ${name}), "userImage" = COALESCE("userImage", ${image})
        WHERE id = ${Number(id)}
      `;

      console.log(`Updated ${updated} generation rows for id=${id}`);
    } else {
      const genUpdated = await prisma.$executeRaw`
        UPDATE "Generation"
        SET "userId" = ${uid}, "userName" = COALESCE("userName", ${name}), "userImage" = COALESCE("userImage", ${image})
        WHERE "userId" = 'legacy-user'
      `;

      const savedUpdated = await prisma.$executeRaw`
        UPDATE "SavedEdit"
        SET "userId" = ${uid}, "userName" = COALESCE("userName", ${name}), "userImage" = COALESCE("userImage", ${image})
        WHERE "userId" = 'legacy-user'
      `;

      console.log(`Updated ${genUpdated} Generation rows and ${savedUpdated} SavedEdit rows (legacy-user -> ${uid})`);
    }
  } catch (err) {
    console.error('Claim failed:', err);
    process.exit(2);
  } finally {
    await prisma.$disconnect();
  }
}

main();
