import { useState } from "react";
import NavBar from "./NavBar";
import ManageUser from "./ManageUser";
import ManageMeal from "./ManageMeal";
export default function ManageMain() {
  const [selectedCategory, setSelectedCategory] = useState("fridge");
  let content;
  switch (selectedCategory) {
    case "meals":
      content = <ManageMeal />;
      break;
    case "users":
      content = <ManageUser />;
      break;
    default:
      content = <ManageMeal />;
  }
  return (
    <>
      <NavBar selectItem={setSelectedCategory}/>
      <div>{content}</div>
    </>
  );
}
