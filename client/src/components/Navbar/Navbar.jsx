import "./navbar.styles.css";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

export function Navbar() {
  return (
    <>
      <nav className="nav">
        <h1 className="eat">eat</h1>
        <h1>dish._</h1>
        <ul>
          <CostumLink to="/">Home</CostumLink>
          <CostumLink to="/recipes">Recipes</CostumLink>
          <CostumLink to="/recipes/create">New Recipe</CostumLink>
          <CostumLink to="/contact">Contact</CostumLink>
        </ul>
      </nav>
    </>
  );
}

function CostumLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
