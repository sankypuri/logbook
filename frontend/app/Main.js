import React, { useState, useReducer, useEffect } from "react"
import ReactDOM from "react-dom/client"
import { useImmerReducer } from "use-immer"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import Axios from "axios"
Axios.defaults.baseURL = "http://localhost:8083"

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

// My Components
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Home from "./components/Home"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import CreateStep from "./components/CreateStep"
import ViewSingleStep from "./components/ViewSingleStep"
import FlashMessages from "./components/FlashMessages"
import EditStep from "./components/EditStep"
import NotFound from "./components/NotFound"
import Search from "./components/Search"
import Steps from "./components/Steps"
import CreateWorkFlow from "./components/CreateWorkFlow"
import WorkFlowList from "./components/WorkFlowList"
import WorkFlows from "./components/WorkFlows"
import EditWorkFlow from "./components/EditWorkFlow"
import MasterForm from "./components/MasterForm"
import MasterList from "./components/MasterList"
import CreateSites from "./components/CreateSites"

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar"),
    },
    isSearchOpen: false,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        return
      case "logout":
        draft.loggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
      case "openSearch":
        draft.isSearchOpen = true
        return
      case "closeSearch":
        draft.isSearchOpen = false
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappToken", state.user.token)
      localStorage.setItem("complexappUsername", state.user.username)
      localStorage.setItem("complexappAvatar", state.user.avatar)
    } else {
      localStorage.removeItem("complexappToken")
      localStorage.removeItem("complexappUsername")
      localStorage.removeItem("complexappAvatar")
    }
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <div className="flex-container hero-section overflow-auto">
            {/*{state.loggedIn ? <Menu /> : <></>}*/}
            <Routes>
              <Route path="/profile/:username/task-builder/steps" element={state.loggedIn ? <Steps /> /*<Profile />*/ : <HomeGuest />} />
              <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
              <Route path="/step/:id" element={state.loggedIn ? <ViewSingleStep /> : <HomeGuest />} />
              <Route path="/step/:id/edit" element={state.loggedIn ? <EditStep /> : <HomeGuest />} />
              <Route path="/create-step" element={state.loggedIn ? <CreateStep /> : <HomeGuest />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/profile/:username/task-builder/workflow" element={<WorkFlows />} />
              <Route path="/create-workflow" element={<CreateWorkFlow />} />
              <Route path="/profile/:username/task-builder/workflow" element={<WorkFlowList />} />
              <Route path="/workflow/:id/edit" element={state.loggedIn ? <EditWorkFlow /> : <HomeGuest />} />

              <Route path="/master" element={state.loggedIn ? <MasterList /> : <HomeGuest />} />
              <Route path="/configuration/masterForm" element={state.loggedIn ? <MasterForm /> : <HomeGuest />} />
              <Route path="/configuration/create-site" element={state.loggedIn ? <CreateSites /> : <HomeGuest />} />
            </Routes>
          </div>
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <Search />
          </CSSTransition>
          <div>
            <Footer />
          </div>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)

if (module.hot) {
  module.hot.accept()
}
