import { storage, Store } from 'nestjs-pino/storage';
import pino from 'pino';

export function withLogCtx<T>(bindings: pino.Bindings, func: () => T): T {
  const parent = storage.getStore();
  if (parent === undefined) {
    // Ignore this case for now. A storage should always be set by LoggerModule for requests. However,
    // this case must be handled for non-request logging (like from a background service).
    return func();
  }

  const childLogger = parent.logger.child(bindings);
  const childStore = new Store(childLogger, parent.responseLogger);

  return storage.run(childStore, func);
}
