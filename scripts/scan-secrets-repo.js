#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

const isEnvLikeFile = (filePath) => {
  const normalized = filePath.replace(/\\/g, '/').toLowerCase();
  const fileName = normalized.split('/').pop() || '';
  return fileName === '.env' || fileName.startsWith('.env.') || fileName.endsWith('.env') || fileName.endsWith('.env.example');
};

const getTrackedFiles = () => {
  const output = execSync('git ls-files', { encoding: 'utf8' }).trim();
  if (!output) return [];
  return output.split(/\r?\n/).filter(Boolean);
};

const isBinaryPath = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  return BINARY_EXTENSIONS.has(extension);
};

const readText = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
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

    findings.push({ line: index + 1, label: `Sensitive env assignment (${key})` });
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
  const files = getTrackedFiles();
  const allFindings = [];

  for (const filePath of files) {
    if (isBinaryPath(filePath)) continue;

    const content = readText(filePath);
    if (!content) continue;

    const envFindings = isEnvLikeFile(filePath) ? findEnvAssignmentSecrets(content) : [];
    const findings = [...findPatternSecrets(content), ...envFindings];

    if (findings.length > 0) {
      allFindings.push({ filePath, findings });
    }
  }

  if (allFindings.length === 0) {
    console.log('No obvious secrets found in tracked files.');
    process.exit(0);
  }

  console.error('\nPotential secrets detected:\n');
  for (const fileResult of allFindings) {
    for (const finding of fileResult.findings) {
      console.error(`- ${fileResult.filePath}:${finding.line} -> ${finding.label}`);
    }
  }

  console.error('\nSecurity scan failed. Remove secrets from repository content.');
  process.exit(1);
};

main();
