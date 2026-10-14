import { Module } from '@nestjs/common';
import { I_CODE_RUNNER } from './code-runner.interface';
import { DockerCodeRunnerService } from './docker-code-runner.service';

@Module({
  providers: [
    {
      provide: I_CODE_RUNNER,
      useClass: DockerCodeRunnerService,
    },
  ],
  exports: [I_CODE_RUNNER],
})
export class CodeRunnerModule {}
