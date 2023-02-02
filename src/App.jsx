import "./App.css";
import mainSM from "./stateMachine/mainSM";
import { useMachine } from "@xstate/react";
import { useInterpret } from "@xstate-ninja/react";

// Interpret the machine, and add a listener for whenever a transition occurs.

function App() {
  const [parentState, send] = useMachine(mainSM);
  const child = Object.values(parentState.children)[0];
  console.log("Parent Children", parentState.children);
  console.log("Child", child);

  useInterpret(mainSM, { devTools: true })
    .onTransition((state) => {
      console.log(state.value);
    })
    .start();

  return (
    <>
      <div className="box">
        <div>{`Parent State: ${parentState?.value ?? ""}`}</div>
        <div>{`Child State: ${child?.state?.value ?? ""}`}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "10px",
          }}
        >
          <button
            onClick={() => send({ type: "step1Event", to: "step1Machine" })}
          >
            Step1
          </button>
          <button
            onClick={() => send({ type: "step2Event", to: "step2Machine" })}
          >
            Step2
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
