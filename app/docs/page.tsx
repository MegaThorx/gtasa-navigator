"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Book, 
  ChevronLeft, 
  Code2, 
  Database, 
  Layers, 
  Map as MapIcon, 
  Share2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ------------------------------------------------------------------
// KONFIGURATION: HIER DEINE INHALTE EINFÜGEN
// ------------------------------------------------------------------

type DocSection = {
  id: string;
  title: string;
  icon?: React.ElementType;
  content: React.ReactNode;
};

const docSections: DocSection[] = [
  {
    id: "intro",
    title: "Einführung",
    icon: Book,
    content: (
      <div className="space-y-4">
        <p>
          Willkommen in der Dokumentation für den <strong>Pathfinder Navigator</strong>. 
          Diese Anwendung demonstriert fortschrittliches Routing mittels Graphentheorie 
          in einer Next.js Umgebung.
        </p>
        <p>
          Das Ziel ist es, den effizientesten Weg zwischen Knotenpunkten zu berechnen, 
          wobei verschiedene Transportmittel (Auto, Boot, Fußgänger) und Kriterien 
          (z.B. Vermeidung von Autobahnen) berücksichtigt werden.
        </p>
      </div>
    ),
  },
  {
    id: "tech-stack",
    title: "Technologie-Stack",
    icon: Layers,
    content: (
      <div className="space-y-4">
        <ul className="list-disc pl-6 space-y-2 text-slate-300">
          <li><strong>Frontend:</strong> Next.js 14 (App Router), React, Tailwind CSS</li>
          <li><strong>Datenbank:</strong> Neo4j (Graph Database)</li>
          <li><strong>Visualisierung:</strong> HTML5 Canvas / Custom Map Components</li>
          <li><strong>Icons:</strong> Lucide React</li>
        </ul>
      </div>
    ),
  },
  {
    id: "data-model",
    title: "Datenmodell",
    icon: Database,
    content: (
      <div className="space-y-4">
        <p>
          Die Daten werden in Neo4j als Knoten (Nodes) und Kanten (Relationships) gespeichert.
        </p>
        
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm overflow-x-auto">
          <p className="text-green-400">// Beispiel Cypher Query für das Schema</p>
          <p className="text-blue-300">(:PathNode &#123;</p>
          <p className="pl-4 text-orange-300">x: Float, y: Float, z: Float,</p>
          <p className="pl-4 text-orange-300">type: 'Car' | 'Boat' | 'Ped',</p>
          <p className="pl-4 text-orange-300">is_highway: Boolean</p>
          <p className="text-blue-300">&#125;)</p>
        </div>
      </div>
    ),
  },
  {
    id: "routing",
    title: "Routing Algorithmus",
    icon: Share2,
    content: (
      <div className="space-y-4">
        <p>
          Die Routenberechnung erfolgt serverseitig direkt in der Datenbank.
          Wir nutzen Neo4j's <code>shortestPath</code> Funktion, optimiert durch
          euklidische Distanzberechnung zur Findung der Start- und Endknoten.
        </p>
        
        <Card className="bg-slate-800/50 border-slate-700 mt-4">
          <CardContent className="p-4">
            <h4 className="font-semibold text-white mb-2">Logik-Ablauf:</h4>
            <ol className="list-decimal pl-5 space-y-1 text-slate-300">
              <li>Klick-Koordinaten (Origin/Destination) erfassen.</li>
              <li>Nächste verfügbare Nodes in der DB finden (basierend auf Distanz).</li>
              <li>Filter anwenden (z.B. <code>is_highway: false</code>).</li>
              <li>Graph-Traversal ausführen.</li>
              <li>Ergebnis als Koordinaten-Array zurückgeben.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    id: "usecases",
    title: "Use Cases",
    icon: MapIcon,
    content: (
      <div className="space-y-4">
        <p>
          Hier sind drei ausgewählte Anwendungsfälle:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="bg-slate-800 p-3 rounded border border-slate-700">
            <strong className="text-cyan-400 block mb-1">Use Case 1</strong>
            Routenplanung Fußgänger
          </li>
          <li className="bg-slate-800 p-3 rounded border border-slate-700">
            <strong className="text-cyan-400 block mb-1">Use Case 2</strong>
            Routenplanung Auto inkl. Autobahn
          </li>
          <li className="bg-slate-800 p-3 rounded border border-slate-700">
            <strong className="text-cyan-400 block mb-1">Use Case 3</strong>
            Routenplanung für Auto exkl. Autobahn
          </li>
             <li className="bg-slate-800 p-3 rounded border border-slate-700">
            <strong className="text-cyan-400 block mb-1">Zukünftige Implementierung</strong>
            Schnellste Route nach Weg, Schnellste Route nach Zeit, Parkplatzsuche
          </li>
        </ul>
      </div>
    ),
  },
];

// ------------------------------------------------------------------
// TEMPLATE CODE (NICHT ÄNDERN NOTWENDIG)
// ------------------------------------------------------------------

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState(docSections[0].id);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white">
                <ChevronLeft className="h-4 w-4" />
                Zurück zur App
              </Button>
            </Link>
            <span className="hidden font-bold sm:inline-block text-white">
              Projekt Dokumentation
            </span>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 pt-8 pb-20">
        
        {/* Sidebar Navigation */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r border-slate-800 pr-4">
          <div className="h-full py-6 pl-8 pr-6 lg:py-8">
            <nav className="flex flex-col space-y-2">
              {docSections.map((section) => {
                const Icon = section.icon || Code2;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-white text-left",
                      activeSection === section.id
                        ? "bg-slate-800 text-cyan-400 shadow-sm"
                        : "text-slate-400 hover:bg-slate-800/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px] px-4 md:px-0">
          <div className="mx-auto w-full min-w-0">
            {docSections.map((section, index) => (
              <div key={section.id} id={section.id} className="mb-16 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-2">
                  {section.icon && (
                    <div className="p-2 bg-slate-800 rounded-lg text-cyan-400">
                      <section.icon className="h-6 w-6" />
                    </div>
                  )}
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    {section.title}
                  </h2>
                </div>
                
                <div className="text-slate-300 leading-7 text-lg">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
          
          {/* Right side TOC (optional, hidden on smaller screens) */}
          <div className="hidden text-sm xl:block">
            <div className="sticky top-20">
              <h3 className="font-semibold text-slate-100 mb-4">Auf dieser Seite</h3>
              <ul className="space-y-3 border-l border-slate-800">
                {docSections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "block border-l-2 pl-4 -ml-[1px] transition-colors hover:text-white text-left w-full",
                        activeSection === section.id
                          ? "border-cyan-400 text-cyan-400 font-medium"
                          : "border-transparent text-slate-500"
                      )}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}