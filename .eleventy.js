module.exports = function(eleventyConfig) {
  // Require Prism.js for syntax highlighting
  const Prism = require("prismjs");
  // Load Prism components for additional languages
  require("prismjs/components/prism-javascript");
  require("prismjs/components/prism-css");
  require("prismjs/components/prism-json");
  require("prismjs/components/prism-bash");
  require("prismjs/components/prism-markdown");
  require("prismjs/components/prism-rust");
  require("prismjs/components/prism-typescript");
  require("prismjs/components/prism-python");
  require("prismjs/components/prism-ruby");
  require("prismjs/components/prism-elixir");
  
  // Set up markdown-it with syntax highlighting
  const markdownIt = require("markdown-it");
  const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true,
    highlight: function(str, lang) {
      if (lang && Prism.languages[lang]) {
        try {
          return `<pre class="language-${lang}"><code class="language-${lang}">${Prism.highlight(str, Prism.languages[lang], lang)}</code></pre>`;
        } catch (err) {
          console.log("Syntax highlighting error: ", err);
        }
      }
      return `<pre class="language-${lang}"><code class="language-${lang}">${markdownIt().utils.escapeHtml(str)}</code></pre>`;
    }
  };
  
  eleventyConfig.setLibrary("md", markdownIt(markdownItOptions));
  
  // Add syntax highlighting with Prism.js (for templates)
  eleventyConfig.addFilter("highlight", function(code, language) {
    if (!language) return code;
    try {
      return Prism.highlight(code, Prism.languages[language], language);
    } catch (e) {
      console.warn(`Couldn't highlight ${language}: ${e}`);
      return code;
    }
  });
  
  // Copy these directories as-is to the output directory
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("noir");
  eleventyConfig.addPassthroughCopy("SVGPlayground");
  eleventyConfig.addPassthroughCopy("about");
  eleventyConfig.addPassthroughCopy("store");
  eleventyConfig.addPassthroughCopy("template");
  eleventyConfig.addPassthroughCopy("tribute");
  
  // Create a blog collection from markdown files
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("blog/posts/*.md").sort((a, b) => {
      return new Date(b.date) - new Date(a.date); // Sort posts by date in descending order
    });
  });
  
  // Create a custom collection for all unique tags
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const tagSet = new Set();
    collectionApi.getAll().forEach(item => {
      if ("tags" in item.data) {
        let tags = item.data.tags;
        if (typeof tags === "string") {
          tags = [tags];
        }
        tags.filter(tag => tag !== "posts").forEach(tag => tagSet.add(tag));
      }
    });
    return [...tagSet].sort();
  });
  
  // Format dates for blog posts
  eleventyConfig.addFilter("formatDate", function(dateObj) {
    if (typeof dateObj === 'string') {
      dateObj = new Date(dateObj);
    }
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  });

  // Don't process README files
  eleventyConfig.setTemplateFormats([
    "md", 
    "html",
    "njk",
    "css",
    "js"
  ]);

  // Exclude README.md files from processing
  eleventyConfig.ignores.add("**/README.md");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "blog/_includes",
      layouts: "blog/_layouts",
      data: "blog/_data"
    },
    // Enable all HTML files to use layouts
    htmlTemplateEngine: "njk",
    // Enable all Markdown files to use layouts
    markdownTemplateEngine: "njk",
    // Let Eleventy transform HTML files
    passthroughFileCopy: true
  };
}; 