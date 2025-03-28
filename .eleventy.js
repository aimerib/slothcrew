module.exports = function(eleventyConfig) {
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