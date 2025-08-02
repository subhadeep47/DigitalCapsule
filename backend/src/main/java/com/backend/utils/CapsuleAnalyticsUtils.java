package com.backend.utils;

import com.backend.dto.SummaryResponse;
import com.backend.model.Capsules;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
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
                    return date.isAfter(today) || date.isEqual(today);
                })
                .sorted(Comparator.comparing(SummaryResponse.NextUnlock::getUnlockDate))
                .limit(5)
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
}
