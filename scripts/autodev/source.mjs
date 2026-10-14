const isSourceFile = (path) => /\.md$/i.test(path) || ['manifest.me', 'TODO'].includes(path);

export function sourceFilesFromGitOutput(output) {
  return output.split('\n').filter(Boolean).filter(isSourceFile);
}

export function sourceChangesFromGitOutput(output) {
  return output
    .split('\n')
    .filter(Boolean)
    .flatMap((line) => {
      const [status, first, second] = line.split('\t');
      const paths = status.startsWith('R') ? [first, second] : [first];
      return paths.filter(isSourceFile).map((path) => ({ path, change: status }));
    });
}
