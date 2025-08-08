import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../../pages/HomePage/HomePage";
import LandingPage from "../../pages/LandingPage/LandingPage";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";
import MyBookmark from "../../pages/MyBookmark/MyBookmark";
import AddBookmark from "../../pages/AddBookmark/AddBookmark";
import BookmarkDetails from "../../pages/BookmarkDetails/BookmarkDetails";
import EditBookmark from "../../pages/EditBookmark/EditBookmark";
import Contact from "../../pages/Contact";
import Terms from "../../pages/Terms";
import { AuthProvider } from "../../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import PrivateLayout from "../../components/Layout/PrivateLayout";
import MapView from "../../pages/MapView/MapView";

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/MapView" element={<MapView />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Terms" element={<Terms />} />
          <Route path="/BookmarkDetails/:id" element={<BookmarkDetails />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/HomePage"
              element={
                <PrivateLayout>
                  <HomePage />
                </PrivateLayout>
              }
            />
            <Route
              path="/MyBookmark"
              element={
                <PrivateLayout>
                  <MyBookmark />
                </PrivateLayout>
              }
            />
            <Route
              path="/AddBookmark"
              element={
                <PrivateLayout>
                  <AddBookmark />
                </PrivateLayout>
              }
            />
            <Route
              path="/EditBookmark/:id"
              element={
                <PrivateLayout>
                  <EditBookmark />
                </PrivateLayout>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
