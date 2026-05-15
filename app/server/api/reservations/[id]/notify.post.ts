// Route déplacée vers /api/reservations/notify/[id] pour éviter les conflits Nitro
export default defineEventHandler(() => {
  throw createError({ statusCode: 404 });
});
