async function statisticRegisteredPlayers(context, next) {
  let stats = context.session.global.get("stats") || {};
  stats.registeredPlayers = parseInt(stats.registeredPlayers ?? 0) + 1;
  context.session.global.set("stats", stats);
  if (context.session.loggedIn) {
    stats = context.session.get("stats") || {};
    stats.registeredPlayers = parseInt(stats.registeredPlayers ?? 0) + 1;
    context.session.set("stats", stats);
  }
  await next();
}

export { statisticRegisteredPlayers };
