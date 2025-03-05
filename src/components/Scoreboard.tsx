
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

type LeaderboardUser = {
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  rank?: number;
};

const Scoreboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<LeaderboardUser | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar, level, xp')
          .order('xp', { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching leaderboard:", error);
          return;
        }

        // Add rank to each user
        const rankedData = data.map((user, index) => ({
          ...user,
          rank: index + 1
        }));

        setLeaderboard(rankedData);

        // Find current user's rank if they're logged in
        if (user) {
          // If user is not in top 10, fetch their rank separately
          if (!rankedData.some(item => item.id === user.id)) {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('id, username, avatar, level, xp')
              .eq('id', user.id)
              .single();

            if (!userError && userData) {
              // Count how many users have more XP
              const { count, error: countError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gt('xp', userData.xp);

              if (!countError) {
                setUserRank({
                  ...userData,
                  rank: (count || 0) + 1
                });
              }
            }
          } else {
            // User is in top 10, get their data from the leaderboard
            setUserRank(rankedData.find(item => item.id === user.id) || null);
          }
        }
      } catch (error) {
        console.error("Error in leaderboard fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Set up realtime subscription for profile changes
    const channel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        () => {
          // Refresh leaderboard data when any profile changes
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Global Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-center p-3 rounded-lg border ${
                  user && item.id === user.id ? "bg-teal-50 border-teal-200" : "bg-white"
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="font-bold text-lg min-w-8 text-center">
                    {item.rank === 1 && <Trophy className="h-6 w-6 text-yellow-500 mx-auto" />}
                    {item.rank !== 1 && <span>#{item.rank}</span>}
                  </div>
                  <Avatar className="h-12 w-12 border-2 border-white shadow">
                    <AvatarImage src={item.avatar} alt={item.username} />
                    <AvatarFallback>{item.username?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{item.username || "Adventurer"}</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-teal-600 mr-2">
                        Level {item.level}
                      </Badge>
                      <span className="text-sm text-gray-500">{item.xp} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {user && userRank && userRank.rank && userRank.rank > 10 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-teal-50 border-teal-200 border flex items-center p-3 rounded-lg">
              <div className="flex items-center space-x-4 flex-1">
                <div className="font-bold text-lg min-w-8 text-center">
                  #{userRank.rank}
                </div>
                <Avatar className="h-12 w-12 border-2 border-white shadow">
                  <AvatarImage src={userRank.avatar} alt={userRank.username} />
                  <AvatarFallback>{userRank.username?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{userRank.username || "Adventurer"}</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-teal-600 mr-2">
                      Level {userRank.level}
                    </Badge>
                    <span className="text-sm text-gray-500">{userRank.xp} XP</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Scoreboard;
