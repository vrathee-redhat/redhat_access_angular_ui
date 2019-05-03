'use strict';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import get from 'lodash/get';

export default () => (array, [itemsToRemove, key]) => {
  const shouldRemove = (a) => find(itemsToRemove, (i) => { return get(a, key) && (get(i, key) === get(a, key)) });
  return reduce(array, (acc, a) => {
    return shouldRemove(a) ? acc : [...acc, a];
  }, [])
};
