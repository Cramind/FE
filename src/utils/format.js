export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export const isContentTruncated = (content) => {
  if (!content) return false;
  const lines = content.split("\n").length;
  const length = content.length;
  return lines > 3 || length > 200;
};

export const formatMarkdown = (text) => {
  if (!text) return "";

  return text
    .replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      '<pre class="code-block"><code>$2</code></pre>'
    )
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(
      /$begin:math:display$([^$end:math:display$]+)\]$begin:math:text$([^)]+)$end:math:text$/g,
      '<a href="$2" class="link" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    .replace(/^### (.*$)/gm, '<h3 class="heading-3">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="heading-2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="heading-1">$1</h1>')
    .replace(/^- (.*$)/gm, '<li class="list-item">$1</li>')
    .replace(/^\* (.*$)/gm, '<li class="list-item">$1</li>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")
    .replace(/^(.*)$/, "<p>$1</p>");
};
