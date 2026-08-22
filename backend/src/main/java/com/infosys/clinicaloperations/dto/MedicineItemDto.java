package com.infosys.clinicaloperations.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineItemDto {
    private String medicineName;
    private String dosage;       // e.g. "500mg"
    private String frequency;    // e.g. "1-0-1 (Twice daily)"
    private String duration;     // e.g. "5 Days"
    private String instructions; // e.g. "After meals"
}
