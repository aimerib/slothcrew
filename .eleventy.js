import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import wasm from 'vite-plugin-wasm';
import topLevelAwait from "vite-plugin-top-level-await";

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(EleventyVitePlugin, {
		tempFolderName: '.11ty-vite',

		viteOptions: {
			publicDir: 'public',
      plugins: [wasm(), topLevelAwait()],
			clearScreen: false,
		}
	})
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("noir");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy({"game/": "assets/js/"});

  eleventyConfig.setServerOptions({
    showAllHosts: true,
    port: 8081,
    encoding: "utf-8",
    extensions: {
      js: "text/javascript",
      mjs: "text/javascript",
      json: "application/json"
    }
  });
  
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("blog/posts/*.md").sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  });
  
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
  
  eleventyConfig.addFilter("formatDate", function(dateObj) {
    if (typeof dateObj === 'string') {
      dateObj = new Date(dateObj);
    }
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  });

  eleventyConfig.addCollection("sitemapPages", function(collectionApi) {
    return collectionApi.getAll().filter(item => {
      const excludedPaths = ['404.html'];
      return !excludedPaths.some(path => item.url.includes(path));
    });
  });

  eleventyConfig.setTemplateFormats([
    "md", 
    "html",
    "njk",
    "css",
    "js",
    "xml",
    "wasm"
  ]);

  eleventyConfig.ignores.add("**/README.md");

  eleventyConfig.addFilter("getRelatedPosts", function(page, collection) {
    const currentPost = collection.posts.find(post => post.url === page.url);
    const tags = currentPost.data.tags;
    const currentPostUrl = currentPost.url;
    
    if (!tags) return [];

    const relatedPosts = collection.posts
      .filter(item => {
        if (item.url === currentPostUrl) return false;
        
        const itemTags = item.data.tags || [];
        return tags.some(tag => itemTags.includes(tag));
      })
      .sort((a, b) => {
        const aTags = a.data.tags || [];
        const bTags = b.data.tags || [];
        const aMatches = tags.filter(tag => aTags.includes(tag)).length;
        const bMatches = tags.filter(tag => bTags.includes(tag)).length;
        return bMatches - aMatches;
      })
      .slice(0, 3);

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
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
  };
}; 