/**
 * Checks if Playwright is available and returns its version information
 * @returns Object containing availability status and version info
 */
export async function checkPlaywright(): Promise<{
  available: boolean;
  version?: string;
  error?: string;
}> {
  try {
    // Try to dynamically import playwright
    const playwright = await import('playwright');
    if (!playwright) {
      return { available: false, error: 'Playwright package not found' };
    }

    // Get Playwright version by checking if it's installed
    try {
      // This will throw if playwright is not installed
      await import('playwright');
      return { available: true, version: 'installed' };
    } catch (importError) {
      if (importError instanceof Error) {
        if (importError.message.includes('Cannot find package')) {
          return {
            available: false,
            error: 'Playwright is not installed. Please install it using: npm install playwright',
          };
        }
        return { available: false, error: importError.message };
      }
      return { available: false, error: 'Unknown error while importing Playwright' };
    }
  } catch (error) {
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes('Cannot find package')) {
        return {
          available: false,
          error: 'Playwright is not installed. Please install it using: npm install playwright',
        };
      }
      return { available: false, error: error.message };
    }
    return { available: false, error: 'Unknown error while checking Playwright' };
  }
}

/**
 * Ensures Playwright is available before proceeding
 * @returns true if Playwright is available, throws error if not
 */
export async function ensurePlaywright(): Promise<boolean> {
  const { available, version, error } = await checkPlaywright();

  if (!available) {
    throw new Error(
      `Playwright is required for browser commands but is not available.\n` +
        `Error: ${error}\n` +
        `Please install Playwright using one of these commands:\n` +
        `  npm install playwright\n` +
        `  yarn add playwright\n` +
        `  pnpm add playwright`
    );
  }

  if (version) {
    console.log(`Using Playwright: ${version}`);
  }
  return true;
}
