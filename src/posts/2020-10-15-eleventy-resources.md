---
title: Resources I Found Helpful While Building My First Static Site with Eleventy
slug: Helpful Eleventy Resources
description: A list of resources (mainly links) I found helpful while building this site using Eleventy
# eleventyComputed:
#   excerpt: "{{ description }}"
lastModifiedDate: 2020-10-16
categories:
  - code
tags:
  - eleventy
  - resources
  - website updates
---
A few days ago, I "officially" took the redesign and rewrite of this site live. And by that, I mean I made this domain name, christinadan.com, point to this site deployed on Netlify instead of my WordPress blog, with little more than a home page and an About page. As of writing this, there's still not much more than that. I got a little overwhelmed thinking about all the features I want to add to this site. Pagination, tags, categories, pages for tags and categories, responsive images, and something I'm really excited about, [Webmentions](https://indieweb.org/Webmention). The list goes on.<!-- excerpt -->

But I was really just putting off migrating the little content I had on my Wordpress here. And writing new content. I hadn't written anything since 2018. I wanted everything to be perfect first. Admittedly, all of my old posts featured things like life updates, travel posts, beauty reviews - all image-heavy content. And I knew I would have to take sometime to work through the export I have and all the images and make sure everything looks *right*. I just didn't want to deal with that yet.

In the spirit of why I decided to completely rewrite my site (more on that in a later post), I decided to pause and write this post. I'd done some of the things on my TODO list. I have [tag pages](/blog/tags/) and [category pages](/blog/category/). I have some nice navigation between posts. All of which can be seen and appreciated once I have more than one post. 😅

What astounds me is how much I've learn over the past couple of weeks working on this site. There are so many guides, tutorials, tips, and people willing to share their code with the world. I consistently have a zillion tabs open. I have a list going in the README of the [GitHub repository for this project](https://github.com/christinadan/christinadan-11ty), but I figured I'd move it to a post and let it continue to grow here to commemorate my minimum viable blog. 🎉

This is basically an Eleventy bookmarks post. I intend to update this as I go, so this list will continue to grow as my site grows in features!

## General/Project Setup
* [11ty Recipes](https://www.11ty.recipes)
* [Eleventy's official Quick Tips](https://www.11ty.dev/docs/quicktips/) - Going through their official docs is a given, but I highly recommend going through and implementing their Quick Tips specifically for instant quality of life improvements
* [Tatiana Mac's Beginner Eleventy Tutorial](https://tatianamac.com/posts/beginner-eleventy-tutorial-parti/)
* [Phil Hawksworth's pre-processing SCSS and inlining CSS tutorial](https://www.hawksworx.com/blog/keeping-sass-simple-and-speedy-on-eleventy/)
* [Gulp boilerplate](https://github.com/cferdinandi/gulp-boilerplate/blob/master/gulpfile.js) - It seems like Gulp is a faux pas these days. I'm familiar with Gulp and it was the path to least resistance while setting everything up, so I just went with it.

## Blog Starter Kits to Be Inspired By or Clone Directly
* [Eleventy Base Blog](https://github.com/11ty/eleventy-base-blog)
* [Hylia Starter Kit](https://github.com/hankchizljaw/hylia)
* [Supermaya Starter Kit](https://github.com/MadeByMike/supermaya)
* [Eleventy Netlify Boilerplate](https://github.com/danurbanowicz/eleventy-netlify-boilerplate)

## Specific Blog Features
### Implementing Post Categories
* [Implementing Categories on pborenstein.com](https://www.pborenstein.com/posts/categories/)
* [Basic custom taxonomies with Eleventy on webstoemp.com](https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/)

## TODO or Look at Later
* [From Wordpress to Eleventy with Ease](https://heydonworks.com/article/wordpress-to-eleventy/)
* [The Practicalities of Migrating from WordPress to Eleventy](https://ishambuilds.tech/posts/2020-05-23-journey-to-eleventy-pt-2/)
* [Migrating rom Wordpress to Eleventy](https://edspencer.me.uk/posts/2019-10-16-migrating-from-wordpress-to-eleventy/)
* [This Github issue](https://github.com/11ty/eleventy/issues/332) with recommendation from Zach Leatherman on how to implement double-layered pagination (for tag and category pages later on)
