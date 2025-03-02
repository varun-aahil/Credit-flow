import type { CommandMap } from '../types.ts';
import { WebCommand } from './web.ts';
import { RepoCommand } from './repo.ts';
import { InstallCommand } from './install.ts';
import { DocCommand } from './doc.ts';
import { GithubCommand } from './github.ts';
import { BrowserCommand } from './browser/browserCommand.ts';

export const commands: CommandMap = {
  web: new WebCommand(),
  repo: new RepoCommand(),
  install: new InstallCommand(),
  doc: new DocCommand(),
  github: new GithubCommand(),
  browser: new BrowserCommand(),
};
