import { siteName, siteUrl } from "@/lib/site";

export default function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Yassine Aalouch",
    url: siteUrl,
    jobTitle: "Software Engineer",
    description:
      "Freelance Software Engineer, Full Stack Web Developer & Web Designer. Building scalable web applications and modern digital experiences. React, Next.js, Node.js, TypeScript, Cloud.",
    knowsAbout: [
      "Software Engineering",
      "Full Stack Development",
      "Web Development",
      "Web Design",
      "Frontend Development",
      "Backend Development",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "Cloud Architecture",
    ],
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", credentialCategory: "Professional" },
    ],
    sameAs: [
      "https://github.com/your-username",
      "https://www.linkedin.com/in/your-profile",
      "https://twitter.com/your-handle",
    ],
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    description:
      "Portfolio of Yassine Aalouch - Freelance Software Engineer, Full Stack Developer, Web Designer. Available for remote projects.",
    publisher: { "@id": `${siteUrl}/#person` },
    inLanguage: ["en", "fr", "ar"],
  };

  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#service`,
    name: "Yassine Aalouch - Freelance Software Engineering",
    description:
      "Freelance Software Engineer & Full Stack Web Developer. Custom web applications, React, Next.js, Node.js, cloud architecture. Hire for your next project.",
    url: siteUrl,
    provider: { "@id": `${siteUrl}/#person` },
    areaServed: "Worldwide",
    serviceType: [
      "Web Development",
      "Full Stack Development",
      "Software Engineering",
      "Web Design",
    ],
  };

  const structuredData = [person, webSite, professionalService];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData.length === 1 ? structuredData[0] : structuredData),
      }}
    />
  );
}
