import { Link } from 'react-router-dom';

type RouterLinkProps = {
  href: string;
  replace?: boolean;
  target?: string;
  children?: React.ReactNode;
}

export default function RouterLink({ href, replace, target, ...props }: RouterLinkProps) {
  if (target === "_blank") return <a href={href} target={target} {...props} />
  return <Link to={href} replace={replace} {...props} />
}