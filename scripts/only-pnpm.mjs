// Bloquea instalaciones con npm/yarn: el lockfile y las políticas de seguridad son de pnpm.
const userAgent = process.env.npm_config_user_agent ?? "";

if (!userAgent.startsWith("pnpm/")) {
  console.error("\nEste proyecto usa pnpm. Ejecuta: pnpm install\n");
  process.exit(1);
}
