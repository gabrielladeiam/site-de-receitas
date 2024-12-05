import "./home.styles.css";
import { Links, BasePage } from "../../components";

function HomeBody() {
  return (
    <>
      <span className="span-container">
        <Links to="/recipes/create" tittle="Add your own recipe"></Links>
        <p>
          Upload your own home-made recipe, and share it with other members of
          our community
        </p>
      </span>
      <span className="recype-tittle-container">
        <h1>Based on the type of food you like</h1>
        <Links to="/allrecipes" tittle="View More" />
      </span>
    </>
  );
}
export function Home() {
  return (
    <div className="site">
      <BasePage className={"recype-container"}>
        <HomeBody />
      </BasePage>
    </div>
  );
}
