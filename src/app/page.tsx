import SubNav from "@/components/layout/SubNav";
import HeroScrolly from "@/components/sections/HeroScrolly";
import Interactive from "@/components/sections/Interactive";
import SpecsTab from "@/components/sections/SpecsTab";
import FaqAccordion from "@/components/sections/FaqAccordion";
import FirebaseBoard from "@/components/sections/FirebaseBoard";
import dynamic from "next/dynamic";

const ThreeAnatomy = dynamic(() => import("@/components/3d/ThreeAnatomy"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-stone-50 w-full">
      <SubNav />
      <HeroScrolly />
      <Interactive />
      <ThreeAnatomy />
      <SpecsTab />
      <FirebaseBoard />
      <FaqAccordion />
    </main>
  );
}
