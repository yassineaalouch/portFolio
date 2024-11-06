"use client"

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Instagram, Facebook, Linkedin, Lightbulb, Palette, Twitter, Download, Check, Globe, ExternalLink, X, Mail, Code, Dumbbell, Github } from 'lucide-react'
import { css, Global } from '@emotion/react'
import Link from 'next/link'
import Image from 'next/image'

const globalStyles = css`
@keyframes neon-glow {
  0% {
    box-shadow: 0 0 5px #4ade80, 0 0 10px #4ade80, 0 0 15px #4ade80, 0 0 20px #4ade80;
    }
    100% {
      box-shadow: 0 0 10px #4ade80, 0 0 20px #4ade80, 0 0 30px #4ade80, 0 0 40px #4ade80;
      }
      }
      .glow {
        animation: neon-glow 1.5s ease-in-out infinite alternate;
        }
        `

const Section = ({ children, className = "", id = "" }: { children: React.ReactNode, className?: string, id?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setTimeout(() => setIsVisible(false), 300);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      id={id}
      className={`bg-gray-900 bg-opacity-20 backdrop-blur-sm rounded-lg p-6 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } ${className}`}
    >
      {children}
    </div>
  );
};

export default function ResumeContent() {
  const [key, setKey] = useState(0);
  const [scrolled, setScrolled] = useState(false)
  const [activePreview, setActivePreview] = useState<number | null>(null)
  const [mainVideoLoaded, setMainVideoLoaded] = useState(false)
  const [mainVideoError, setMainVideoError] = useState<string | null>(null)
  const [introVideoLoaded, setIntroVideoLoaded] = useState(false)
  const [introVideoError, setIntroVideoError] = useState<string | null>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const introVideoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleVideoLoad = (video: HTMLVideoElement | null, setLoaded: (loaded: boolean) => void, setError: (error: string | null) => void) => {
      if (video) {
        video.playbackRate = 1

        const handleCanPlay = () => {
          console.log("Video can play")
          setLoaded(true)
          setError(null)
        }

        const handleError = (e: Event) => {
          const target = e.target as HTMLVideoElement
          console.error("Video error:", target.error)
          setLoaded(false)
          setError(target.error ? target.error.message : "Unknown error occurred")
        }

        video.addEventListener('canplay', handleCanPlay)
        video.addEventListener('error', handleError)

        return () => {
          video.removeEventListener('canplay', handleCanPlay)
          video.removeEventListener('error', handleError)
        }
      }
    }

    const cleanupMain = handleVideoLoad(mainVideoRef.current, setMainVideoLoaded, setMainVideoError)
    const cleanupIntro = handleVideoLoad(introVideoRef.current, setIntroVideoLoaded, setIntroVideoError)

    return () => {
      cleanupMain && cleanupMain()
      cleanupIntro && cleanupIntro()
    }
  }, [])

  const retryVideoLoad = (video: HTMLVideoElement | null) => {
    if (video) {
      video.load();
    }
  };

  const scrollToIntro = () => {
    introRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };


  // let InterestsList = [
  //   { icon: Music, title: 'Music', description: 'Passionate about various genres and playing instruments.' },
  //   { icon: Waves, title: 'Swimming', description: 'Enjoy swimming for fitness and relaxation.' },
  //   { icon: Code, title: 'Coding', description: 'Love creating and problem-solving through programming.' },
  //   { icon: Dumbbell, title: 'Gym', description: 'Committed to maintaining physical fitness and strength training.' },
  // ]
  // let DesignSkillsList = ['Web Design', 'Illustrations', 'Photoshop', 'Graphic Design']
  // let LanguageList = ['English', 'German', 'Italian', 'French']
  // let KnowledgeList = [
  //   "Finance d'entreprise",
  //   "Stratégie et Management",
  //   "Comptabilité",
  //   "Ingénierie Bâtiment",
  //   "Microéconomie",
  //   "Marketing",
  //   "Website Design",
  //   "Statistics"
  // ]
  // let EducationList = [
  //   { year: '2018 - 2022', degree: 'Bachelor of Science in Computer Science', school: 'University of Technology' },
  //   { year: '2014 - 2018', degree: 'High School Diploma', school: 'International High School' },
  // ]
  // const projects = [
  //   {
  //     title: 'Personal Portfolio Website',
  //     description: 'A responsive portfolio website showcasing my skills and projects.',
  //     technologies: ['React', 'Next.js', 'Tailwind CSS'],
  //     Screenshots:'/',
  //     link: 'https://yourportfolio.com',
  //   },
  //   {
  //     title: 'Online legal consulting firm',
  //     description: 'legal guidance with an interactive website featuring service overviews, expert profiles, case studies, and a secure client portal for seamless consultation and document management.',
  //     technologies: ['Node.js', 'MongoDB', 'React', 'Tailwind CSS'],
  //     Screenshots:'/',
  //     link: 'https://yourecommerce.com',
  //   },
  //   {
  //     title: 'Notes Management Desktop/Web application',
  //     description: 'A real-time weather application using geolocation and weather APIs.',
  //     technologies: ['JavaScript', 'HTML5', 'CSS3', 'OpenWeatherMap API'],
  //     Screenshots:'/',
  //     link: 'https://yourweatherapp.com',
  //   },
  //   {
  //     title: 'Task Management System',
  //     description: 'A collaborative task management tool for teams with real-time updates.',
  //     technologies: ['Vue.js', 'Firebase', 'Vuex'],
  //     Screenshots:'/',
  //     link: 'https://yourtaskmanager.com',
  //   }
  // ]
  let InterestsList = [
    { icon: Dumbbell, title: 'Fitness', description: 'Committed to maintaining physical health and strength.' },
    { icon: Code, title: 'Programming', description: 'Passionate about developing full-stack web applications.' },
    { icon: Palette, title: 'Graphic Design', description: 'Interested in visual creativity and digital design.' },
    { icon: Lightbulb, title: 'Innovation', description: 'Driven by creative problem-solving and new ideas.' },
  ];

  let DesignSkillsList = ['Next.js', 'React.js', 'Tailwind CSS', 'Figma', 'Inkscape', 'WordPress'];
  let LanguageList = ['Arabic', 'French', 'English'];
  let KnowledgeList = [
    "Next.js",
    "React.js",
    "Tailwind CSS",
    "MongoDB",
    "JavaScript",
    "Git",
    "Figma",
    "Inkscape",
    "HTML",
    "CSS",
    "WordPress",
    "C++"
  ];

  let EducationList = [
    { year: '2022 - present', degree: 'Software engineer Student', school: 'International Academy Mohammed VI of Civil Aviation, AIAC' },
    { year: '2020 - 2022', degree: 'Preparatory Class', school: 'CPGE Molay Abdelah, Safi' },
    { year: '2017 - 2020', degree: 'Baccalaureate', school: 'Mohamed 6 High School, Marrakech' },
];

const projects = [
    {
        title: 'Car Rental Website (not yet completed)',
        description: 'Development of a car rental website allowing users to book and check available time slots.',
        technologies: ['Next.js', 'Tailwind CSS', 'NextAuth', 'MongoDB', 'Nodemailer'],
        Screenshots: '/carRental.png', // Update with screenshot link if necessary
        link: 'https://rental-car-yassine.vercel.app/',
    },
    {
        title: 'E-commerce Site - Reevofeed',
        description: 'Creation of a full-stack e-commerce site with product filtering and user account management.',
        technologies: ['Next.js', 'Tailwind CSS', 'NextAuth', 'MongoDB', 'Nodemailer'],
        Screenshots: '/rvofeed.png',
        link: 'https://revofeedd.vercel.app/',
    },
    {
        title: 'Online Legal Consulting Site',
        description: 'Development of a consulting site for a legal consultant, allowing online appointment booking.',
        technologies: ['Next.js', 'NextAuth', 'Tailwind CSS', 'MongoDB'],
        Screenshots: '/consultingSite.png',
        link: 'https://amine-legal-consulting.vercel.app/',
    },
    {
        title: 'E-commerce Site for Client "AWANI"',
        description: 'Development of an e-commerce site enabling the client to sell products online. The site includes features such as product filtering, user account management, and a dashboard for product administration.',
        technologies: ['Next.js', 'Tailwind CSS', 'NextAuth', 'MongoDB', 'Nodemailer'],
        Screenshots: '/awani.png', // Update with screenshot link if necessary
        link: 'https://awani.vercel.app/', // Replace with the actual link if available
    },
];


  useEffect(() => {
    const loadVideo = (video: HTMLVideoElement | null) => {
      if (video) {
        video.load();
      }
    };

    loadVideo(mainVideoRef.current);
    loadVideo(introVideoRef.current);
  }, [key]);

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, []);

  return (
    <div key={key} className="min-h-screen bg-black text-white">
      <Global styles={globalStyles} />
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold hover:text-green-400 transition-colors duration-300">YA</Link>
          <nav>
            <ul className="flex space-x-6">
              {['intro', 'education', 'projects', 'knowledge', 'skills', 'interests', 'additional-insights'].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item}`}
                    className="text-lg hover:text-green-400 transition-all duration-300 relative group"
                    onClick={(e) => scrollToSection(e, item)}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="relative">
        <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <Image
              src="https://i.imgur.com/V9fczuO.jpg"
              alt="Background"
              fill
              className="object-cover opacity-50"
              style={{ display: mainVideoLoaded ? 'none' : 'block' }}
            />
          </div>
          <video
            ref={mainVideoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover"
            poster="https://i.imgur.com/V9fczuO.jpg"
            style={{ display: mainVideoLoaded ? 'block' : 'none' }}
            onError={() => retryVideoLoad(mainVideoRef.current)}
          >
            <source src="https://i.imgur.com/V9fczuO.mp4" type="video/mp4" />
            <source src="https://i.imgur.com/V9fczuO.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          {!mainVideoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl">
              {mainVideoError ? `Video failed to load: ${mainVideoError}` : 'Loading video...'}
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <h2 className="text-6xl font-bold mb-8 z-10 relative group">
            <span className="text-white transition-all duration-300 ease-in-out group-hover:scale-110 inline-block">
              Resume
            </span>
          </h2>
          <div className="absolute bottom-16 left-0 right-0 flex justify-center items-center flex-col z-10">
            <button onClick={scrollToIntro} className="flex flex-col items-center text-green-400 hover:text-green-300 transition-colors duration-300">
              <p className="mb-2">Scroll to know more</p>
              <ChevronDown className="animate-bounce" size={24} />
            </button>
          </div>
          <div className="absolute bottom-4 left-4 z-10">
            <p>E: yassine.aalouch@aiac.ma</p>
            <p>T: +212 642 733 682</p>
          </div>
        </section>

        <div ref={introRef} className="container mx-auto px-4 py-16">
          <Section id="intro" className="flex justify-center items-center min-h-screen relative overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src="https://i.imgur.com/a/RIbw46K.jpg"
                alt="Intro Background"
                fill
                className="w-full h-full object-cover opacity-50"
                style={{ display: introVideoLoaded ? 'none' : 'block' }}
              />
              <video
                ref={introVideoRef}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                poster="https://i.imgur.com/RIbw46K.jpg"
                style={{ display: introVideoLoaded ? 'block' : 'none' }}
                onError={() => retryVideoLoad(introVideoRef.current)}
              >
                <source src="https://i.imgur.com/RIbw46K.mp4" type="video/mp4" />
                <source src="https://i.imgur.com/RIbw46K.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
              {!introVideoLoaded && introVideoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl">
                  Video failed to load: {introVideoError}
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
            <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-lg p-8 max-w-4xl w-full relative z-10">
              <div className="flex flex-col lg:flex-row items-center lg:items-start">
                <Image
                  src="/yassine_image.jpg"
                  alt="Profile"
                  width={256}
                  height={256}
                  className="object-cover mb-4 lg:mr-8 rounded-full"
                />
                <div className="text-center lg:text-left">
                  <h2 className="text-4xl font-bold mb-4">Hello, I&#39;m <span className="text-green-400">Yassine Aalouch</span></h2>
                  <p className="text-xl mb-4" style={{ fontSize: '24px' }}>Computer Science Student</p>
                  <p className="mb-4">With a passion for coding and a strong desire to tackle new challenges, I am eager to explore innovative solutions and continuously develop my expertise in the field.</p>
                  <Link
                    href="/Yassine-AALOUCH-CV.pdf"
                    download="Yassine-AALOUCH-CV.pdf"
                    target="_blank"
                    className="bg-green-400 text-black px-4 py-2 w-fit rounded flex items-center hover:bg-green-300 transition-colors duration-300 mx-auto lg:mx-0"
                    style={{ marginTop: '50px', marginLeft: '160px' }}>
                    <Download className="mr-2" /> Download CV
                  </Link>
                </div>
              </div>
            </div>
          </Section>

          <Section id="education">
            <h3 className="text-2xl font-bold mb-6">Education</h3>
            <div className="space-y-6">
              {EducationList.map((edu, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center border-l-4 border-green-400 pl-4">
                  <div className="md:w-1/4 font-bold text-green-400">{edu.year}</div>
                  <div className="md:w-3/4">
                    <h4 className="text-xl font-semibold">{edu.degree}</h4>
                    <p className="text-gray-400">{edu.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="projects">
            <h3 className="text-2xl font-bold mb-6">Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <div key={index} className="border border-green-400 rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-bold mb-2 flex items-center">
                      <Globe className="mr-2 text-green-400" size={20} />
                      {project.title}
                    </h4>
                    <p className="text-gray-400 mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="bg-green-400 text-black px-2 py-1 rounded text-sm">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setActivePreview(index)}
                    className="text-green-400 hover:text-green-300 transition-colors duration-300 flex items-center"
                  >
                    Learn More <ExternalLink className="ml-1" size={16} />
                  </button>
                </div>
              ))}
            </div>
          </Section>

          <Section id="knowledge">
            <h3 className="text-2xl font-bold mb-6">Knowledge</h3>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              {KnowledgeList.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <Check className="text-green-400 mr-2" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="skills">
            <h3 className="text-2xl font-bold mb-6">Skills</h3>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h4 className="text-xl font-bold mb-4">Design Skills</h4>
                <div className="space-y-2">
                  {DesignSkillsList.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-32">{skill}</span>
                      <div className="flex-1 bg-gray-700 h-2 rounded-full">
                        <div
                          className="bg-green-400 h-2 rounded-full"
                          style={{ width: `${[90,90,80,66,70,60][index]}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2">
                <h4 className="text-xl font-bold mb-4">Language Skills</h4>
                <div className="space-y-4">
                  {LanguageList.map((language, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-20">{language}</span>
                      <div className="flex space-x-1">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < [9, 7, 5, 8][index] ? 'bg-green-400' : 'bg-gray-700'}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section id="interests">
            <h3 className="text-2xl font-bold mb-6">Interests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {InterestsList.map((interest, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <interest.icon className="text-green-400 mb-2" size={48} />
                  <h4 className="text-xl font-bold mb-2">{interest.title}</h4>
                  <p className="text-gray-400">{interest.description}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="additional-insights">
            <h3 className="text-2xl font-bold mb-6">Additional Insights</h3>
            <ul className="list-disc list-inside space-y-4">
              <li className="text-green-400">
                <span className="text-white"><strong>Problem-solving prowess:</strong> Skilled at breaking down complex issues into manageable components and developing innovative solutions.</span>
              </li>
              <li className="text-green-400">
                <span className="text-white"><strong>Continuous learning mindset:</strong> Eagerness to stay updated with the latest technologies and best practices in the ever-evolving field of software development.</span>
              </li>
              <li className="text-green-400">
                <span className="text-white"><strong>Collaborative spirit:</strong> Excellent communication skills and the ability to work effectively in cross-functional teams, contributing to a positive work environment.</span>
              </li>
            </ul>
          </Section>
        </div>
      </main>

      <div className="fixed top-0 right-0 h-full flex flex-col justify-center items-center space-y-4 p-4 bg-gray-900 bg-opacity-20 backdrop-blur-sm">
        <Link
          href="https://www.facebook.com/Yassine.Aalouch"
          className="text-white hover:text-green-400 transition-colors duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook size={24} />
        </Link>

        {/* LinkedIn */}
        <Link
          href="https://www.linkedin.com/in/yassine-aalouch-25352030b/"
          className="text-white hover:text-green-400 transition-colors duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin size={24} />
        </Link>

        {/* GitHub */}
        <Link
          href="https://github.com/yassineaalouch"
          className="text-white hover:text-green-400 transition-colors duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={24} />
        </Link>

        {/* Email */}
        <Link
          href="mailto:yassine.aalouch@aiac.ma"
          className="text-white hover:text-green-400 transition-colors duration-300"
          target="_blank"
        >
          <Mail size={24} />
        </Link>
      </div>

      {activePreview !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">{projects[activePreview].title}</h3>
              <button onClick={() => setActivePreview(null)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="mb-4 flex justify-center items-center">
              <Image width={500} height={500}  src={projects[activePreview].Screenshots} alt={projects[activePreview].Screenshots}/>
            </div>
            <Link
              href={projects[activePreview].link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors duration-300 flex items-center"
            >
              Visit Project <ExternalLink className="ml-1" size={16} />
            </Link>
          </div>
        </div>
      )}

      <footer className="bg-black text-white py-8 relative">
        <div className="absolute inset-0 border-4 border-neon-green glow"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Yassine Aalouch</h3>
              <p className="text-gray-400">UX/UI Designer and full-stack Developer</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/Yassine.Aalouch"
                className="text-white hover:text-green-400 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={24} />
              </Link>

              {/* LinkedIn */}
              <Link
                href="https://www.linkedin.com/in/yassine-aalouch-25352030b/"
                className="text-white hover:text-green-400 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={24} />
              </Link>

              {/* GitHub */}
              <Link
                href="https://github.com/yassineaalouch"
                className="text-white hover:text-green-400 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={24} />
              </Link>

              {/* Email */}
              <Link
                href="mailto:yassine.aalouch@aiac.ma"
                className="text-white hover:text-green-400 transition-colors duration-300"
                target="_blank"
              >
                <Mail size={24} />
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Yassine Aalouch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}