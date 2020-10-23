module.exports = {
  tagList: (collection) => {
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
  },
  categoryList: (collection) => {
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
  },
  categories: (collection) => {
    const categories = {};

    collection
      .getAllSorted()
      .filter(
        (item) => typeof item.data.categories === 'string' || Array.isArray(item.data.categories),
      )
      .forEach((item) => {
        if (Array.isArray(item.data.categories)) {
          item.data.categories.forEach((category) => {
            const cat = category.toLowerCase();

            if (Array.isArray(categories[cat])) {
              categories[cat].push(item);
            } else {
              categories[cat] = [item];
            }
          });
        } else {
          const category = item.data.categories.toLowerCase();

          if (Array.isArray(categories[category])) {
            categories[category].push(item);
          } else {
            categories[category] = [item];
          }
        }
      });

    return categories;
  },
};
