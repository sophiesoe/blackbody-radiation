"use client";
import dynamic from "next/dynamic";

const BlackbodyApplet = dynamic(() => import("../components/BlackbodyApplet"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="h-screen flex flex-col justify-between items-center pt-10 overflow-hidden">
      <BlackbodyApplet />
      <footer className="md:flex w-full justify-between items-center p-2 text-xs md:text-sm text-center md:text-left">
        <div>All rights reserves &copy; {new Date().getFullYear()}, </div>
        <div>
          <span className="text-[#f9f871]">Brisa, Varsheetha, Thin </span>
          <span>
            {"[ "}CSE P-batch{" ]"}
          </span>
        </div>
      </footer>
    </main>
  );
}
