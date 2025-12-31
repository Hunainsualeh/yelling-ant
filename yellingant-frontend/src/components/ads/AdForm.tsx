import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import Button from "../ui/Button" // Note: Button.tsx is capitalized in the file system
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Upload, Info } from "lucide-react"
import { createAd, updateAd } from "../../utils/api"
import { useToast } from "../ui/toast"
import { SuccessModal } from "../ui/SuccessModal"

interface AdFormProps {
  initialData?: any;
  isEditing?: boolean;
}
  
export function AdForm({ initialData, isEditing = false }: AdFormProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    slot: '',
    active: true,
    headline: '',
    heroImage: '',
    url: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        brand: initialData.brand || '',
        description: initialData.content?.description || '',
        slot: initialData.slot || '',
        active: initialData.status === 'active',
        headline: initialData.content?.headline || '',
        heroImage: initialData.content?.url || '',
        url: initialData.content?.link || ''
      });
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slot || !formData.url) {
      showToast('Please fill in all required fields (Name, Slot, Destination URL)', 'error');
      return;
    }

    setIsLoading(true)
    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        status: formData.active ? 'active' : 'inactive',
        slot: formData.slot,
        content: {
          type: 'image',
          url: formData.heroImage,
          link: formData.url,
          headline: formData.headline,
          description: formData.description
        }
      };

      if (isEditing && initialData?.id) {
        await updateAd(initialData.id, payload);
        showToast('Ad updated successfully!', 'success');
      } else {
        await createAd(payload);
        showToast('Ad created successfully!', 'success');
      }

      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Failed to save ad:', error);
      showToast(error.message || 'Failed to save ad. Please try again.', 'error');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="creative">Creative</TabsTrigger>
        <TabsTrigger value="targeting">Targeting</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Basic details about your quiz advertisement campaign.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Ad Name</Label>
              <Input 
                id="name" 
                placeholder="e.g. Summer Refreshment Quiz" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand">Brand / Advertiser</Label>
              <Input 
                id="brand" 
                placeholder="e.g. Coca Cola" 
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Internal Description</Label>
              <Textarea 
                id="description" 
                placeholder="Notes about this campaign..." 
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slot">Ad Slot Placement</Label>
              <Select onValueChange={(val) => handleInputChange('slot', val)} value={formData.slot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select where this ad should appear" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sidebar">Sidebar (Quiz Page Vertical Cards)</SelectItem>
                  <SelectItem value="quiz-main">Quiz Main Content (Mid-roll)</SelectItem>
                  <SelectItem value="quiz-result">Quiz Results Page</SelectItem>
                  <SelectItem value="YA_QHOME_FEED_001">Homepage Feed Ad 1</SelectItem>
                  <SelectItem value="YA_QHOME_FEED_002">Homepage Feed Ad 2</SelectItem>
                  <SelectItem value="YA_QHOME_FEED_003">Homepage/Quiz Footer Ad</SelectItem>
                  <SelectItem value="YA_QHOME_TOP_001">Homepage Top Takeover</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Choose the specific location on the site where this ad will be displayed.</p>
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <Switch 
                id="active" 
                checked={formData.active}
                onCheckedChange={(checked) => handleInputChange('active', checked)}
              />
              <Label htmlFor="active">Set ad to active immediately after creation</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={() => setActiveTab("creative")}>Next: Creative</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="creative">
        <Card>
          <CardHeader>
            <CardTitle>Creative Assets</CardTitle>
            <CardDescription>Upload images and configure the interactive quiz content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <Label>Hero Image (Background)</Label>
              <div className="flex flex-col items-center justify-center w-full gap-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
                  {/* Preview Image */}
                  {formData.heroImage && (
                    <div className="absolute inset-0 w-full h-full">
                      <img src={formData.heroImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10 bg-white/80 p-2 rounded">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or SVG (MAX. 1200x630px)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          if (e.target?.result) {
                            handleInputChange('heroImage', e.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="headline">Quiz Headline</Label>
              <Input 
                id="headline" 
                placeholder="Which flavor matches your vibe?" 
                value={formData.headline}
                onChange={(e) => handleInputChange('headline', e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">Destination URL <span className="text-red-500">*</span></Label>
              <Input 
                id="url" 
                placeholder="https://example.com/landing-page" 
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
              />
              <p className="text-xs text-gray-500">Where the user will be redirected when clicking the ad.</p>
            </div>

            <div className="grid gap-4">
              <Label>Quiz Questions (Interactive)</Label>
              <div className="rounded-md border p-4 bg-gray-50">
                <p className="text-sm text-gray-500 italic">
                  Quiz question builder will be implemented in the next phase.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("general")}>
              Previous
            </Button>
            <Button onClick={() => setActiveTab("targeting")}>Next: Targeting</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="targeting">
        <Card>
          <CardHeader>
            <CardTitle>Targeting & Placement</CardTitle>
            <CardDescription>Select where and to whom this ad should be displayed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 pt-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date (Optional)</Label>
              <Input id="end-date" type="date" />
            </div>

            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 flex gap-3">
              <Info className="h-5 w-5 text-orange-600 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-orange-600">Budget Cap Information</p>
                <p className="text-gray-600">
                  The system will automatically pause the ad once it reaches the impressions limit defined in the global
                  settings.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("creative")}>
              Previous
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : (isEditing ? "Update Campaign" : "Create Campaign")}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>

    {/* Success Modal */}
    <SuccessModal
      isOpen={showSuccessModal}
      onClose={() => {
        setShowSuccessModal(false);
        navigate("/admin/ads-management");
      }}
      title={isEditing ? "Ad Updated Successfully!" : "Ad Created Successfully!"}
      message={`Your ad "${formData.name}" has been ${isEditing ? 'updated' : 'created'} and is now ${formData.active ? 'active' : 'inactive'}.`}
      actionLabel="Go to Ads Management"
    />
    </>
  )
}
