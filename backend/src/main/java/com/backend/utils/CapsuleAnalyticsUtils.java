package com.backend.utils;

import com.backend.dto.SummaryResponse;
import com.backend.model.Capsules;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class CapsuleAnalyticsUtils {

    @Autowired
    private EncryptionUtils encryptionUtils;

    public void decryptIfUnlocked(Capsules capsule) {
        if (capsule.getPersonalMessage() != null && isUnlocked(capsule.getDateToUnlock())) {
            try {
                capsule.setPersonalMessage(encryptionUtils.decrypt(capsule.getPersonalMessage()));
            } catch (Exception e) {
                capsule.setPersonalMessage(null); // fallback to hide on error
            }
        } else {
            capsule.setPersonalMessage(null); // hide message if locked
            capsule.setFileInfo(null);
        }
    }

    public boolean isUnlocked(LocalDate dateToUnlock) {
        LocalDate today = LocalDate.now();
        return !dateToUnlock.isAfter(today);
    }

    private int countUnlocksBetween(List<Capsules> capsules, LocalDate start, LocalDate end) {
        return (int) capsules.stream()
                .filter(c -> {
                    LocalDate unlockDate = c.getDateToUnlock();
                    return !isUnlocked(c.getDateToUnlock()) &&
                            ((unlockDate.isEqual(start) || (unlockDate.isAfter(start)) &&
                            (unlockDate.isBefore(end)) || unlockDate.isEqual(end)));
                })
                .count();
    }

    public SummaryResponse.UpcomingUnlocks buildUpcoming(List<Capsules> allCapsules) {
        LocalDate today = LocalDate.now();

        SummaryResponse.UpcomingUnlocks upcoming = new SummaryResponse.UpcomingUnlocks();
        upcoming.setThisWeek(countUnlocksBetween(allCapsules, today, today.plusDays(7)));
        upcoming.setThisMonth(countUnlocksBetween(allCapsules, today, today.withDayOfMonth(today.lengthOfMonth())));
        upcoming.setNext30Days(countUnlocksBetween(allCapsules, today, today.plusDays(30)));

        return upcoming;
    }

    public List<SummaryResponse.NextUnlock> buildNextUnlocks(List<Capsules> created, List<Capsules> received, Map<String, String> senderNameMap) {
        LocalDate today = LocalDate.now();

        return Stream.concat(
                        created.stream().map(c -> mapToNextUnlock(c, "created", null)),
                        received.stream().map(c -> mapToNextUnlock(c, "received", senderNameMap.getOrDefault(c.getCreatedBy(), null)))
                )
                .filter(c -> {
                    LocalDate date = LocalDate.parse(c.getUnlockDate().substring(0, 10));
                    return !isUnlocked(date);
                })
                .sorted(Comparator.comparing(SummaryResponse.NextUnlock::getUnlockDate))
                .limit(6)
                .collect(Collectors.toList());
    }

    private SummaryResponse.NextUnlock mapToNextUnlock(Capsules capsule, String type, String senderName) {
        LocalDate unlockDate = capsule.getDateToUnlock();
        SummaryResponse.NextUnlock dto = new SummaryResponse.NextUnlock();
        dto.setId(capsule.getId());
        dto.setTitle(capsule.getTitle());
        dto.setUnlockDate(capsule.getDateToUnlock().toString());
        dto.setDaysRemaining((int) ChronoUnit.DAYS.between(LocalDate.now(), unlockDate));
        dto.setType(type);
        dto.setSenderName("received".equals(type) ? senderName : null);
        return dto;
    }

    private String getMonthKeyWithYear(Capsules c) {
        Month month = c.getDateToUnlock().getMonth();
        int year = c.getDateToUnlock().getYear();
        return month.getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + year;
    }

    private YearMonth parseMonthYear(String monthYear) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH);
        try {
            return YearMonth.parse(monthYear, formatter);
        } catch (Exception e) {
            return YearMonth.now(); // fallback if invalid format
        }
    }

    private double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

    public List<SummaryResponse.MonthlyStats> buildMonthlyStats(List<Capsules> created, List<Capsules> received, List<Capsules> all, String year) {
        Map<String, SummaryResponse.MonthlyStats> statsMap = new LinkedHashMap<>();

        created = created.stream()
                .filter(capsules -> {
                    return capsules.getDateToUnlock().getYear() == Integer.parseInt(year);
                })
                .toList();
        received = received.stream()
                .filter(capsules -> {
                    return capsules.getDateToUnlock().getYear() == Integer.parseInt(year);
                })
                .toList();
        all = all.stream()
                .filter(capsules -> {
                    return capsules.getDateToUnlock().getYear() == Integer.parseInt(year);
                })
                .toList();

        for (Capsules c : created) {
            String month = getMonthKeyWithYear(c);
            statsMap.computeIfAbsent(month, m -> new SummaryResponse.MonthlyStats()).setMonth(month);
            statsMap.get(month).setCreated(statsMap.get(month).getCreated() + 1);
        }

        for (Capsules c : received) {
            String month = getMonthKeyWithYear(c);
            statsMap.computeIfAbsent(month, m -> new SummaryResponse.MonthlyStats()).setMonth(month);
            statsMap.get(month).setReceived(statsMap.get(month).getReceived() + 1);
        }

        for (Capsules c : all) {
            if (isUnlocked(c.getDateToUnlock())) {
                String month = getMonthKeyWithYear(c);
                statsMap.computeIfAbsent(month, m -> new SummaryResponse.MonthlyStats()).setMonth(month);
                statsMap.get(month).setUnlocked(statsMap.get(month).getUnlocked() + 1);
            }
        }

        return statsMap.values().stream()
                .sorted(Comparator.comparing(m -> parseMonthYear(m.getMonth())))
                .collect(Collectors.toList());
    }

    public SummaryResponse.StorageUsed calculateStorage(List<Capsules> capsules) {
        double total = capsules.stream()
                .flatMap(c -> c.getFileInfo() != null ? c.getFileInfo().stream() : Stream.empty())
                .mapToDouble(f -> f != null ? f.getFileSize() : 0.0)
                .sum();

        SummaryResponse.StorageUsed s = new SummaryResponse.StorageUsed();
        s.setTotalMB(round(total));
        s.setLimitMB(1000.0);
        s.setPercentageUsed(round((total / 1000.0) * 100));
        return s;
    }
}
