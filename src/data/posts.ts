import { BlogPost } from '../types/blog';

// Use Vite's dynamic import for markdown files
const posts = import.meta.glob('/blog-content/*.md', {
  eager: true,
  import: 'default',
  as: 'raw',
});

function extractFrontMatter(content: string) {
  // Simple front matter parser that works in browser
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    return { frontMatter: {}, content };
  }

  const frontMatterStr = match[1];
  const contentStr = match[2];

  // Parse YAML-style front matter
  const frontMatter: Record<string, any> = {};
  frontMatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      frontMatter[key.trim()] = valueParts.join(':').trim();
    }
  });

  return { frontMatter, content: contentStr };
}

function processMarkdownContent(content: string): string {
  // Fix image URLs in the content
  return content.replace(
    /(!\[.*?\]\()(.+?)(\))/g,
    (match, prefix, url, suffix) => {
      // Handle different URL formats
      if (url.startsWith('http') || url.startsWith('https')) {
        return match; // Keep absolute URLs as they are
      }
      
      // For relative paths, ensure they're properly resolved
      const cleanUrl = url.replace(/^\.?\/?/, '');
      return `${prefix}/blog-content/${cleanUrl}${suffix}`;
    }
  );
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    return Object.entries(posts).map(([path, content]) => {
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      const { frontMatter, content: markdown } = extractFrontMatter(content as string);
      const processedContent = processMarkdownContent(markdown);
      
      return {
        title: frontMatter.title || extractTitleFromMarkdown(processedContent),
        slug,
        date: frontMatter.date || new Date().toISOString(),
        content: processedContent,
        excerpt: frontMatter.excerpt || markdown.split('\n').slice(1).join('\n').substring(0, 150) + '...'
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

function extractTitleFromMarkdown(content: string): string {
  // Look for the first # heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : 'Untitled Post';
}