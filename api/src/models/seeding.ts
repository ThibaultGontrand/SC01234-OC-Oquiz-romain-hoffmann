// Échantillonnage (seeding)

import { prisma } from "./index.ts";

// Users
await prisma.user.createMany({
  data: [
    { firstname: "Alice", lastname: "Oclock", email: "alice@oclock.io", password: "Passw0rd!" },
    { firstname: "Bob", lastname: "Oclock", email: "bob@oclock.io", password: "Passw0rd!" },
  ]
});

console.log(`📊 Échantillonnage effectué avec succès.`);