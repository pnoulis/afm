async function statisticProfits(context, next) {
  const pkg = context.pkg;
  if (pkg?.cost == null) {
    throw new Error("statisticProfits requires context.pkg.cost");
  }
  let stats = context.session.global.get("stats") || {};
  stats.profits = parseInt(stats.profits ?? 0) + pkg.cost;
  context.session.global.set("stats", stats);
  if (context.session.loggedIn) {
    stats = context.session.get("stats") || {};
    stats.profits = parseInt(stats.profits ?? 0) + pkg.cost;
    context.session.set("stats", stats);
  }
  await next();
}

export { statisticProfits };
