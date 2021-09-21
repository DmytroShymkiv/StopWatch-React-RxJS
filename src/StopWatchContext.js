import React, { useContext, useState } from "react";
import { interval, NEVER, merge } from "rxjs";
import { map, scan, startWith, switchMap, tap } from "rxjs/operators";

const StopWatchContext = React.createContext();

export function useStopWatch() {
  return useContext(StopWatchContext);
}

export default function StopWatchProvider({ children }) {
  const initialStopWatchValue = "00:00:00";
  const [time, setTime] = useState(initialStopWatchValue);

  const convertTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substr(11, 8);

  const getStopWatchObserver = (events) =>
    merge(...events).pipe(
      startWith({ count: false, value: 0 }),
      scan((state, curr) => ({ ...state, ...curr }), {}),
      tap((v) => setTime(convertTime(v.value))),
      switchMap((state) =>
        state.count
          ? interval(1000).pipe(
              tap(() => (state.value += 1)),
              map(() => convertTime(state.value))
            )
          : NEVER
      )
    );

  const value = {
    initialStopWatchValue,
    time,
    getStopWatchObserver,
    setTime,
  };

  return (
    <StopWatchContext.Provider value={value}>
      {children}
    </StopWatchContext.Provider>
  );
}
