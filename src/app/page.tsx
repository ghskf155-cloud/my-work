import SubNav from "@/components/layout/SubNav";
import HeroScrolly from "@/components/sections/HeroScrolly";
import Interactive from "@/components/sections/Interactive";
import SpecsTab from "@/components/sections/SpecsTab";
import FaqAccordion from "@/components/sections/FaqAccordion";
import ThreeAnatomy from "@/components/3d/ThreeAnatomy";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-stone-50 w-full">
      <SubNav />
      <HeroScrolly />
      <Interactive />
      <ThreeAnatomy />
      <SpecsTab />
      <FaqAccordion />
    </main>
  );
}
