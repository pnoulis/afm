async function statisticLogins(context, next) {
  const login = context.user.username;
  if (!login) {
    throw new Error("statisticLogins requires context.user.username");
  }
  const stats = context.session.global.get("stats") || {};
  stats.logins ??= [];
  if (!stats.logins.find((username) => username === login)) {
    stats.logins.push(login);
  }
  context.session.global.set("stats", stats);
  await next();
}

export { statisticLogins };
