import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import About from "@/components/About";
import RecentProjects from "@/components/RecentProjects";
import RecentBlogs from "@/components/RecentBlogs";

export default function Home() {
  return (
    <div className="w-full space-y-4">
      <Hero />
      <About />
      <Skills />
      <RecentProjects />
      <RecentBlogs />
    </div>
  );
}
