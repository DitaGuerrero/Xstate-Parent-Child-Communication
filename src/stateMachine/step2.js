import {createMachine, sendParent} from "xstate";

const step2SM = createMachine({
  id: "step2",
  initial: "idle",
  context: {
    step2Count:0
  },
  predictableActionArguments: true,
  states: {
    idle: {
      on: {
        step2Event: "step2_1",
        actions: sendParent('hello'),
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
      data: (context, event) => ({
        step2Count: context.step2Count + 1,
      })
    },
  },
});

export default step2SM;
