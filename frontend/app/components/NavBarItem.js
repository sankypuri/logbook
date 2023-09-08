import React, { useState, useContext } from "react";
import StateContext from "../StateContext";

export default function SidebarItem({ item }) {
  const [open, setOpen] = useState(false);
  const appState = useContext(StateContext);

  if (item.childrens) {
    return (
      <div className={open ? "sidebar-item open" : "sidebar-item"}>
        <div className="sidebar-title">
          <span>
            {item.icon && <i className={item.icon}></i>}
            {item.title}
          </span>
          <i
            className="bi-chevron-down toggle-btn"
            onClick={() => setOpen(!open)}
          ></i>
        </div>
        <div className="sidebar-content">
          {item.childrens.map((child, index) => (
            <SidebarItem key={index} item={child} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      // <a href={item.url || "#"} className="sidebar-item plain">
      //   {item.icon && <i className={item.icon}></i>}
      //   {item.title}
      // </a>
      <a
        href={
          (item.url.includes("username")
            ? item.url.replace("username", appState.user.username)
            : item.url) || "#"
        }
        className="sidebar-item plain"
      >
        {item.icon && <i className={item.icon}></i>}
        {item.title}
      </a>
    );
  }
}

// export default function SideBarItem() {
//   return (
//     <div className="sidebar-item">
//       <div className="sidebar-title">
//         <span>
//           <i className="bi-grear-fill"></i>
//           General
//         </span>
//         <i className="bi-chevron-down toggle-btn"></i>
//       </div>
//       <div className="sidebar-content">hello</div>
//     </div>
//   );
// }
