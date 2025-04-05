module.exports = function(eleventyConfig) {
  // Add syntax highlighting plugin
  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  eleventyConfig.addPlugin(syntaxHighlight);
  
  // Copy these directories as-is to the output directory
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("noir");
  eleventyConfig.addPassthroughCopy("robots.txt");
  
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

  // Generate sitemap
  eleventyConfig.addCollection("sitemapPages", function(collectionApi) {
    return collectionApi.getAll().filter(item => {
      // Filter out pages you don't want in the sitemap
      const excludedPaths = ['404.html'];
      return !excludedPaths.some(path => item.url.includes(path));
    });
  });

  // Don't process README files
  eleventyConfig.setTemplateFormats([
    "md", 
    "html",
    "njk",
    "css",
    "js",
    "xml" // Add XML for sitemap
  ]);

  // Exclude README.md files from processing
  eleventyConfig.ignores.add("**/README.md");

  // Add filter for finding related posts
  eleventyConfig.addFilter("getRelatedPosts", function(page, collection) {
    console.log("Post URL:", page.url);
    console.log("Post data structure:", JSON.stringify(page.data, null, 2));
    console.log("Post keys:", Object.keys(page));
    console.log("collection.posts content:", collection.posts);
    const currentPost = collection.posts.find(post => post.url === page.url);
    const tags = currentPost.data.tags;
    const currentPostUrl = currentPost.url;
    
    if (!tags) return [];

    const relatedPosts = collection.posts
      .filter(item => {
        // Don't include current post
        if (item.url === currentPostUrl) return false;
        
        // Check for tag overlap
        const itemTags = item.data.tags || [];
        return tags.some(tag => itemTags.includes(tag));
      })
      .sort((a, b) => {
        // Count matching tags
        const aTags = a.data.tags || [];
        const bTags = b.data.tags || [];
        const aMatches = tags.filter(tag => aTags.includes(tag)).length;
        const bMatches = tags.filter(tag => bTags.includes(tag)).length;
        return bMatches - aMatches;
      })
      .slice(0, 3); // Get top 3 related posts

    return relatedPosts;
  });

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