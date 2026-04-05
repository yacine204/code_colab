import { Routes, Route } from "react-router-dom";
import "./App.css";

//pages
import Home from "./pages/home";
import CodeSpace from "./pages/codeSpace";
import Login from "./pages/login";
import Signup from "./pages/signup";
import UserProfile from "./pages/user_profile";
import Workspaces from "./pages/workspaces";
import CreateWorkspace from "./pages/create_workspace";

//components (testing)
import Terminal from "./components/terminal";
import Button from "./components/button";
import Input from "./components/input_field";
import FileExplorer from "./components/file_explorer";
import HamburgerMenu from "./components/hamburger_menu";
import { WorkspaceProvider } from "./context/workspaceContext";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/codespace/:workspaceId" element={<WorkspaceProvider><CodeSpace></CodeSpace></WorkspaceProvider>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/profile" element={<UserProfile></UserProfile>}></Route>
        <Route path="/workspaces" element={<Workspaces></Workspaces>}></Route>
        <Route
          path="/create-workspace"
          element={<CreateWorkspace></CreateWorkspace>}
        ></Route>

        {/* testing components */}
        <Route
          path="/coding"
          element={<Terminal language="" theme="" height="" width="" />}
        ></Route>
        <Route
          path="/button"
          element={
            <Button
              context="hi lol"
              color="#6366f1"
              trigger={() => console.log("hi lol")}
            ></Button>
          }
        ></Route>
        <Route
          path="/input"
          element={
            <>
              <Input label="Email" type="email" placeholder="you@example.com" />
              <Input
                label="Password"
                type="password"
                error="Invalid password"
              />
            </>
          }
        ></Route>
        <Route path="/file-explorer" element={<FileExplorer/>}></Route>

      </Routes>
    </>
  );
}

export default App;
