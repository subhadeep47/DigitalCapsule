package com.backend.utils;

import org.springframework.stereotype.Component;

@Component
public class Utils {

    public String getInitials(String name) {
        String[] names = name.split(" ");
        char firstInitial = names[0].toUpperCase().charAt(0);
        return names.length > 1 ? "" + firstInitial + names[names.length - 1].toUpperCase().charAt(0) : "" + firstInitial + firstInitial;
    }
}
