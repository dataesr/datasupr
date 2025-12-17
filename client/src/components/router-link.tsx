import { Link } from 'react-router-dom';
import { createElement } from "react";

type RouterLinkProps = {
  href: string;
  replace?: boolean;
  target?: string;
  children?: any;
};

export default function RouterLink({ href, replace, target, children }: RouterLinkProps) {
  if (target === "_blank") {
    return createElement("a", { href, target }, children);
  }

  const linkElement: any = Link;
  const linkAttributes = Object.create(null);
  linkAttributes.to = href;
  linkAttributes.replace = replace;
  return createElement(linkElement, linkAttributes, children);
}