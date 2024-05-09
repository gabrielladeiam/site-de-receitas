import "./search-bar.styles.css";

export function SearchBar({ value, onChange }) {
  return (
    <div className="search-container">
      <input
        className="search"
        placeholder="Search by food name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      ></input>
    </div>
  );
}
