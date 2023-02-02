import { createMachine, sendUpdate } from "xstate";

const step1SM = createMachine({
  id: "step1",
  initial: "idle",
  predictableActionArguments: true,
  context: {
    count: 0,
  },
  states: {
    idle: {
      on: {
        step1Event: {
          target: "step1_1",
          actions: sendUpdate(),
        },
      },
    },
    step1_1: {
      on: {
        step1Event: "step1_2",
      },
    },
    step1_2: {
      on: {
        step1Event: "step1_3",
      },
    },
    step1_3: {
      on: {
        step1Event: "done",
      },
    },
    done: {
      type: "final",
    },
  },
});

export default step1SM;
