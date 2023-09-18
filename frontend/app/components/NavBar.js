import React, { useState } from "react"
import SidebarItem from "./NavBarItem"

const Navbar = () => {
  // to change burger classes
  const [burger_class, setBurgerClass] = useState("burger-bar unclicked")
  const [menu_class, setMenuClass] = useState("menu hidden")
  const [isMenuClicked, setIsMenuClicked] = useState(false)

  // toggle burger menu change
  const updateMenu = () => {
    if (!isMenuClicked) {
      setBurgerClass("burger-bar clicked")
      setMenuClass("menu visible")
    } else {
      setBurgerClass("burger-bar unclicked")
      setMenuClass("menu hidden")
    }
    setIsMenuClicked(!isMenuClicked)
  }

  const items = [
    {
      title: "Task Builder",
      icon: "bi bi-menu-button-wide-fill", //"../public/img/climb-arrow-light-48.png",
      id: 1,
      url: "/task-builder",
      childrens: [
        {
          title: "Steps",
          url: "/profile/username/task-builder/steps",
          icon: "bi bi-list-task",
        },
        {
          title: "Work Flow",
          url: "/profile/username/task-builder/workflow",
          icon: "bi bi-bar-chart-steps",
        },
        {
          title: "Log Book",
          url: "/create-logbook",
          icon: "bi bi-file-ruled-fill",
        },
      ],
    },

    {
      title: "Configure Masters",
      icon: "bi bi-gear", //"../public/img/climb-arrow-light-48.png",
      id: 2,
      url: "/master-configure",
      childrens: [
        {
          title: "Site",
          url: "/profile/username/master-configure/site",
          icon: "bi bi-building",
        },
        {
          title: "Plant",
          url: "/profile/username/master-configure/plant",
          icon: "bi bi-house",
        },
        {
          title: "Area",
          url: "/profile/username/master-configure/area",
          icon: "bi bi-map",
        },
        {
          title: "Line",
          url: "/profile/username/master-configure/line",
          icon: "bi bi-list-nested",
        },
        {
          title: "Equipment",
          url: "/profile/username/master-configure/equipment",
          icon: "bi bi-boxes",
        },
      ],
    },
  ]

  return (
    <div>
      <nav>
        <div className="burger-menu" onClick={updateMenu}>
          <div className={burger_class}></div>
          <div className={burger_class}></div>
          <div className={burger_class}></div>
        </div>
      </nav>

      <div className={menu_class}>
        <div>
          {items.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Navbar
