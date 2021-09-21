import React, { useState, useRef, useEffect } from "react";
import { fromEvent, debounceTime, buffer, filter } from "rxjs";
import { mapTo, tap } from "rxjs/operators";
import { useStopWatch } from "./StopWatchContext";

export default function StopWatch() {
  const { initialStopWatchValue, time, getStopWatchObserver, setTime } =
    useStopWatch();
  const [isCounting, setIsCounting] = useState(false);

  const startRef = useRef();
  const stopRef = useRef();
  const restartRef = useRef();
  const waitRef = useRef();

  useEffect(() => {
    const startClick$ = fromEvent(startRef.current, "click").pipe(
      mapTo({ count: true }),
      tap(() => setIsCounting(true))
    );
    const stopClick$ = fromEvent(stopRef.current, "click").pipe(
      mapTo({ count: false, value: 0 }),
      tap(() => {
        setIsCounting(false);
      })
    );
    const restartClick$ = fromEvent(restartRef.current, "click").pipe(
      mapTo({ value: 0 })
    );
    const waitClick$ = fromEvent(waitRef.current, "click");
    const doubleClick$ = waitClick$
      .pipe(
        buffer(waitClick$.pipe(debounceTime(300))),
        filter((clicks) => clicks.length === 2)
      )
      .pipe(
        mapTo({ count: false }),
        tap(() => setIsCounting(false))
      );

    const events = [startClick$, stopClick$, restartClick$, doubleClick$];
    const stopWatch$ = getStopWatchObserver(events);

    const stopWatchSubscription$ = stopWatch$.subscribe(setTime);
    return () => stopWatchSubscription$.unsubscribe();
  }, []);

  return (
    <div className="container">
      <h1>{time}</h1>
      <div className="buttons-container">
        <button className="secondary-button wait-button" ref={waitRef}>
          WAIT
        </button>
        <button
          className="main-button start-button"
          style={{ display: !isCounting ? "block" : "none" }}
          ref={startRef}
        >
          Start
        </button>
        <button
          className="main-button stop-button"
          style={{ display: isCounting ? "block" : "none" }}
          onClick={() => setTime(initialStopWatchValue)}
          ref={stopRef}
        >
          Stop
        </button>
        <button className="secondary-button restart-button" ref={restartRef}>
          RESTART
        </button>
      </div>
    </div>
  );
}
