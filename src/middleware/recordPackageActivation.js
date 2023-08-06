async function recordPackageActivation(context, next) {
  const npkgs = context.session.get("npkgs") ?? 0;
  context.session.set("npkgs", npkgs + 1);
  await next();
}

export { recordPackageActivation };
