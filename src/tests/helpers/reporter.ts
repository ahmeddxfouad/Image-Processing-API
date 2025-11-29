// src/tests/helpers/reporter.ts

// eslint-disable-next-line no-redeclare
/* global jasmine */

import { DisplayProcessor, SpecReporter, StacktraceOption } from 'jasmine-spec-reporter';

class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(info: jasmine.SuiteInfo, log: string): string {
    return `${log}`;
  }
}

// Use the global env safely (works whether 'jasmine' is declared or not)
const env = (globalThis as any).jasmine?.getEnv?.() ?? jasmine.getEnv();

env.clearReporters();
env.addReporter(
  new SpecReporter({
    spec: { displayStacktrace: StacktraceOption.NONE },
    customProcessors: [CustomProcessor],
  }),
);
