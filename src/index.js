import { loggerService, backendService, storageService } from "./services/index.js";


// storageService.set('agent_factory');
// const res = storageService.get('agent_factory');

// function getCurrentWindowTabs() {
//   return browser
// }

/*
  WINDOW LIFE CYCLE

  active
  - a page is in the active state if it is visible and has input focus
  passive
  - a page is in the passive state if it is visible and does not have niptu focus
 */

// const b = storageService.setc('yolo', 2);
// storageService.setc('ego', "piga");
// const c = storageService.getc();
// console.log(c);
storageService.setp('one', 'two');
console.log(storageService.getp());
storageService.setp('three', 'four')
console.log(storageService.getp());
storageService.rmp('four');
console.log(storageService.getp());
storageService.cp();
console.log(storageService.getp());
storageService.start();

// const d = storageService.getp();
// console.log(d);


const Afmachine = {};

export { Afmachine };
