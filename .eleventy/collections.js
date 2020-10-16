const tagList = (collection) => {
  const tagSet = new Set();

  collection.getAllSorted().forEach((item) => {
    if ('tags' in item.data) {
      const tags = item.data.tags.filter((item) => {
        switch (item) {
          // this list should match the `filter` list in tag.njk
          case 'all':
          case 'nav':
          case 'post':
          case 'tagList':
          case 'categoryList':
          case 'categories':
            return false;
        }

        return true;
      });

      for (const tag of tags) {
        tagSet.add(tag);
      }
    }
  });

  // returning an array in addCollection works in Eleventy 0.5.3
  return [...tagSet];
};

const categoryList = (collection) => {
  const catSet = new Set();

  collection
    .getAllSorted()
    .filter(
      (item) => typeof item.data.categories === 'string' || Array.isArray(item.data.categories)
    )
    .forEach((item) => {
      if (Array.isArray(item.data.categories)) {
        item.data.categories.forEach((category) => catSet.add(category.toLowerCase()));
      } else {
        catSet.add(item.data.categories.toLowerCase());
      }
    });

  return [...catSet];
};

const categories = (collection) => {
  const categories = {};

  collection
    .getAllSorted()
    .filter(
      (item) => typeof item.data.categories === 'string' || Array.isArray(item.data.categories)
    )
    .forEach((item) => {
      if (Array.isArray(item.data.categories)) {
        item.data.categories.forEach((category) => {
          category = category.toLowerCase();

          Array.isArray(categories[category])
            ? categories[category].push(item)
            : (categories[category] = [item]);
        });
      } else {
        const category = item.data.categories.toLowerCase();
        Array.isArray(categories[category])
          ? categories[category].push(item)
          : (categories[category] = [item]);
      }
    });

  return categories;
};

module.exports.tagList = tagList;
module.exports.categoryList = categoryList;
module.exports.categories = categories;
