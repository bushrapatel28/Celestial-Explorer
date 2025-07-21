import React, { useState } from "react";
import { X, Info, Star, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface StarInfo {
  name: string;
  designation: string;
  magnitude: number;
  distance: number; // in light years
}

interface ConstellationInfo {
  id: string;
  name: string;
  latinName: string;
  mythology: string;
  notableStars: StarInfo[];
  bestVisibleSeason: string;
  area: number; // square degrees
  imageUrl?: string;
}

interface ConstellationInfoPanelProps {
  constellation?: ConstellationInfo;
  onClose?: () => void;
  isOpen?: boolean;
}

const ConstellationInfoPanel: React.FC<ConstellationInfoPanelProps> = ({
  constellation = {
    id: "ursa-major",
    name: "Ursa Major",
    latinName: "Ursa Major",
    mythology:
      'In Greek mythology, Ursa Major represents Callisto, a nymph who was transformed into a bear by Zeus\'s jealous wife Hera. Zeus placed her in the sky as the constellation Ursa Major (the "Great Bear") to honor her.',
    notableStars: [
      {
        name: "Dubhe",
        designation: "Alpha Ursae Majoris",
        magnitude: 1.79,
        distance: 123,
      },
      {
        name: "Merak",
        designation: "Beta Ursae Majoris",
        magnitude: 2.37,
        distance: 79.7,
      },
      {
        name: "Phecda",
        designation: "Gamma Ursae Majoris",
        magnitude: 2.44,
        distance: 83.2,
      },
      {
        name: "Alioth",
        designation: "Epsilon Ursae Majoris",
        magnitude: 1.77,
        distance: 81,
      },
      {
        name: "Mizar",
        designation: "Zeta Ursae Majoris",
        magnitude: 2.23,
        distance: 78,
      },
    ],
    bestVisibleSeason: "Spring",
    area: 1280,
    imageUrl:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
  },
  onClose = () => {},
  isOpen = true,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-lg transition-transform z-50 border-l">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="sticky top-0 z-10 bg-background pb-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{constellation.name}</CardTitle>
              <CardDescription className="italic">
                {constellation.latinName}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close panel</span>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">
                <Info className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="mythology">
                <BookOpen className="mr-2 h-4 w-4" />
                Mythology
              </TabsTrigger>
              <TabsTrigger value="stars">
                <Star className="mr-2 h-4 w-4" />
                Stars
              </TabsTrigger>
            </TabsList>

            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="p-6">
                  <TabsContent value="overview" className="mt-0">
                    {constellation.imageUrl && (
                      <div className="mb-6 overflow-hidden rounded-lg">
                        <img
                          src={constellation.imageUrl}
                          alt={constellation.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground">
                          Best visible during
                        </h3>
                        <p>{constellation.bestVisibleSeason}</p>
                      </div>

                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground">
                          Area
                        </h3>
                        <p>{constellation.area} square degrees</p>
                      </div>

                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground">
                          Notable features
                        </h3>
                        <p className="text-sm">
                          {constellation.name === "Ursa Major" &&
                            'Contains the famous asterism known as the "Big Dipper" or "Plough", which has been used for navigation for centuries.'}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="mythology" className="mt-0">
                    <div className="prose prose-sm max-w-none">
                      <p>{constellation.mythology}</p>

                      {constellation.name === "Ursa Major" && (
                        <>
                          <p>
                            Zeus later placed Callisto's son, Arcas, in the sky
                            as well as the constellation Ursa Minor (the "Little
                            Bear").
                          </p>
                          <p>
                            The constellation is also associated with various
                            myths in other cultures. In North America, the bowl
                            of the Big Dipper was seen as a bear being chased by
                            three hunters (the handle stars).
                          </p>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="stars" className="mt-0">
                    <div className="space-y-4">
                      {constellation.notableStars.map((star) => (
                        <div key={star.name} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{star.name}</h3>
                            <Badge variant="outline">
                              {star.magnitude} mag
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {star.designation}
                          </p>
                          <p className="text-sm mt-2">
                            Distance: {star.distance} light years
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </CardContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ConstellationInfoPanel;
