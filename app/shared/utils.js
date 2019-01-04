const versionSorter = (_a, _b) => { //Added because of wrong order of versions
  let a = _a.match(/(\d+|\w+)/gm);
  let b = _b.match(/(\d+|\w+)/gm);
  for (var i = 0; i < (a.length > b.length ? a.length : b.length); i++) {
    const x = parseInt(a[i]) || a[i];
    const y = parseInt(b[i]) || b[i];
    if (x === undefined || x < y) {
      return 1;
    } else if (y === undefined || y < x) {
      return -1;
    }
  }
  if (_a.length > _b.length) {
    return 1;
  } else if (_b.length > _a.length) {
    return -1;
  }
  return 0;
}

const versionSort = (arr) => {
  return arr.sort(versionSorter);
}


module.exports = {
  versionSort,
  versionSorter
}
