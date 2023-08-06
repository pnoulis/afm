import { CLIENT_STORAGE_GLOBAL_SESSION_ID } from "agent_factory.shared/constants.js";

async function saveSession(context, next) {
  if (context.globalClientSession) {
    const gsession = context.afmachine.services.storage.global.get(
      CLIENT_STORAGE_GLOBAL_SESSION_ID,
    );

    for (const [k, v] of Object.entries(context.globalClientSession)) {
      gsession[k] = {
        ...gsession[k],
        ...v,
      };
    }

    context.afmachine.services.storage.global.set(
      CLIENT_STORAGE_GLOBAL_SESSION_ID,
      {
        ...gsession,
      },
    );
  }
  if (context.userClientSession) {
    context.afmachine.services.storage.persistent.drop();
    context.afmachine.services.storage.global.set(
      context.afmachine.services.storage.sessionId,
      context.userClientSession,
    );
  }
  await next();
}

export { saveSession };
