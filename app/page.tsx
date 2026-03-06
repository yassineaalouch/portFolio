import { getEnabledSections } from "@/lib/siteConfig";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import VisitorTracker from "./components/VisitorTracker";

export default async function Home() {
  const enabledSections = await getEnabledSections();

  return (
    <>
      <VisitorTracker enabledSections={enabledSections} />
      <Navbar enabledSections={enabledSections} />
      <main className="min-h-screen bg-background text-foreground">
        {enabledSections.includes("hero") && <Hero />}
        {enabledSections.includes("projects") && <Projects />}
        {enabledSections.includes("skills") && <Skills />}
        {enabledSections.includes("contact") && <Contact />}
      </main>
      {enabledSections.includes("footer") && <Footer />}
    </>
  );
}