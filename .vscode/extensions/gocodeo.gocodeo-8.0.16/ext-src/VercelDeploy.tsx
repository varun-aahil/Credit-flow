// import * as vscode from 'vscode';
// import { execSync } from 'child_process';
// import * as fs from 'fs';
// import * as path from 'path';

// export class VercelDeploymentManager {
//   private VERCEL_TOKEN = 'Ye49fQHCFXCt5SdqlI9fgYae';
  
//   async detectProjectType(projectPath: string) {
//     console.log("Detecting project type...");
//     // Detect framework based on project structure
//     const frameworkDetectors = [
//       { 
//         name: 'React', 
//         check: () => fs.existsSync(path.join(projectPath, 'package.json')) && 
//                     fs.readFileSync(path.join(projectPath, 'package.json'), 'utf8').includes('react')
//       },
//       { 
//         name: 'Vue', 
//         check: () => fs.existsSync(path.join(projectPath, 'package.json')) && 
//                     fs.readFileSync(path.join(projectPath, 'package.json'), 'utf8').includes('vue')
//       },
//       // Add more framework detectors
//     ];

//     return frameworkDetectors.find(framework => framework.check())?.name || 'static';
//   }

//   async prepareDeploymentPackage(projectPath: string) {
//     console.log("Preparing deployment package...");
//     const frameworkType = await this.detectProjectType(projectPath);
    
//     // Framework-specific build steps
//     const buildCommands = {
//       'React': 'npm run build',
//       'Vue': 'npm run build',
//       'static': 'echo "No build step required"'
//     };

//     // Execute build command
//     execSync(buildCommands[frameworkType], { cwd: projectPath });

//     // Return build directory
//     return path.join(projectPath, 'build' || 'dist');
//   }

//   async deployToVercel(projectPath: string) {
//     console.log("Deploying to Vercel...");
//     const buildDir = await this.prepareDeploymentPackage(projectPath);

//     try {
//       // Use Vercel CLI programmatically
//       const deployCommand = [
//         `npx vercel deploy ${buildDir}`,
//         `--token=${this.VERCEL_TOKEN}`,
//         '--yes', // Automatic confirmation
//         '--name=vscode-project-deployment'
//       ].join(' ');

//       const deploymentOutput = execSync(deployCommand, { 
//         cwd: projectPath,
//         encoding: 'utf8'
//       });

//       // Extract deployment URL
//       const deploymentUrl = deploymentOutput.match(/https:\/\/[^\s]+/)?.[0];

//       return deploymentUrl;
//     } catch (error) {
//       vscode.window.showErrorMessage('Deployment failed');
//       console.error(error);
//       return null;
//     }
//   }

//   async copyDeploymentUrlToClipboard(url: string) {
//     await vscode.env.clipboard.writeText(url);
//     vscode.window.showInformationMessage('Deployment URL copied to clipboard!');
//   }
// }

// export default VercelDeploymentManager;