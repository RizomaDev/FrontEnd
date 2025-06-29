import HeaderLogged from "../HeaderLogged/HeaderLogged";
import Footer from "../Footer/Footer";

export default function PrivateLayout({ children }) {
  return (
    <>
      <HeaderLogged />
      <main>{children}</main>
      <Footer />
    </>
  );
}
