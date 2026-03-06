/**
 * Script pour importer les projets et skills depuis le CV de Yassine AALOUCH
 * Exécuter: node scripts/seed-from-cv.mjs
 * Prérequis: MONGODB_URI dans .env ou .env.local
 */

import { MongoClient } from "mongodb";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Charger .env puis .env.local (dotenv gère les chemins et le parsing)
config({ path: resolve(root, ".env") });
config({ path: resolve(root, ".env.local") });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI manquant. Ajoutez-le dans .env ou .env.local");
  process.exit(1);
}

const PROJECTS = [
  {
    title: "Secure Learning Platform (SaaS)",
    description:
      "Plateforme d'apprentissage full-stack scalable avec streaming vidéo HLS sécurisé (URLs signées, Cloudflare R2). Authentification JWT avec verrouillage appareil (1 compte = 1 appareil). Application Desktop (Tauri) et Mobile (React Native Expo). Logique d'abonnement et infrastructure de sessions live.",
    technologies: [
      "Next.js",
      "Prisma",
      "PostgreSQL",
      "Cloudflare R2",
      "JWT",
      "Tauri",
      "React Native",
      "Expo",
    ],
    link: "https://mypremiumschool.com",
    codeUrl: "",
    categories: ["SaaS", "Full-stack", "Education"],
    images: [],
  },
  {
    title: "Multi-Agency Car Rental Marketplace (SaaS)",
    description:
      "Plateforme SaaS multi-tenant où les agences de location s'abonnent mensuellement. Chaque agence dispose d'un dashboard dédié et d'un système de gestion des véhicules. Système de réservation sécurisé avec contrôle d'accès basé sur les rôles. Construit avec Next.js, Prisma, PostgreSQL et JWT.",
    technologies: ["Next.js", "Prisma", "PostgreSQL", "JWT", "SaaS"],
    link: "https://moroccomiles.com",
    codeUrl: "",
    categories: ["SaaS", "Marketplace", "Full-stack"],
    images: [],
  },
  {
    title: "Strass-Shopo (Fashion Boutique)",
    description:
      "Freelance E-Commerce Project. Full-featured e-commerce platform using Next.js and Tailwind CSS. Backend powered by MongoDB Atlas and Mongoose. Integrated AWS S3 for product image storage. Secure admin authentication with NextAuth.js. Order management and Nodemailer email notifications. Delivered as freelance paid project.",
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "MongoDB",
      "Mongoose",
      "AWS S3",
      "NextAuth.js",
      "Nodemailer",
    ],
    link: "https://strass-shop.com",
    codeUrl: "",
    categories: ["E-commerce", "Full-stack", "Freelance"],
    images: [],
  },
  {
    title: "Weet Macaron (Pastry Shop)",
    description:
      "Freelance E-Commerce Project. Full-featured e-commerce platform using Next.js and Tailwind CSS. Backend powered by MongoDB Atlas and Mongoose. Integrated AWS S3 for product image storage. Secure admin authentication with NextAuth.js. Order management and Nodemailer email notifications. Delivered as freelance paid project.",
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "MongoDB",
      "Mongoose",
      "AWS S3",
      "NextAuth.js",
      "Nodemailer",
    ],
    link: "https://macaron-psi.vercel.app",
    codeUrl: "",
    categories: ["E-commerce", "Full-stack", "Freelance"],
    images: [],
  },
  {
    title: "mapeau.ma E-commerce",
    description:
      "Contribution au développement e-commerce mapeau.ma avec React.js et Firebase. Implémentation de validation (Zod) et tests unitaires (Vitest). Travail full-stack en environnement agile.",
    technologies: ["React.js", "Firebase", "Zod", "Vitest"],
    link: "https://mapeau.ma",
    codeUrl: "",
    categories: ["E-commerce", "Internship"],
    images: [],
  },
];

const SKILLS = {
  frontend: {
    title: "Frontend Development",
    description: "Building fast, accessible, and delightful user interfaces.",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
      "React Native",
      "Tauri",
      "Expo",
    ],
  },
  backend: {
    title: "Backend Development",
    description: "Designing robust APIs and services that scale.",
    skills: [
      "Node.js",
      "Express.js",
      "Prisma ORM",
      "JWT",
      "Supabase",
      "Firebase",
      "NextAuth.js",
      "Zod",
      "Nodemailer",
    ],
  },
  database: {
    title: "Database",
    description: "Modeling data for reliability, performance, and simplicity.",
    skills: ["PostgreSQL", "MongoDB", "Mongoose"],
  },
  cloudDevops: {
    title: "Cloud & DevOps",
    description: "Automating deployment and infrastructure for modern teams.",
    skills: [
      "AWS S3",
      "Cloudflare R2",
      "Docker",
      "Git",
      "Postman",
      "Figma",
      "Jira",
      "Vitest",
    ],
  },
};

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("portfolio");

    // 1. Insérer ou mettre à jour les projets
    const projectsCol = db.collection("projects");

    for (const p of PROJECTS) {
      const doc = {
        title: p.title,
        description: p.description,
        technologies: p.technologies,
        link: p.link,
        codeUrl: p.codeUrl ?? "",
        categories: p.categories,
        images: p.images ?? [],
        defaultImageIndex: 0,
        updatedAt: new Date(),
      };
      const result = await projectsCol.updateOne(
        { title: p.title },
        { $set: doc, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
      if (result.upsertedCount) {
        console.log(`✅ Projet ajouté: ${p.title}`);
      } else {
        console.log(`🔄 Projet mis à jour: ${p.title}`);
      }
    }

    // 2. Mettre à jour les skills (upsert)
    const skillsCol = db.collection("skills");
    await skillsCol.updateOne(
      {},
      { $set: { categories: SKILLS, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log("✅ Skills mis à jour (frontend, backend, database, cloudDevops)");

    console.log("\n🎉 Import terminé avec succès !");
  } catch (err) {
    console.error("❌ Erreur:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
