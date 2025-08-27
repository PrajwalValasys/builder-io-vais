import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  X,
  Search,
  Download,
  Info,
  FileText,
  MapPin,
  Tag,
  Building,
  CheckCircle,
  AlertCircle,
  Plus,
  Save,
  Clock,
  TrendingUp,
  Users,
  Target,
  Check,
  FileCheck,
  FileX,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormData {
  productSubcategory: string;
  productCategory: string;
  geolocation: string;
  intentTopics: string[];
  uploadedFile?: File;
}

interface SavedSearch {
  id: string;
  name: string;
  formData: FormData;
  createdAt: Date;
}

const productSubcategories = [
  "Software Solutions",
  "Hardware Components",
  "Cloud Services",
  "Analytics Tools",
  "Security Solutions",
  "AI/ML Platforms",
  "Data Management",
  "Infrastructure Services",
];

const productCategories = [
  "Enterprise Software",
  "Consumer Technology",
  "B2B Services",
  "SaaS Platform",
  "Mobile Applications",
  "IoT Solutions",
  "Cybersecurity",
  "Digital Marketing",
];

const geolocations = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East & Africa",
  "Global",
];

const intentTopics = [
  {
    name: "Request for Information (RFI)",
    description: "Prospects actively seeking product information",
    volume: "High",
    conversion: "85%",
  },
  {
    name: "Pricing Inquiry",
    description: "Ready-to-buy prospects comparing prices",
    volume: "Medium",
    conversion: "92%",
  },
  {
    name: "Product Demo",
    description: "Qualified prospects wanting to see the product",
    volume: "Medium",
    conversion: "88%",
  },
  {
    name: "Technical Support",
    description: "Existing customers needing assistance",
    volume: "High",
    conversion: "65%",
  },
  {
    name: "Partnership Opportunities",
    description: "Businesses seeking strategic partnerships",
    volume: "Low",
    conversion: "78%",
  },
  {
    name: "Implementation Services",
    description: "Prospects needing implementation help",
    volume: "Medium",
    conversion: "90%",
  },
  {
    name: "Training & Certification",
    description: "Organizations wanting team training",
    volume: "Medium",
    conversion: "82%",
  },
  {
    name: "Custom Development",
    description: "Prospects needing customization",
    volume: "Low",
    conversion: "95%",
  },
  {
    name: "Integration Support",
    description: "Technical prospects needing integration help",
    volume: "Medium",
    conversion: "87%",
  },
  {
    name: "Competitive Analysis",
    description: "Prospects comparing solutions",
    volume: "High",
    conversion: "70%",
  },
  {
    name: "Case Studies",
    description: "Prospects seeking proof of success",
    volume: "High",
    conversion: "75%",
  },
  {
    name: "Compliance & Security",
    description: "Security-focused prospects",
    volume: "Medium",
    conversion: "89%",
  },
];

const steps = [
  { id: 1, name: "Product Configuration", icon: Tag },
  { id: 2, name: "Intent Topics", icon: Target },
  { id: 3, name: "Suppression File", icon: Upload },
  { id: 4, name: "Build VAIS", icon: Building },
];

export default function BuildVAISForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    productSubcategory: "",
    productCategory: "",
    geolocation: "",
    intentTopics: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<"none" | "valid" | "invalid">(
    "none",
  );
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: "1",
      name: "Software Campaign Q3",
      formData: {
        productSubcategory: "Software Solutions",
        productCategory: "Enterprise Software",
        geolocation: "North America",
        intentTopics: ["Pricing Inquiry", "Product Demo"],
      },
      createdAt: new Date("2024-08-15"),
    },
  ]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newSearchName, setNewSearchName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTopics = intentTopics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTopics.includes(topic.name),
  );

  const handleTopicSelect = (topicName: string) => {
    if (!selectedTopics.includes(topicName)) {
      setSelectedTopics([...selectedTopics, topicName]);
      // Add micro-interaction animation class
      setTimeout(() => {
        const element = document.querySelector(`[data-topic="${topicName}"]`);
        if (element) {
          element.classList.add("animate-pulse");
          setTimeout(() => element.classList.remove("animate-pulse"), 500);
        }
      }, 100);
    }
    setSearchTerm("");
  };

  const handleTopicRemove = (topic: string) => {
    setSelectedTopics(selectedTopics.filter((t) => t !== topic));
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);

    // Validate file
    const validExtensions = [".xlsx", ".csv", ".txt"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (validExtensions.includes(fileExtension) && file.size <= maxSize) {
      setFileStatus("valid");
    } else {
      setFileStatus("invalid");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleSaveSearch = () => {
    if (newSearchName.trim()) {
      const newSearch: SavedSearch = {
        id: Date.now().toString(),
        name: newSearchName,
        formData: { ...formData, intentTopics: selectedTopics },
        createdAt: new Date(),
      };
      setSavedSearches([...savedSearches, newSearch]);
      setNewSearchName("");
      setShowSaveDialog(false);
    }
  };

  const loadSavedSearch = (search: SavedSearch) => {
    setFormData(search.formData);
    setSelectedTopics(search.formData.intentTopics);
  };

  const getStepProgress = () => {
    let progress = 0;
    if (formData.productSubcategory && formData.geolocation) progress = 25;
    if (selectedTopics.length > 0) progress = 50;
    if (uploadedFile) progress = 75;
    if (progress === 75 && isFormValid()) progress = 100;
    return progress;
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.productSubcategory && formData.geolocation;
      case 2:
        return selectedTopics.length > 0;
      case 3:
        return true; // Optional step
      case 4:
        return isFormValid();
      default:
        return false;
    }
  };

  const isFormValid = () => {
    return (
      formData.productSubcategory &&
      formData.geolocation &&
      selectedTopics.length > 0
    );
  };

  const handleBuildVAIS = () => {
    console.log("Building VAIS with data:", {
      ...formData,
      intentTopics: selectedTopics,
      uploadedFile,
    });
    // Navigate to results page
    navigate("/vais-results");
  };

  const getTopicInsight = (topic: (typeof intentTopics)[0]) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">{topic.name}</span>
        <Badge variant="outline" className="text-xs">
          {topic.conversion} convert
        </Badge>
      </div>
      <p className="text-sm text-gray-600">{topic.description}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          Volume: {topic.volume}
        </span>
        <span className="flex items-center">
          <Target className="w-3 h-3 mr-1" />
          Conversion: {topic.conversion}
        </span>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="w-full space-y-6">
        {/* Enhanced Header with Progress */}
        <Card className="bg-gradient-to-r from-valasys-orange/5 to-valasys-blue/5 border-valasys-orange/20">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center text-2xl">
                <Building className="w-6 h-6 mr-3 text-valasys-orange" />
                Build Your VAIS
              </CardTitle>
              <div className="flex items-center space-x-4">
                <Button
                  data-tour="vais-save-search"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveDialog(true)}
                  disabled={!isFormValid()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Search
                </Button>
              </div>
            </div>

            {/* Step Progress Indicator */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = isStepValid(step.id);

                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                          isActive
                            ? "border-valasys-orange bg-valasys-orange text-white"
                            : isCompleted
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-gray-300 bg-white text-gray-400",
                        )}
                      >
                        {isCompleted && !isActive ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "ml-2 text-sm font-medium",
                          isActive
                            ? "text-valasys-orange"
                            : isCompleted
                              ? "text-green-600"
                              : "text-gray-500",
                        )}
                      >
                        {step.name}
                      </span>
                      {index < steps.length - 1 && (
                        <div
                          className={cn(
                            "w-12 h-0.5 mx-4",
                            isCompleted ? "bg-green-500" : "bg-gray-300",
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <Progress value={getStepProgress()} className="h-2" />
            </div>

            <p className="text-valasys-gray-600">
              Configure your Valasys AI Score parameters to generate targeted
              prospect lists
            </p>
          </CardHeader>
        </Card>

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div data-tour="vais-saved-searches">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="w-5 h-5 mr-2 text-valasys-orange" />
                  Quick Access - Saved Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {savedSearches.map((search) => (
                    <Button
                      key={search.id}
                      variant="outline"
                      size="sm"
                      onClick={() => loadSavedSearch(search)}
                      className="flex items-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{search.name}</span>
                      <Badge variant="secondary" className="ml-1">
                        {search.formData.intentTopics.length} topics
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Product Configuration */}
            <div data-tour="vais-product-config">
              <Card
                className={cn(
                  "transition-all duration-200",
                  currentStep === 1
                    ? "ring-2 ring-valasys-orange/50 shadow-lg"
                    : "",
                )}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                          isStepValid(1)
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600",
                        )}
                      >
                        {isStepValid(1) ? <Check className="w-4 h-4" /> : "1"}
                      </div>
                      Product Configuration
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(1)}
                    >
                      Edit
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">
                        My Product Subcategory *
                      </Label>
                      <Select
                        value={formData.productSubcategory}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            productSubcategory: value,
                          })
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            formData.productSubcategory
                              ? "border-green-300"
                              : "",
                          )}
                        >
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {productSubcategories.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">My Product Category</Label>
                      <Select
                        value={formData.productCategory}
                        onValueChange={(value) =>
                          setFormData({ ...formData, productCategory: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="geolocation" className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Geolocation *
                    </Label>
                    <Select
                      value={formData.geolocation}
                      onValueChange={(value) =>
                        setFormData({ ...formData, geolocation: value })
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          formData.geolocation ? "border-green-300" : "",
                        )}
                      >
                        <SelectValue placeholder="Select target geography" />
                      </SelectTrigger>
                      <SelectContent>
                        {geolocations.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      disabled={!isStepValid(1)}
                    >
                      Next: Select Topics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Step 2: Intent Topics Selection */}
            <div data-tour="vais-intent-topics">
              <Card
                className={cn(
                  "transition-all duration-200",
                  currentStep === 2
                    ? "ring-2 ring-valasys-orange/50 shadow-lg"
                    : "",
                )}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                          isStepValid(2)
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600",
                        )}
                      >
                        {isStepValid(2) ? <Check className="w-4 h-4" /> : "2"}
                      </div>
                      Select Intent Topics *
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          selectedTopics.length > 0 ? "default" : "secondary"
                        }
                        className={
                          selectedTopics.length > 0 ? "bg-green-500" : ""
                        }
                      >
                        {selectedTopics.length} selected
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep(2)}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardTitle>
                  <p className="text-sm text-valasys-gray-600">
                    Select the intent topics (ITO intent topics are selected)
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search Intent Topics */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-valasys-gray-400" />
                    <Input
                      placeholder="Search intent topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Selected Topics - Enhanced Visualization */}
                  {selectedTopics.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Topics:</Label>
                      <div className="flex flex-wrap gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        {selectedTopics.map((topic) => (
                          <Badge
                            key={topic}
                            variant="default"
                            className="bg-valasys-orange hover:bg-valasys-orange/80 cursor-pointer transition-all duration-200 transform hover:scale-105"
                            onClick={() => handleTopicRemove(topic)}
                            data-topic={topic}
                          >
                            {topic}
                            <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Topics with Insights */}
                  <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                    <Label className="text-sm text-valasys-gray-600 mb-2 block">
                      Available Topics:
                    </Label>
                    {filteredTopics.length > 0 ? (
                      <div className="space-y-1">
                        {filteredTopics.map((topic) => (
                          <div
                            key={topic.name}
                            className="flex items-center justify-between p-2 hover:bg-valasys-gray-100 rounded cursor-pointer text-sm transition-all duration-200"
                          >
                            <span
                              className="flex-1"
                              onClick={() => handleTopicSelect(topic.name)}
                            >
                              {topic.name}
                            </span>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {topic.conversion}
                              </Badge>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                  >
                                    <Info className="w-3 h-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Topic Insights</DialogTitle>
                                  </DialogHeader>
                                  {getTopicInsight(topic)}
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-valasys-orange hover:text-white"
                                onClick={() => handleTopicSelect(topic.name)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-valasys-gray-500 text-center py-4">
                        {searchTerm
                          ? "No topics found"
                          : "All topics selected ✓"}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Previous
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      disabled={!isStepValid(2)}
                    >
                      Next: Upload File
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Step 3: File Upload with Enhanced Status */}
            <Card
              data-tour="vais-suppression-file"
              className={cn(
                "transition-all duration-200",
                currentStep === 3
                  ? "ring-2 ring-valasys-orange/50 shadow-lg"
                  : "",
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                        uploadedFile
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600",
                      )}
                    >
                      {uploadedFile ? <Check className="w-4 h-4" /> : "3"}
                    </div>
                    <div>
                      <div className="text-base">Upload Suppression File</div>
                      <div className="text-xs text-gray-500 font-normal">
                        (Optional)
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(3)}
                  >
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enhanced Upload Area */}
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer",
                    dragActive
                      ? "border-valasys-orange bg-valasys-orange/5 scale-105"
                      : "border-valasys-gray-300 hover:border-valasys-orange hover:bg-valasys-orange/5",
                    fileStatus === "valid"
                      ? "border-green-500 bg-green-50"
                      : fileStatus === "invalid"
                        ? "border-red-500 bg-red-50"
                        : "",
                  )}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-valasys-gray-400" />
                  <p className="text-sm text-valasys-gray-600 mb-1">
                    Select/Drop file to upload
                  </p>
                  <p className="text-xs text-valasys-gray-500">
                    .xlsx, .csv, .txt files up to 10MB
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".xlsx,.csv,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                {/* File Status */}
                {uploadedFile && (
                  <div
                    className={cn(
                      "border rounded-lg p-3",
                      fileStatus === "valid"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {fileStatus === "valid" ? (
                          <FileCheck className="w-4 h-4 text-green-600 mr-2" />
                        ) : (
                          <FileX className="w-4 h-4 text-red-600 mr-2" />
                        )}
                        <span
                          className={cn(
                            "text-sm font-medium",
                            fileStatus === "valid"
                              ? "text-green-800"
                              : "text-red-800",
                          )}
                        >
                          {uploadedFile.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedFile(null);
                          setFileStatus("none");
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        fileStatus === "valid"
                          ? "text-green-600"
                          : "text-red-600",
                      )}
                    >
                      {fileStatus === "valid"
                        ? "✓ File uploaded successfully"
                        : "❌ Invalid file format or size too large"}
                    </p>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Template
                </Button>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Previous
                  </Button>
                  <Button onClick={() => setCurrentStep(4)}>
                    Next: Build VAIS
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Build Action */}
            <Card
              data-tour="vais-ready-to-build"
              className={cn(
                "transition-all duration-200",
                currentStep === 4
                  ? "ring-2 ring-valasys-orange/50 shadow-lg"
                  : "",
              )}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center mb-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                      isFormValid()
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600",
                    )}
                  >
                    {isFormValid() ? <Check className="w-4 h-4" /> : "4"}
                  </div>
                  <span className="font-medium">Ready to Build</span>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        onClick={handleBuildVAIS}
                        className="w-full bg-valasys-orange hover:bg-valasys-orange/90 transition-all duration-200 transform hover:scale-105"
                        disabled={!isFormValid()}
                      >
                        {!isFormValid() && (
                          <AlertCircle className="w-4 h-4 mr-2" />
                        )}
                        Build Your VAIS
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!isFormValid() && (
                    <TooltipContent>
                      <p>Please complete required fields:</p>
                      <ul className="text-xs list-disc list-inside">
                        {!formData.productSubcategory && (
                          <li>Product Subcategory</li>
                        )}
                        {!formData.geolocation && <li>Geolocation</li>}
                        {selectedTopics.length === 0 && (
                          <li>At least one Intent Topic</li>
                        )}
                      </ul>
                    </TooltipContent>
                  )}
                </Tooltip>

                <div className="text-center text-xs text-valasys-gray-500">
                  AI Download Limit:{" "}
                  <span className="font-semibold">13,368</span>
                  <br />
                  Build from your selected search form list download search
                  results.
                </div>
              </CardContent>
            </Card>

            {/* Info Panel */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Pro Tip:</p>
                    <p>
                      Use specific intent topics to get more targeted results.
                      You can combine multiple topics for better precision.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Search Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Search Configuration</DialogTitle>
              <DialogDescription>
                Save this search configuration for future use.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter search name..."
                value={newSearchName}
                onChange={(e) => setNewSearchName(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSearch}
                  disabled={!newSearchName.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
