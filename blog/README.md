# Blog Section

This folder contains the blog section of the portfolio website, built with [Eleventy](https://www.11ty.dev/).

## Structure

- `_data/` - Contains data files used by Eleventy
- `_includes/` - Contains partial templates
- `_layouts/` - Contains layout templates
- `posts/` - Contains blog posts as Markdown files
- `index.njk` - The blog index page

## Creating a New Blog Post

1. Create a new Markdown file in the `posts/` directory with a name like `YYYY-MM-DD-post-title.md`
2. Add front matter at the top of the file:

```
---
layout: post.njk
title: Your Post Title
date: YYYY-MM-DD
description: A brief description of your post
tags: 
  - tag1
  - tag2
---
```

3. Write your post content below the front matter using Markdown

## Local Development

To work on the blog locally:

```bash
# Start the development server
npm run dev

# Build for production
npm run build
```

## Deployment

The blog is automatically built and deployed when changes are pushed to the main branch through Netlify. 