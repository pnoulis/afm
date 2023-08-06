async function statisticActivatedPackages(context, next) {
  let stats = context.session.global.get("stats") || {};
  stats.activatedPkgs = parseInt(stats.activatedPkgs ?? 0) + 1;
  context.session.global.set("stats", stats);
  if (context.session.loggedIn) {
    stats = context.session.get("stats") || {};
    stats.activatedPkgs = parseInt(stats.activatedPkgs ?? 0) + 1;
    context.session.set("stats", stats);
  }
  await next();
}

export { statisticActivatedPackages };
