package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SummaryResponse {

    private int totalCapsules;
    private int createdCapsules;
    private int receivedCapsules;
    private int lockedCapsules;
    private int unlockedCapsules;

    private UpcomingUnlocks upcomingUnlocks;
    private List<NextUnlock> nextUnlocks;
    private List<MonthlyStats> monthlyStats;
    private StorageUsed storageUsed;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpcomingUnlocks {
        private int thisWeek;
        private int thisMonth;
        private int next30Days;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class NextUnlock {
        private String id;
        private String title;
        private String unlockDate;
        private int daysRemaining;
        private String senderName; // null if type is "created"
        private String type; // "created" or "received"
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyStats {
        private String month;
        private int created;
        private int received;
        private int unlocked;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StorageUsed {
        private double totalMB;
        private double limitMB;
        private double percentageUsed;
    }

}
