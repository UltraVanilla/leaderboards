/// A minecraft statistics leaderboard
export interface StatisticsLeaderboard {
    /// Statistic name
    name: string;
    /// Scores for each player for this statistic
    scores: { [name: string]: number };
    /// Ranks for each player for this statistic
    ranks: { [name: string]: number };
}
