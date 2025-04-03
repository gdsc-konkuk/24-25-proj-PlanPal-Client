// src/pages/Explore/components/SearchBar.tsx
import { Globe, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
}) => {
  return (
    <div className="bg-background rounded-lg shadow-lg p-1 flex items-center">
      <div className="flex-1 flex items-center px-3">
        <Search className="h-5 w-5 text-foreground/50 mr-2" />
        <Input
          type="text"
          placeholder="Search for local experiences, food, attractions..."
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="hidden md:flex items-center border-l border-muted px-3">
        <Globe className="h-5 w-5 text-foreground/50 mr-2" />
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="border-0 w-[140px] focus:ring-0">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="tokyo">Tokyo</SelectItem>
            <SelectItem value="sydney">Sydney</SelectItem>
            <SelectItem value="bangkok">Bangkok</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="rounded-md m-1 bg-accent text-accent-foreground hover:bg-accent/90">
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
