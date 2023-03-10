export function getQueryParam(key: string) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(key);
}

export function resetQueryParams() {
  const searchParams = new URLSearchParams(window.location.search);
  for (const [key] of searchParams as any) {
    // don't know why this is necessary - should be fixed: https://github.com/microsoft/TypeScript/issues/15243
    searchParams.delete(key);
  }
  const newRelativePathQuery =
    window.location.pathname + '?' + searchParams.toString();
  history.pushState(null, '', newRelativePathQuery);
}

export function setQueryParams(params: { [key: string]: string }) {
  resetQueryParams();
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value);
  }
  const newRelativePathQuery =
    window.location.pathname + '?' + searchParams.toString();
  history.pushState(null, '', newRelativePathQuery);
}

export function addQueryParams(params: { [key: string]: string }) {
  const searchParams = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value);
  }
  const newRelativePathQuery =
    window.location.pathname + '?' + searchParams.toString();
  history.pushState(null, '', newRelativePathQuery);
}

export function generateUUID() {
  // Public Domain/MIT, https://stackoverflow.com/a/8809472/13727176
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
