const { URL } = require('url');
const sslChecker = require('ssl-checker');

const getSslDetails = (hostname) => {
  let url = new URL(hostname);
  return sslChecker(url.hostname);
};

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function removeSearchParams(link) {
  let normalizedLink = new URL(link);
  normalizedLink.searchParams.forEach((value, name, searchParams) => {
    normalizedLink.searchParams.delete(name);
  });

  return normalizedLink;
}

class AsyncArray {
  constructor(arr) {
    // Take a copy of the array, it might mutate by the time we've finished
    this.data = Array.from(arr); // In place of Array subclassing
  }

  async filterAsync(predicate) {
    // Transform all the elements into an array of promises using the predicate
    // as the promise
    const data = this.data;
    console.log(data);
    try {
      let result = await Promise.all(data.map((element, index) => predicate(element, index, data)));

      return data.filter((element, index) => {
        return result[index];
      });
    } catch (e) {
      console.log('filterAsync', e);
      throw e;
    }
  }
}

module.exports = {
  AsyncArray,
  getSslDetails,
  randomIntFromInterval,
  removeSearchParams,
};
