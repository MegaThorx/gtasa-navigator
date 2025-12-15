"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; 
import visualisationImage from "./img/visualisation1.png";
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

// Typ-Definitionen
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
      <div className="space-y-4 text-slate-300">
        <p>
          Willkommen in der Dokumentation für den <strong className="text-white">GTASA Navigator</strong>. 
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
          <li><strong className="text-white">Frontend:</strong> Next.js 16 (App Router), React, Tailwind CSS</li>
          <li><strong className="text-white">Datenbank:</strong> Neo4j (Graph Database)</li>
          <li><strong className="text-white">Visualisierung:</strong> HTML5 Canvas / Leaflet inkl. Custom Map Components</li>
          <li><strong className="text-white">Icons:</strong> Lucide React</li>
        </ul>
      </div>
    ),
  },
  {
    id: "data-model",
    title: "Datenmodell",
    icon: Database,
    content: (
      <div className="space-y-6">
        <p className="text-slate-300">
          Die Daten werden in Neo4j als Knoten (Nodes) und Kanten (Relationships) gespeichert.
        </p>

             <div className="relative w-full h-64 md:h-80 border border-slate-700 rounded-xl overflow-hidden bg-slate-950">
             <Image 
                src={visualisationImage}
                alt="Visualisierung des Routing Algorithmus"
                fill
                className="object-contain" 
             />
        </div>
        
        <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Node Structure</span>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm overflow-x-auto shadow-inner">
              <span className="text-green-400 block mb-2">// Beispiel: Node</span>
              <div className="text-blue-300 mb-1">Node ID: 4:0a462e1b-8cda-4bcd-a3eb-faa4f7e1c95f:167935</div>
              <pre className="text-orange-300">
      {`{
        area_id: 41
        emergency_vehicle_only: false
        flood_fill: 1
        is_highway: false
        link_count: 2
        link_id: 713
        node_id: 337
        parking: false
        path_width: 40
        traffic_level: 2
        type: "Car"
        x: -1585.75
        y: 1172.0
        z: 6.0
      }`}
              </pre>
            </div>
        </div>

        <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Relationship Structure</span>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm overflow-x-auto shadow-inner">
            <span className="text-green-400 block mb-2">// Beispiel: Edge</span>
            <div className="text-blue-300 mb-1">Edge ID: 5:0a462e1b-8cda-4bcd-a3eb-faa4f7e1c95f:113343</div>
            <pre className="text-orange-300">
        {`
          is_highway: false
          length: 12`}
              </pre>
            </div>
        </div>
      </div>
    ),
  },
  {
    id: "routing",
    title: "Routing Algorithmus",
    icon: Share2,
    content: (
      <div className="space-y-6">
        <p className="text-slate-300">
          Die Routenberechnung erfolgt serverseitig direkt in der Datenbank.
          Wir nutzen Neo4j's <code>shortestPath</code> Funktion.
        </p>

        <p className="text-xs text-center text-slate-500 mt-2">Visualisierung des Graphen-Netzwerks</p>
        
        <Card className="bg-slate-800/50 border-slate-700 mt-4">
          <CardContent className="p-4">
            <h4 className="font-semibold text-white mb-2">Logik-Ablauf:</h4>
            <ol className="list-decimal pl-5 space-y-1 text-slate-300">
              <li>Klick-Koordinaten (Start/Ziel) erfassen.</li>
              <li>Nächste verfügbare Nodes in der DB finden (Nearest Neighbor).</li>
              <li>Filter anwenden (z.B. <code>is_highway: false</code>).</li>
              <li>Graph-Traversal (Dijkstra/A*) ausführen.</li>
              <li>Pfad als Array von Koordinaten zurückgeben.</li>
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
        <p className="text-slate-300">Ausgewählte Anwendungsfälle:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Fußgänger Routing", desc: "Vermeidet Autobahnen, nutzt Gehwege." },
            { title: "Auto (Schnell)", desc: "Bevorzugt Highways und Hauptstraßen." },
            { title: "Auto (Landschaft)", desc: "Vermeidet Highways, nutzt Nebenstraßen." },
            { title: "Zukunft: Boot", desc: "Routing nur auf Wasser-Knoten." }
          ].map((uc, i) => (
            <div key={i} className="bg-slate-800 p-4 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors">
               <strong className="text-cyan-400 block mb-1">{uc.title}</strong>
               <span className="text-slate-400 text-sm">{uc.desc}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// ------------------------------------------------------------------
// PAGE COMPONENT
// ------------------------------------------------------------------

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState(docSections[0].id);

  // Smooth Scroll Funktion
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Offset für den Header berücksichtigen
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800">
                <ChevronLeft className="h-4 w-4" />
                Zurück zur App
              </Button>
            </Link>
            <span className="hidden font-bold sm:inline-block text-white self-center">
              GTASA Navigator Docs
            </span>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 pt-8 pb-20">
        
        {/* Sidebar Navigation */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r border-slate-800 pr-4 overflow-y-auto">
          <div className="h-full py-6 pl-2 lg:py-8">
            <nav className="flex flex-col space-y-1">
              {docSections.map((section) => {
                const Icon = section.icon || Code2;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all text-left",
                      activeSection === section.id
                        ? "bg-slate-800 text-cyan-400 shadow-sm border-r-2 border-cyan-400 rounded-r-none"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
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
          <div className="mx-auto w-full min-w-0 max-w-3xl">
            {docSections.map((section) => (
              <div key={section.id} id={section.id} className="mb-16 scroll-mt-24">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                  {section.icon && (
                    <div className="p-2 bg-slate-800/50 rounded-lg text-cyan-400 ring-1 ring-slate-700">
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
          
          {/* Right side TOC (optional) */}
          <div className="hidden text-sm xl:block">
            <div className="sticky top-24">
              <h3 className="font-semibold text-slate-100 mb-4 uppercase text-xs tracking-wider">Inhalt</h3>
              <ul className="space-y-3 border-l border-slate-800">
                {docSections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "block border-l-2 pl-4 -ml-[1px] transition-colors hover:text-white text-left w-full text-xs py-1",
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