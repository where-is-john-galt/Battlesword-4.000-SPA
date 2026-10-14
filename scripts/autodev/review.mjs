export function parseReview(response) {
  for (let start = response.indexOf('{'); start >= 0; start = response.indexOf('{', start + 1)) {
    let depth = 0;
    let quoted = false;
    let escaped = false;
    for (let end = start; end < response.length; end++) {
      const character = response[end];
      if (quoted) {
        if (escaped) escaped = false;
        else if (character === '\\') escaped = true;
        else if (character === '"') quoted = false;
        continue;
      }
      if (character === '"') quoted = true;
      else if (character === '{') depth++;
      else if (character === '}' && --depth === 0) {
        try {
          const parsed = JSON.parse(response.slice(start, end + 1));
          if (['pass', 'fail'].includes(parsed.status) && Array.isArray(parsed.findings))
            return parsed;
        } catch {
          // Try a later object; prose may contain non-JSON brace examples.
        }
        break;
      }
    }
  }
  throw new Error('Reviewer final response does not contain a valid review JSON object');
}
