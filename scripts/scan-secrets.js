#!/usr/bin/env node

const { execFileSync, execSync } = require('child_process');

const PLACEHOLDER_VALUE = /^(your_|replace_|changeme|example|sample|dummy|<|\$\{)/i;
const SENSITIVE_ENV_KEY = /(?:SECRET|TOKEN|PASSWORD|PRIVATE_KEY|API_KEY)/i;
const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf', '.zip', '.gz', '.7z', '.mp4', '.mp3', '.woff', '.woff2'
]);

const explicitPatterns = [
  { label: 'AWS access key', regex: /AKIA[0-9A-Z]{16}/g },
  { label: 'Google API key', regex: /AIza[0-9A-Za-z\-_]{35}/g },
  { label: 'Stripe key', regex: /sk_(?:live|test)_[0-9A-Za-z]{16,}/g },
  { label: 'GitHub token', regex: /(?:ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{20,})/g },
  { label: 'Resend API key', regex: /re_[A-Za-z0-9_]{20,}/g },
  { label: 'Private key block', regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g }
];

const getStagedFiles = () => {
  const output = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' }).trim();
  if (!output) return [];
  return output.split(/\r?\n/).filter(Boolean);
};

const isBinaryPath = (filePath) => {
  const dot = filePath.lastIndexOf('.');
  if (dot === -1) return false;
  return BINARY_EXTENSIONS.has(filePath.slice(dot).toLowerCase());
};

const getStagedContent = (filePath) => {
  try {
    return execFileSync('git', ['show', `:${filePath}`], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });
  } catch {
    return '';
  }
};

const findEnvAssignmentSecrets = (content) => {
  const findings = [];
  const lines = content.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)\s*$/);
    if (!match) continue;

    const key = match[1];
    let value = match[2].trim();
    if (!SENSITIVE_ENV_KEY.test(key)) continue;

    value = value.replace(/^['\"]|['\"]$/g, '');
    if (!value || PLACEHOLDER_VALUE.test(value)) continue;

    findings.push({
      line: index + 1,
      label: `Sensitive env assignment (${key})`
    });
  }

  return findings;
};

const findPatternSecrets = (content) => {
  const findings = [];
  const lines = content.split(/\r?\n/);

  for (let lineNumber = 0; lineNumber < lines.length; lineNumber += 1) {
    const line = lines[lineNumber];

    for (const pattern of explicitPatterns) {
      pattern.regex.lastIndex = 0;
      if (pattern.regex.test(line)) {
        findings.push({ line: lineNumber + 1, label: pattern.label });
      }
    }
  }

  return findings;
};

const main = () => {
  const stagedFiles = getStagedFiles();
  if (stagedFiles.length === 0) {
    process.exit(0);
  }

  const allFindings = [];

  for (const filePath of stagedFiles) {
    if (isBinaryPath(filePath)) continue;

    const content = getStagedContent(filePath);
    if (!content) continue;

    const findings = [
      ...findPatternSecrets(content),
      ...findEnvAssignmentSecrets(content)
    ];

    if (findings.length > 0) {
      allFindings.push({ filePath, findings });
    }
  }

  if (allFindings.length === 0) {
    process.exit(0);
  }

  console.error('\n[pre-commit] Potential secrets detected in staged changes:\n');
  for (const fileResult of allFindings) {
    for (const finding of fileResult.findings) {
      console.error(`- ${fileResult.filePath}:${finding.line} -> ${finding.label}`);
    }
  }

  console.error('\nCommit blocked. Remove secrets or move them to ignored env files.');
  process.exit(1);
};

main();
