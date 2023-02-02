import { assign, createMachine, send } from "xstate";
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
        // data: {
        //   count: (context, event) => context.parentCount,
        // },
        onDone: "step2",
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
        onDone: "done",
      },
      on: {
        // A different way of sending events from parent to child machine
        step2Event: {
          actions: send("step2Event", {
            to: "step2Machine",
          }),
        },
      },
    },
    done: {
      type: "final",
    },
  },
});

export default mainSM;
