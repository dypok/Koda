export interface ExecuteCodeRequest {
  code: string;
  language: string;
  testCases?: Array<{
    input?: string;
    expectedOutput: string;
  }>;
  timeoutMs?: number;
}

export interface ExecuteCodeResponse {
  success: boolean;
  output: string;
  error?: string;
  executionTimeMs: number;
  testResults?: Array<{
    passed: boolean;
    input?: string;
    expected: string;
    actual: string;
  }>;
}

export const I_CODE_RUNNER = Symbol('I_CODE_RUNNER');

export interface ICodeRunner {
  execute(request: ExecuteCodeRequest): Promise<ExecuteCodeResponse>;
}
