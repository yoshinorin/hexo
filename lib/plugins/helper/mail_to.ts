import { htmlTag } from 'hexo-util';
import moize from 'moize';

interface Options {
  href?: string;
  title?: string;
  class?: string | string[];
}

interface Attrs {
  href: string;
  title: string;
  class?: string;
  [key: string]: string | boolean | null | undefined;
}

function mailToHelper(path, text, options: Options = {}) {
  if (Array.isArray(path)) path = path.join(',');
  if (!text) text = path;

  const attrs = Object.assign({
    href: `mailto:${path}`,
    title: text
  }, options);

  if (attrs.class && Array.isArray(attrs.class)) {
    attrs.class = attrs.class.join(' ');
  }

  const data = {};

  ['subject', 'cc', 'bcc', 'body'].forEach(i => {
    const item = attrs[i];

    if (item) {
      data[i] = Array.isArray(item) ? item.join(',') : item;
      attrs[i] = null;
    }
  });

  const querystring = new URLSearchParams(data).toString();
  if (querystring) attrs.href += `?${querystring}`;

  return htmlTag('a', attrs as Attrs, text);
}

export = moize(mailToHelper, {
  maxSize: 10,
  isDeepEqual: true
});
