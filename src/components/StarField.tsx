import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Move } from "lucide-react";

interface Star {
  id: string;
  x: number;
  y: number;
  magnitude: number; // Brightness of star (lower is brighter)
}

interface Constellation {
  id: string;
  name: string;
  stars: string[]; // IDs of stars that form the constellation
  lines: [string, string][]; // Pairs of star IDs that form lines
  description: string;
  mythology: string;
  notableStars: {
    name: string;
    description: string;
  }[];
}

interface StarFieldProps {
  onConstellationSelect?: (constellation: Constellation | null) => void;
  hemisphere?: "northern" | "southern";
}

const StarField: React.FC<StarFieldProps> = ({
  onConstellationSelect = () => {},
  hemisphere = "northern",
}) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [constellations, setConstellations] = useState<Constellation[]>([]);
  const [hoveredConstellation, setHoveredConstellation] = useState<
    string | null
  >(null);
  const [selectedConstellation, setSelectedConstellation] = useState<
    string | null
  >(null);
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate mock data for stars and constellations
  useEffect(() => {
    // Generate random stars
    const generatedStars: Star[] = [];
    const starCount = 500;

    for (let i = 0; i < starCount; i++) {
      generatedStars.push({
        id: `star-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        magnitude: Math.random() * 2 + 0.1, // Between 0.1 and 2.1
      });
    }

    // Generate mock constellations based on hemisphere
    const northernConstellations: Constellation[] = [
      {
        id: "ursa-major",
        name: "Ursa Major",
        stars: [
          "star-1",
          "star-12",
          "star-23",
          "star-34",
          "star-45",
          "star-56",
          "star-67",
        ],
        lines: [
          ["star-1", "star-12"],
          ["star-12", "star-23"],
          ["star-23", "star-34"],
          ["star-34", "star-45"],
          ["star-45", "star-56"],
          ["star-56", "star-67"],
        ],
        description:
          "The Great Bear constellation, one of the most recognizable in the northern sky.",
        mythology:
          "In Greek mythology, Zeus transformed his lover Callisto into a bear, which was later placed in the sky as Ursa Major.",
        notableStars: [
          {
            name: "Dubhe",
            description: "Alpha Ursae Majoris, a red giant star",
          },
          {
            name: "Merak",
            description:
              "Beta Ursae Majoris, forms the pointer stars with Dubhe",
          },
        ],
      },
      {
        id: "cassiopeia",
        name: "Cassiopeia",
        stars: ["star-100", "star-110", "star-120", "star-130", "star-140"],
        lines: [
          ["star-100", "star-110"],
          ["star-110", "star-120"],
          ["star-120", "star-130"],
          ["star-130", "star-140"],
        ],
        description:
          "A prominent constellation in the northern sky, easily recognizable by its distinctive W shape.",
        mythology:
          "Named after the vain queen Cassiopeia in Greek mythology, who boasted about her beauty.",
        notableStars: [
          {
            name: "Schedar",
            description: "Alpha Cassiopeiae, an orange giant star",
          },
          {
            name: "Caph",
            description: "Beta Cassiopeiae, a yellow-white giant star",
          },
        ],
      },
    ];

    const southernConstellations: Constellation[] = [
      {
        id: "crux",
        name: "Crux (Southern Cross)",
        stars: ["star-200", "star-210", "star-220", "star-230"],
        lines: [
          ["star-200", "star-210"],
          ["star-210", "star-220"],
          ["star-200", "star-230"],
        ],
        description:
          "The smallest of the 88 modern constellations, but one of the most distinctive.",
        mythology:
          "Used for navigation in the southern hemisphere for centuries.",
        notableStars: [
          {
            name: "Acrux",
            description: "Alpha Crucis, a multiple star system",
          },
          {
            name: "Mimosa",
            description: "Beta Crucis, a blue-white giant star",
          },
        ],
      },
      {
        id: "centaurus",
        name: "Centaurus",
        stars: [
          "star-300",
          "star-310",
          "star-320",
          "star-330",
          "star-340",
          "star-350",
        ],
        lines: [
          ["star-300", "star-310"],
          ["star-310", "star-320"],
          ["star-320", "star-330"],
          ["star-330", "star-340"],
          ["star-340", "star-350"],
        ],
        description: "One of the largest constellations in the southern sky.",
        mythology:
          "Represents a centaur, a creature with the upper body of a human and the lower body of a horse.",
        notableStars: [
          {
            name: "Alpha Centauri",
            description: "The closest star system to the Solar System",
          },
          {
            name: "Hadar",
            description: "Beta Centauri, a blue-white giant star",
          },
        ],
      },
    ];

    setStars(generatedStars);
    setConstellations(
      hemisphere === "northern"
        ? northernConstellations
        : southernConstellations,
    );
  }, [hemisphere]);

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle constellation interactions
  const handleConstellationHover = (id: string) => {
    setHoveredConstellation(id);
  };

  const handleConstellationLeave = () => {
    setHoveredConstellation(null);
  };

  const handleConstellationClick = (id: string) => {
    const constellation = constellations.find((c) => c.id === id);
    if (constellation) {
      setSelectedConstellation(id);
      onConstellationSelect(constellation);
    }
  };

  // Find star by ID
  const getStarById = (id: string) => {
    return stars.find((star) => star.id === id);
  };

  // Render stars and constellations
  return (
    <div
      className="relative w-full h-full bg-black overflow-hidden"
      ref={containerRef}
    >
      {/* Star field */}
      <div
        className={`absolute w-full h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: "center",
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${Math.max(1, (3 - star.magnitude) * 2)}px`,
              height: `${Math.max(1, (3 - star.magnitude) * 2)}px`,
              opacity: Math.max(0.3, 1 - star.magnitude / 3),
            }}
          />
        ))}

        {/* Constellation lines */}
        {constellations.map((constellation) => (
          <svg
            key={constellation.id}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          >
            {constellation.lines.map((line, index) => {
              const star1 = getStarById(line[0]);
              const star2 = getStarById(line[1]);

              if (!star1 || !star2) return null;

              return (
                <line
                  key={`${constellation.id}-line-${index}`}
                  x1={`${star1.x}%`}
                  y1={`${star1.y}%`}
                  x2={`${star2.x}%`}
                  y2={`${star2.y}%`}
                  stroke={
                    hoveredConstellation === constellation.id ||
                    selectedConstellation === constellation.id
                      ? "#4CAF50"
                      : "#555"
                  }
                  strokeWidth={
                    hoveredConstellation === constellation.id ||
                    selectedConstellation === constellation.id
                      ? 2
                      : 1
                  }
                  strokeOpacity={
                    hoveredConstellation === constellation.id ||
                    selectedConstellation === constellation.id
                      ? 0.8
                      : 0.3
                  }
                />
              );
            })}
          </svg>
        ))}

        {/* Clickable constellation areas */}
        {constellations.map((constellation) => {
          // Calculate the bounding box of the constellation
          const starPositions = constellation.stars
            .map((id) => getStarById(id))
            .filter((star) => star !== undefined) as Star[];

          if (starPositions.length === 0) return null;

          const minX = Math.min(...starPositions.map((star) => star.x));
          const maxX = Math.max(...starPositions.map((star) => star.x));
          const minY = Math.min(...starPositions.map((star) => star.y));
          const maxY = Math.max(...starPositions.map((star) => star.y));

          // Add padding to the clickable area
          const padding = 2;

          return (
            <div
              key={`${constellation.id}-clickable`}
              className="absolute cursor-pointer"
              style={{
                left: `${minX - padding}%`,
                top: `${minY - padding}%`,
                width: `${maxX - minX + padding * 2}%`,
                height: `${maxY - minY + padding * 2}%`,
              }}
              onMouseEnter={() => handleConstellationHover(constellation.id)}
              onMouseLeave={handleConstellationLeave}
              onClick={() => handleConstellationClick(constellation.id)}
            >
              {/* Constellation label */}
              {(hoveredConstellation === constellation.id ||
                selectedConstellation === constellation.id) && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                  {constellation.name}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hemisphere indicator */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        {hemisphere === "northern"
          ? "Northern Hemisphere"
          : "Southern Hemisphere"}
      </div>
    </div>
  );
};

export default StarField;
