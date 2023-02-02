import { createMachine } from "xstate";

const step2SM = createMachine({
  id: "step2",
  initial: "idle",
  predictableActionArguments: true,
  states: {
    idle: {
      on: {
        step2Event: "step2_1",
      },
    },
    step2_1: {
      on: {
        step2Event: "step2_2",
      },
    },
    step2_2: {
      on: {
        step2Event: "done",
      },
    },
    done: {
      type: "final",
    },
  },
});

export default step2SM;
