import { createContext, useContext, useState } from "react";
const SidebarContext = createContext();
export function useSidebar() { return useContext(SidebarContext); }
export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
} 