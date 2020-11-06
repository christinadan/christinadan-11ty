const _ = require('lodash');
const { tagUrl, categoryUrl } = require('./shortcodes');

function tagList(collection) {
  const tagSet = new Set();

  collection.getAllSorted().forEach((collectionItem) => {
    if ('tags' in collectionItem.data) {
      const tags = collectionItem.data.tags.filter((tagItem) => {
        switch (tagItem) {
          // this list should match the `filter` list in tag.njk
          case 'all':
          case 'nav':
          case 'post':
          case 'tagList':
          case 'categoryList':
          case 'categories':
            return false;
          default:
            return true;
        }
      });

      tags.forEach((tag) => tagSet.add(tag));
    }
  });

  // returning an array in addCollection works in Eleventy 0.5.3
  return [...tagSet];
}

function categoryList(collection) {
  const catSet = new Set();

  collection
    .getAllSorted()
    .filter(
      (item) => typeof item.data.categories === 'string' || Array.isArray(item.data.categories),
    )
    .forEach((item) => {
      if (Array.isArray(item.data.categories)) {
        item.data.categories.forEach((category) => catSet.add(category.toLowerCase()));
      } else {
        catSet.add(item.data.categories.toLowerCase());
      }
    });

  return [...catSet];
}

function categories(collection) {
  const cats = {};

  collection
    .getAllSorted()
    .filter(
      (item) => typeof item.data.categories === 'string' || Array.isArray(item.data.categories),
    )
    .forEach((item) => {
      if (Array.isArray(item.data.categories)) {
        item.data.categories.forEach((category) => {
          const cat = category.toLowerCase();

          if (Array.isArray(cats[cat])) {
            cats[cat].push(item);
          } else {
            cats[cat] = [item];
          }
        });
      } else {
        const category = item.data.categories.toLowerCase();

        if (Array.isArray(cats[category])) {
          cats[category].push(item);
        } else {
          cats[category] = [item];
        }
      }
    });

  return cats;
}

function doublePagination(collection, type, paginationSize = 5) {
  const tagArray = type === 'categories' ? categoryList(collection) : tagList(collection);
  const tagMap = [];

  tagArray.forEach((name) => {
    const tagItems = type === 'categories' ? categories(collection)[name] : collection.getFilteredByTag(name);
    const pagedItems = _.chunk(tagItems.reverse(), paginationSize);
    const url = type === 'categories' ? `${categoryUrl(name)}` : `${tagUrl(name)}`;
    const last = pagedItems.length === 1 ? url : `${url}${pagedItems.length}/`;

    for (let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
      const next = pageNumber < max - 1 ? `${url}${pageNumber + 2}/` : null;
      let previous = null;

      if (pageNumber === 1) {
        previous = url;
      } else if (pageNumber > 1) {
        previous = `${url}${pageNumber}/`;
      }

      tagMap.push({
        name,
        pageNumber,
        pageData: pagedItems[pageNumber],
        href: {
          first: url,
          previous,
          next,
          last,
        },
      });
    }
  });

  return tagMap;
}

module.exports = {
  tagList,
  categoryList,
  categories,
  doublePagination,
};
