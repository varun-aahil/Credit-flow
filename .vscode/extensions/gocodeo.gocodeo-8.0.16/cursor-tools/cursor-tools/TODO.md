

## Stagehand Integration Plan

**Overall Goal:** Add support for Stagehand AI browser automation with configuration for both OpenAI and Anthropic providers.

### 1. Configuration Updates

#### A. Config File Structure (`cursor-tools.config.json`)
Add new configuration sections for Stagehand and its providers:

```json
{
  "stagehand": {
    "provider": "anthropic", // or "openai"
    "timeout": 30000,
    "headless": true,
    "verbose": false,
    "debugDom": false,
    "enableCaching": true,
    "model": {
      "anthropic": "claude-3-5-sonnet-latest",
      "openai": "o3-mini"
    }
  }
}
```

#### B. Environment Variables (`.cursor-tools.env`)
Add support for provider API keys:
```
ANTHROPIC_API_KEY="your-anthropic-api-key"
OPENAI_API_KEY="your-openai-api-key"
```

### 2. Implementation Tasks

1. **Update Configuration System**
   - Modify `src/config.ts` to include new Stagehand configuration types and defaults
   - Add validation for Stagehand-specific configuration
   - Update environment variable loading to handle new API keys

2. **Update Installation Process**
   - Modify `src/commands/install.ts` to:
     - Prompt for Stagehand provider selection (OpenAI or Anthropic)
     - Collect appropriate API key based on provider
     - Set up default configuration in `cursor-tools.config.json`

3. **Stagehand Command Implementation**
   - Create `src/commands/browser/stagehand/config.ts` for Stagehand-specific configuration
   - Update `src/commands/browser/stagehand/act.ts` to:
     - Use configuration from `cursor-tools.config.json`
     - Handle provider-specific setup (API keys, models)
     - Implement proper error handling and timeout management

4. **Documentation Updates**
   - Update README.md with Stagehand configuration instructions
   - Add examples for both OpenAI and Anthropic usage
   - Document configuration options and their effects

### 3. Implementation Details

#### Configuration Loading
```typescript
interface StagehandConfig {
  provider: 'anthropic' | 'openai';
  timeout: number;
  headless: boolean;
  verbose: boolean;
  debugDom: boolean;
  enableCaching: boolean;
  model: {
    anthropic: string;
    openai: string;
  };
}

const defaultStagehandConfig: StagehandConfig = {
  provider: 'anthropic',
  timeout: 30000,
  headless: true,
  verbose: false,
  debugDom: false,
  enableCaching: true,
  model: {
    anthropic: 'claude-3-5-sonnet-latest',
    openai: 'o3-mini'
  }
};
```

#### API Key Management
- Follow existing pattern of checking both project-level and user-level .env files
- Add validation to ensure required API key is present based on selected provider
- Provide clear error messages if required keys are missing

### 4. Testing Plan

1. **Configuration Tests**
   - Test loading and validation of Stagehand configuration
   - Verify provider selection affects which API key is required
   - Test fallback to default values

2. **Integration Tests**
   - Test Stagehand initialization with both providers
   - Verify timeout handling
   - Test error scenarios (missing API keys, invalid configuration)

3. **Manual Testing**
   - Test browser automation with both providers
   - Verify configuration changes affect behavior
   - Test error handling and user feedback

### 5. Implementation Order

1. Add configuration system updates
2. Implement API key management
3. Update installation process
4. Implement Stagehand command updates
5. Add documentation
6. Add tests
7. Manual testing and refinement

### 6. Future Considerations

- Add support for provider-specific configuration options
- Consider adding provider-specific timeout settings
- Add support for custom model configurations
- Consider adding caching configuration options
- Add support for session management with Browserbase