import {assign, createMachine, send} from "xstate";
import step1SM from "./step1";
import step2SM from "./step2";

const mainSM = createMachine({
  id: "main",
  initial: "idle",
  predictableActionArguments: true,
  context: {
    parentCount: 2,
  },
  states: {
    idle: {
      on: {
        step1Event: "step1",
      },
    },
    step1: {
      invoke: {
        id: "step1Machine",
        src: step1SM,
        // To forward all events from parent to child machine
        // using this method, the state doesn't get well updated in the parent
        // autoForward: true,

        // Deriving child context from parent context
        data: (context, event) => {
          console.log(context, event);
          return ({
            step1Count: context.parentCount
          })
        },

        onDone: {
          target:"step2",
          actions:assign({
          parentCount: (context, event) => {
            // event is:
            // { type: 'done.invoke.step1', data: { step1Count: 'parentCount+1' } }
            return event.data.step1Count;
          }
        })},
      },
      on: {
        step1Event: {
          actions: send("step1Event", {
            to: "step1Machine",
          }),
        },
        start: {
          actions: assign({
            parentCount: (context, _event) => context.parentCount + 1,
          }),
        },
      },
    },
    step2: {
      invoke: {
        id: "step2Machine",
        src: step2SM,
        data: (context, event) => {
          console.log(context, event);
          return ({
            step2Count: event.data.step1Count
          })
        },
        onDone: {
          target:"done",
          actions:assign({
            parentCount: (context, event) => {
              // event is:
              // { type: 'done.invoke.step2', data: { step2Count: 'step1Count+1' } }
              return event.data.step2Count;
            }
          })},
      },
      on: {
        // A different way of sending events from parent to child machine
        step2Event: {
          actions: send("step2Event", {
            to: "step2Machine",
          }),
        },
        hello: {
          actions: (context, event)=> {
            console.log('Hello Context:', context);
            console.log('Hello Event:', event);
          },
        }
      },
    },
    done: {
      type: "final",
    },
  },
});

export default mainSM;
