import Router from 'next/router';

export function handleRouter(path: string, query?: string) {
  Router.push({
    pathname: path,
    query: query
  });
}
