import { CLIENT_STORAGE_GLOBAL_SESSION_ID } from "agent_factory.shared/constants.js";

async function parseSession(context, next) {
  context.globalClientSession = null;
  context.userClientSession = null;

  // get the globalClientSession
  context.globalClientSession = context.afmachine?.services.storage.global?.get(
    CLIENT_STORAGE_GLOBAL_SESSION_ID,
  );

  if (context.globalClientSession) {
    context.globalClientSession.stats ??= {};
    // make sure the client Session includes all the expected propreties
  }

  // get the userClientSession
  const sessionId =
    context.afmachine.services?.storage.global?.get("sessionId");
  if (sessionId && sessionId !== CLIENT_STORAGE_GLOBAL_SESSION_ID) {
    context.userClientSession = context.afmachine.services.storage.get();
    context.userClientSession.stats ??= {};
  }

  await next();
}

export { parseSession };
