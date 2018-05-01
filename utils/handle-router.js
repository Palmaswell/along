import Router from 'next/router'

export function handleRouter(path, query) {
  Router.push({
    pathname: path,
    query: query
  });
}
