import "./links.styles.css"
import { Link } from "react-router-dom"

export function Links({ tittle, to }) {
    return (
        <Link to={to}>{tittle}</Link>
    )
}