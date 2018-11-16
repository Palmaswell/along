import Cookie from 'js-cookie';

export const getCookie = (cookieName: string, ctx?: {req: {cookies} }) => {
  let cookie;
  if (process.browser) {
    cookie = Cookie.get(cookieName);
  } else {
    cookie = ctx.req.cookies ? ctx.req.cookies[cookieName] : null;
  }
  return cookie;
}
