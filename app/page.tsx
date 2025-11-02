"use client";
import dynamic from "next/dynamic";

const BlackbodyApplet = dynamic(() => import("../components/BlackbodyApplet"), {
  ssr: false,
});
import ParticlesBackground from "../components/ParticlesBackground";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="h-screen flex flex-col justify-center items-center overflow-hidden my-auto">
      <div className="-z-10">
        <ParticlesBackground />
      </div>
      <BlackbodyApplet />
      <Footer />
    </main>
  );
}
