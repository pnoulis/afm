import { Scheduler } from "./Scheduler.js";

function Action(action) {
  const schedule = new Scheduler();
  const __action = function (options) {
    return schedule.run(action, options);
  };
  Object.setPrototypeOf(__action, schedule);
  return __action;
}

export { Action };
