package com.minePing.BackEnd.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;

public class WorcationEnums {

    public enum Category {
        Office, Accommodation, OfficeAndStay;

    }

    public enum LocationType {
        mountain, river, sea, plain, city;

        public static LocationType from(String value) {
            return Arrays.stream(LocationType.values())
                    .filter(e -> e.name().equalsIgnoreCase(value))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid LocationType: " + value));
        }
    }

    public enum DominantColor {
        nature_earth, blue_sky, achromatic, yellow_orange, purple;

        public static DominantColor from(String value) {
            return Arrays.stream(DominantColor.values())
                    .filter(e -> e.name().equalsIgnoreCase(value))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid DominantColor: " + value));
        }
    }

    public enum SpaceMood {
        modern, eco_friendly, quiet, urban_nature, camping;

        public static SpaceMood from(String value) {
            return Arrays.stream(SpaceMood.values())
                    .filter(e -> e.name().equalsIgnoreCase(value))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid SpaceMood: " + value));
        }
    }

    public enum BestFor {
        work_efficiency, scenery, activity, rest, overall_vibe;

        public static BestFor from(String value) {
            return Arrays.stream(BestFor.values())
                    .filter(e -> e.name().equalsIgnoreCase(value))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid BestFor: " + value));
        }
    }

    public enum AccommodationType {
        clean_convenient, nature_lodging, camping_car, emotional_style, shared_space;

        public static AccommodationType from(String value) {
            return Arrays.stream(AccommodationType.values())
                    .filter(e -> e.name().equalsIgnoreCase(value))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Invalid AccommodationType: " + value));
        }
    }
}
