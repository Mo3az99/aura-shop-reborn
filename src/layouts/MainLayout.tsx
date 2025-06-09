import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Cart from "@/components/Cart";

const MainLayout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Header setIsCartOpen={setIsCartOpen} />
      <main>
        <Outlet />
      </main>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default MainLayout;
