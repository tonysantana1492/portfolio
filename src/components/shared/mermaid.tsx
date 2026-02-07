"use client";

/** biome-ignore-all lint/nursery/useSortedClasses: <explanation.> */
/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <explanation.> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation.> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation.> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation.> */
import type React from "react";
import { useEffect, useRef, useState } from "react";

import mermaid from "mermaid";
import { cn } from "@/lib/utils";

mermaid.initialize({
  startOnLoad: true,
  theme: "base",
  securityLevel: "loose", // Allow html in the labels
  suppressErrorRendering: true,
  logLevel: "error",
  maxTextSize: 100000, // Increase text size limit
  htmlLabels: true,
  themeVariables: {
    background: "#111827",
    primaryColor: "#1F2937",
    secondaryColor: "#374151",
    tertiaryColor: "#4B5563",
    primaryTextColor: "#E5E7EB",
    lineColor: "#6B7280",
  },
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    nodeSpacing: 50,
    rankSpacing: 50,
    padding: 16,
  },
  sequence: {
    actorMargin: 50,
    messageMargin: 20,
    noteMargin: 10,
  },
  fontFamily: "var(--font-geist-sans), sans-serif",
  fontSize: 12,
  themeCSS: `
    /* Nodos y clusters con bordes redondeados */
    .node rect,
    .cluster rect {
      fill: #1F2937;
      stroke: #374151;
      stroke-width: 1.5px;
      border-radius: 10px;   
      rx: 10;                          
      ry: 10;                         
    }
    .node circle,
    .node ellipse {
      fill: #1F2937;
      stroke: #374151;
      stroke-width: 1.5px;
      rx: 10;                         
      ry: 10;                            
    }

    /* Etiquetas */
    .node text,
    .edgeLabel text {
      fill: #E5E7EB !important;
      font-weight: 500;
      white-space: pre-wrap !important;
    }

    .nodeLabel {
      white-space: pre-wrap !important;
    }

    /* Aristas */
    .edgePath .path {
      stroke: #6B7280;
      stroke-width: 1.2px;
      rx: 10;                          /* Radio horizontal para bordes redondeados */
      ry: 10;   
    }


    /* Efecto hover para elementos clicables */
    .clickable:hover {
      cursor: pointer;
      filter: brightness(1.1);
      transition: filter 0.2s ease;
      border-radius: 10px;           /* También redondea contenedores clicables */
    }

    /* Centrar y dar espacio al foreignObject */
    foreignObject {
       display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 5px; /* Espacio alrededor del contenido */
        width: 20%; /* Asegura que ocupe todo el ancho del nodo */
        height: 100%; /* Asegura que ocupe todo el alto del nodo */
    }

    /* Hacer transparente el fondo predeterminado */
    foreignObject:has(.edgeLabel) .edgeLabel,
    foreignObject:has(.edgeLabel) .labelBkg {
      background: transparent !important;
    }

    /* Padding horizontal y bordes redondeados en el <p> */
    foreignObject:has(.edgeLabel) p {
      padding: 0px 10px !important;         /* 5px de padding horizontal */ 
      border-radius: 8px !important;     /* Mantén esquinas redondeadas */
      width: content !important; /* Ajusta el ancho al contenido */ 
      white-space: nowrap !important;    /* Evita salto de línea inesperado */
      background: rgba(255,255,255,0.1) !important;
    }
  `,
});

interface MermaidProps {
  chart: string;
  className?: string;
  zoomingEnabled?: boolean;
}

// Full screen modal component for the diagram
const FullScreenModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle click outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Reset zoom when modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div
        ref={modalRef}
        className="card-japanese flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-[var(--card-bg)] shadow-custom"
      >
        {/* Modal header with controls */}
        <div className="flex items-center justify-between border-[var(--border-color)] border-b p-4">
          <div className="font-medium font-serif text-[var(--foreground)]"></div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="rounded-md border border-[var(--border-color)] p-2 text-[var(--foreground)] transition-colors hover:bg-[var(--accent-primary)]/10"
                aria-label="Zoom out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>zoom out</title>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
              <span className="text-[var(--muted)] text-sm">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="rounded-md border border-[var(--border-color)] p-2 text-[var(--foreground)] transition-colors hover:bg-[var(--accent-primary)]/10"
                aria-label="Zoom in"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>zoom in</title>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
              <button
                onClick={() => setZoom(1)}
                className="rounded-md border border-[var(--border-color)] p-2 text-[var(--foreground)] transition-colors hover:bg-[var(--accent-primary)]/10"
                aria-label="Reset zoom"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <title>reset zoom</title>
                  <path d="M21 3v5h-5"></path>
                </svg>
              </button>
            </div>
            <button
              onClick={onClose}
              className="rounded-md border border-[var(--border-color)] p-2 text-[var(--foreground)] transition-colors hover:bg-[var(--accent-primary)]/10"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>close</title>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Modal content with zoom */}
        <div className="flex flex-1 items-center justify-center overflow-auto bg-[var(--background)]/50 p-6">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              transition: "transform 0.3s ease-out",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const Mermaid: React.FC<MermaidProps> = ({ chart, className, zoomingEnabled = false }) => {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mermaid-1`);
  const isDarkModeRef = useRef(
    typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Initialize pan-zoom functionality when SVG is rendered
  useEffect(() => {
    if (svg && zoomingEnabled && containerRef.current) {
      const initializePanZoom = async () => {
        const svgElement = containerRef.current?.querySelector("svg");
        if (svgElement) {
          // Remove any max-width constraints
          svgElement.style.maxWidth = "none";
          svgElement.style.width = "100%";
          svgElement.style.height = "100%";

          try {
            // Dynamically import svg-pan-zoom only when needed in the browser
            const svgPanZoom = (await import("svg-pan-zoom")).default;

            svgPanZoom(svgElement, {
              zoomEnabled: true,
              controlIconsEnabled: true,
              fit: true,
              center: true,
              minZoom: 0.1,
              maxZoom: 10,
              zoomScaleSensitivity: 0.3,
            });
          } catch (error) {
            console.error("Failed to load svg-pan-zoom:", error);
          }
        }
      };

      // Wait for the SVG to be rendered
      setTimeout(() => {
        void initializePanZoom();
      }, 100);
    }
  }, [svg, zoomingEnabled]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation >
  useEffect(() => {
    if (!chart) return;

    let isMounted = true;

    const renderChart = async () => {
      if (!isMounted) return;

      try {
        setError(null);
        setSvg("");

        // Render the chart directly without preprocessing
        const { svg: renderedSvg } = await mermaid.render(idRef.current, chart);

        if (!isMounted) return;

        let processedSvg = renderedSvg;
        if (isDarkModeRef.current) {
          processedSvg = processedSvg.replace("<svg ", '<svg data-theme="dark" ');
        }

        setSvg(processedSvg);

        // Call mermaid.contentLoaded to ensure proper initialization
        setTimeout(() => {
          mermaid.contentLoaded();
        }, 50);
      } catch (err) {
        console.error("Mermaid rendering error:", err);

        const errorMessage = err instanceof Error ? err.message : String(err);

        if (isMounted) {
          setError(`Failed to render diagram: ${errorMessage}`);

          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `
              <div class="text-red-500 dark:text-red-400 text-xs mb-1">Syntax error in diagram</div>
              <pre class="text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-800 rounded">${chart}</pre>
            `;
          }
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, status]);

  const handleDiagramClick = () => {
    if (!error && svg) {
      setIsFullscreen(true);
    }
  };

  if (error) {
    return (
      <div
        className={`rounded-md border border-[var(--highlight)]/30 bg-[var(--highlight)]/5 p-4 ${className}`}
      >
        <div className="mb-3 flex items-center">
          <div className="flex items-center font-medium text-[var(--highlight)] text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <title>error</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Diagram rendering error
          </div>
        </div>
        <div ref={mermaidRef} className="overflow-auto text-xs"></div>
        <div className="mt-3 font-serif text-[var(--muted)] text-xs">
          The diagram contains a syntax error and cannot be rendered.
        </div>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-primary)]/70"></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-primary)]/70 delay-75"></div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-primary)]/70 delay-150"></div>
          <span className="ml-2 font-serif text-[var(--muted)] text-xs">Rendering diagram...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className={cn("my-4 w-full rounded-xl bg-neutral-800 p-1", zoomingEnabled && "h-[600px]")}
      >
        <div
          className={`group relative ${
            zoomingEnabled ? "h-full rounded-lg border-2 border-black" : ""
          }`}
        >
          <div
            className={`my-2 flex cursor-pointer justify-center overflow-auto rounded-md text-center transition-shadow duration-200 hover:shadow-md ${className} ${
              zoomingEnabled ? "h-full" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: svg }}
            onClick={zoomingEnabled ? undefined : handleDiagramClick}
            title={zoomingEnabled ? undefined : "Click to view fullscreen"}
          />

          {!zoomingEnabled && (
            <div className="pointer-events-none absolute top-2 right-2 flex items-center gap-1.5 rounded-md bg-gray-700/70 p-1.5 text-white text-xs opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 dark:bg-gray-900/70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>zoom in</title>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <span>Click to zoom</span>
            </div>
          )}
        </div>
      </div>

      {!zoomingEnabled && (
        <FullScreenModal isOpen={isFullscreen} onClose={() => setIsFullscreen(false)}>
          {/** biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation > */}
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </FullScreenModal>
      )}
    </>
  );
};

export default Mermaid;
