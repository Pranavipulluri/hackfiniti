
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile, Profile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
}

const ProfileEditDialog = ({ isOpen, onClose, profile }: ProfileEditDialogProps) => {
  const [username, setUsername] = useState(profile.username || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [region, setRegion] = useState(profile.region || "");
  const [isLoading, setIsLoading] = useState(false);
  const { updateProfile } = useProfile();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        username,
        bio,
        region
      });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="resize-none"
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="region">Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger id="region">
                <SelectValue placeholder="Select your region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia Hub">Asia Hub</SelectItem>
                <SelectItem value="Europe Hub">Europe Hub</SelectItem>
                <SelectItem value="Americas Hub">Americas Hub</SelectItem>
                <SelectItem value="Africa Hub">Africa Hub</SelectItem>
                <SelectItem value="Oceania Hub">Oceania Hub</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
