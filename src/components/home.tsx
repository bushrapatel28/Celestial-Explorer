import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import StarField from "./StarField";
import ConstellationInfoPanel from "./ConstellationInfoPanel";
import MapControls from "./MapControls";

interface Constellation {
  id: string;
  name: string;
  mythology: string;
  notableStars: Array<{ name: string; description: string }>;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNorthernHemisphere, setIsNorthernHemisphere] = useState(true);
  const [selectedConstellation, setSelectedConstellation] =
    useState<Constellation | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Mock function to handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // In a real implementation, this would filter constellations
  };

  // Toggle between hemispheres
  const toggleHemisphere = () => {
    setIsNorthernHemisphere(!isNorthernHemisphere);
  };

  // Handle constellation selection
  const handleConstellationSelect = (constellation: Constellation) => {
    setSelectedConstellation(constellation);
    setIsPanelOpen(true);
  };

  // Close the info panel
  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900">
      {/* Header with search and controls */}
      <header className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-white">
            Constellation Explorer
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search form */}
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search constellations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4 text-slate-400" />
            </Button>
          </form>

          {/* Hemisphere toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 bg-slate-700 rounded-md px-3 py-1">
                  <span className="text-sm text-white">
                    {isNorthernHemisphere ? "Northern" : "Southern"} Hemisphere
                  </span>
                  <Toggle
                    pressed={!isNorthernHemisphere}
                    onPressedChange={toggleHemisphere}
                    aria-label="Toggle hemisphere"
                  >
                    <ChevronDown className="h-4 w-4 text-white" />
                  </Toggle>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle between Northern and Southern hemispheres</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {/* Main content area with star field */}
      <main className="relative flex-1 overflow-hidden">
        <StarField
          isNorthernHemisphere={isNorthernHemisphere}
          onSelectConstellation={handleConstellationSelect}
        />

        {/* Map controls positioned in bottom right */}
        <div className="absolute bottom-6 right-6 z-10">
          <MapControls />
        </div>

        {/* Constellation info panel */}
        {isPanelOpen && selectedConstellation && (
          <div className="absolute top-0 right-0 h-full z-20">
            <ConstellationInfoPanel
              constellation={selectedConstellation}
              onClose={handleClosePanel}
            />
          </div>
        )}
      </main>
    </div>
  );
}
