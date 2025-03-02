import type { Command, CommandGenerator } from '../../types.ts';
import { loadEnv } from '../../config.ts';
import { getRepoContext, type GithubOptions } from './utils.ts';
import { getGitHubHeaders, isGitHubCliAvailable, getGitCredentials } from './githubAuth.ts';

export class IssueCommand implements Command {
  constructor() {
    loadEnv(); // Load environment variables for potential future API key needs
  }

  private async fetchComments(owner: string, repo: string, issueNumber: number): Promise<any[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
    try {
      const response = await fetch(url, {
        headers: getGitHubHeaders(),
      });

      if (!response.ok) {
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  private formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString();
  }

  async *execute(query: string, options?: GithubOptions): CommandGenerator {
    const repoContext = await getRepoContext(options);
    if (!repoContext) {
      yield 'Could not determine repository context. Please run this command inside a GitHub repository, or specify the repository with --from-github owner/repo or --repo owner/repo.';
      return;
    }
    const { owner, repo } = repoContext;

    // Check if we have GitHub authentication
    const credentials = getGitCredentials();
    if (!process.env.GITHUB_TOKEN && !isGitHubCliAvailable() && !credentials) {
      yield 'Note: No GitHub authentication found. Using unauthenticated access (rate limits apply).\n';
      yield 'To increase rate limits, either:\n';
      yield '1. Set GITHUB_TOKEN in your environment\n';
      yield '2. Install and login to GitHub CLI (gh)\n';
      yield '3. Configure git credentials for github.com\n\n';
    }

    const issueNumber = parseInt(query, 10); // Try to parse an issue number

    let url: string;
    if (isNaN(issueNumber)) {
      url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&sort=created&direction=desc&per_page=10`;
    } else {
      url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;
    }

    try {
      const response = await fetch(url, {
        headers: getGitHubHeaders(),
      });

      if (!response.ok) {
        yield `GitHub API Error: ${response.status} - ${response.statusText}`;
        if (response.status === 404) {
          yield `  (Issue ${issueNumber} not found or repository is private without authentication)`;
        } else if (
          response.status === 403 &&
          response.headers.get('x-ratelimit-remaining') === '0'
        ) {
          yield '\nRate limit exceeded. To increase rate limits, either:\n';
          yield '1. Set GITHUB_TOKEN in your environment\n';
          yield '2. Install and login to GitHub CLI (gh)\n';
        }
        return;
      }

      const data = await response.json();

      if (isNaN(issueNumber)) {
        // Listing issues
        if (data.length === 0) {
          yield 'No open issues found.';
          return;
        }
        for (const issue of data) {
          yield `#${issue.number}: ${issue.title} by ${issue.user.login} (${issue.html_url})\n`;
        }
      } else {
        // Single issue with full discussion
        const issue = data;

        // Issue header
        yield `#${issue.number}: ${issue.title}\n`;
        yield `State: ${issue.state}\n`;
        yield `URL: ${issue.html_url}\n\n`;

        // Original post
        yield `## Original Post\n`;
        yield `**@${issue.user.login}** opened this issue on ${this.formatDate(issue.created_at)}\n\n`;
        yield `${issue.body || 'No description provided.'}\n\n`;

        // Comments
        const comments = await this.fetchComments(owner, repo, issueNumber);
        if (comments.length > 0) {
          yield `## Discussion (${comments.length} comments)\n`;
          for (const comment of comments) {
            yield `\n---\n`;
            yield `**@${comment.user.login}** commented on ${this.formatDate(comment.created_at)}\n\n`;
            yield `${comment.body || 'No content'}\n`;
          }
        } else {
          yield `\nNo comments yet.\n`;
        }

        // Issue metadata
        yield `\n---\n`;
        yield `Labels: ${issue.labels.map((l: any) => l.name).join(', ') || 'None'}\n`;
        if (issue.assignees?.length > 0) {
          yield `Assignees: ${issue.assignees.map((a: any) => '@' + a.login).join(', ')}\n`;
        }
        if (issue.milestone) {
          yield `Milestone: ${issue.milestone.title}\n`;
        }
      }
    } catch (error) {
      yield `Error fetching issues: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}
