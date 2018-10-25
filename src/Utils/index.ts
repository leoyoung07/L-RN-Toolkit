import { spawn, SpawnOptions } from 'child_process';
export function shellCommand(
  cmd: string,
  args?: ReadonlyArray<string>,
  options?: SpawnOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const childProcess = spawn(cmd, args, options);
      let output = '';
      childProcess.stdout.on('data', data => {
        output += data;
      });
      childProcess.stderr.on('data', err => {
        reject(err);
      });
      childProcess.on('close', code => {
        resolve(output);
      });
    } catch (error) {
      reject(error);
    }
  });
}
