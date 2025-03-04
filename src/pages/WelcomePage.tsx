
import { useLocation, Navigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import WelcomeExperience from "@/components/WelcomeExperience";

const WelcomePage = () => {
  const location = useLocation();
  const characterData = location.state?.characterData;
  
  // If we don't have character data, redirect to character creation
  if (!characterData) {
    return <Navigate to="/create-character" replace />;
  }
  
  return (
    <PageLayout fullWidth>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <WelcomeExperience 
          characterName={characterData.name} 
          selectedRegion={characterData.region} 
        />
      </div>
    </PageLayout>
  );
};

export default WelcomePage;
