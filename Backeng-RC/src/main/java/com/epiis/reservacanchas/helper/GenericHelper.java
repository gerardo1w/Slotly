package com.epiis.reservacanchas.helper;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

public class GenericHelper {

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy");

    public static String formatDate(Date date) {
        if (date == null) return "";
        return DATE_FORMAT.format(date);
    }

    public static String followCodeGeneration() {
        SimpleDateFormat yearFormat = new SimpleDateFormat("yyyy");
        String year = yearFormat.format(new Date());
        int randomNum = 1000 + new Random().nextInt(9000);
        return "RC-" + year + "-" + randomNum;
    }
}
