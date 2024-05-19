import { useState } from "react";
import NavBar from "./NavBar";
import ManageUser from "./ManageUser";
import ManageProfile from "./ManageProfile";
export default function ManageMain() {
  const [selectedCategory, setSelectedCategory] = useState("fridge");
  let content;
  switch (selectedCategory) {
    case "profiles":
      content = <ManageProfile/>;
      break;
    case "users":
      content = <ManageUser />;
      break;
    default:
      content = <ManageUser />;
  }
  return (
    <>
      <NavBar selectItem={setSelectedCategory}/>
      <div>{content}</div>
    </>
  );
}
