package com.infosys.clinicaloperations.config;

import com.infosys.clinicaloperations.entity.*;
import com.infosys.clinicaloperations.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedDoctorsAndUserAccounts();
        seedSamplePatientAppointmentsAndPrescriptions();
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@icop.com")) {
            log.info("Bootstrapping default Admin account...");
            User admin = User.builder()
                    .fullName("ICOP Administrator")
                    .email("admin@icop.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default Admin created: admin@icop.com / Admin@123");
        }
    }

    private void seedDoctorsAndUserAccounts() {
        log.info("Checking specialist doctors and login accounts...");
        List<Doctor> doctors = Arrays.asList(
                Doctor.builder()
                        .name("Dr. Sarah Jenkins")
                        .email("dr.sarah@icop.com")
                        .phone("+1 (555) 234-5678")
                        .specialization("Cardiology")
                        .qualification("MD, FACC - Harvard Medical")
                        .experience(14)
                        .availableDays("Mon, Tue, Wed, Thu")
                        .consultationFee(new BigDecimal("150.00"))
                        .active(true)
                        .build(),
                Doctor.builder()
                        .name("Dr. Alex Vance")
                        .email("dr.alex@icop.com")
                        .phone("+1 (555) 345-6789")
                        .specialization("Neurology")
                        .qualification("MD, PhD - Johns Hopkins")
                        .experience(12)
                        .availableDays("Tue, Thu, Fri")
                        .consultationFee(new BigDecimal("180.00"))
                        .active(true)
                        .build(),
                Doctor.builder()
                        .name("Dr. Priya Patel")
                        .email("dr.priya@icop.com")
                        .phone("+1 (555) 456-7890")
                        .specialization("Pediatrics")
                        .qualification("MBBS, MD - Stanford University")
                        .experience(9)
                        .availableDays("Mon, Wed, Fri, Sat")
                        .consultationFee(new BigDecimal("120.00"))
                        .active(true)
                        .build(),
                Doctor.builder()
                        .name("Dr. Marcus Chen")
                        .email("dr.marcus@icop.com")
                        .phone("+1 (555) 567-8901")
                        .specialization("Orthopedics")
                        .qualification("MS (Ortho), FRCS - Mayo Clinic")
                        .experience(16)
                        .availableDays("Mon, Tue, Thu")
                        .consultationFee(new BigDecimal("200.00"))
                        .active(true)
                        .build(),
                Doctor.builder()
                        .name("Dr. Elena Rostova")
                        .email("dr.elena@icop.com")
                        .phone("+1 (555) 678-9012")
                        .specialization("Dermatology")
                        .qualification("MD, FAAD - Columbia University")
                        .experience(8)
                        .availableDays("Wed, Thu, Fri, Sat")
                        .consultationFee(new BigDecimal("130.00"))
                        .active(true)
                        .build()
        );

        for (Doctor doc : doctors) {
            if (!doctorRepository.existsByEmail(doc.getEmail())) {
                doctorRepository.save(doc);
            }
            if (!userRepository.existsByEmail(doc.getEmail())) {
                User docUser = User.builder()
                        .fullName(doc.getName())
                        .email(doc.getEmail().toLowerCase())
                        .password(passwordEncoder.encode("Doctor@123"))
                        .role(Role.DOCTOR)
                        .build();
                userRepository.save(docUser);
            }
        }
        log.info("Ensured {} doctors have Doctor role logins.", doctors.size());
    }

    private void seedSamplePatientAppointmentsAndPrescriptions() {
        // Find or create Dr Sarah
        Doctor doctor = doctorRepository.findByEmail("dr.sarah@icop.com").orElse(null);
        if (doctor == null) return;
        
        // Find or create patient John Doe
        Patient savedPatient;
        if (patientRepository.count() == 0) {
            log.info("Bootstrapping sample patient, appointments, and digital prescription...");
            User patientUser = User.builder()
                    .fullName("John Doe")
                    .email("john.doe@example.com")
                    .password(passwordEncoder.encode("Patient@123"))
                    .role(Role.PATIENT)
                    .build();
            User savedUser = userRepository.save(patientUser);

            Patient patient = Patient.builder()
                    .user(savedUser)
                    .phone("+1 (555) 987-6543")
                    .dateOfBirth(LocalDate.of(1990, 5, 15))
                    .gender("Male")
                    .address("742 Evergreen Terrace, Springfield, OR")
                    .build();
            savedPatient = patientRepository.save(patient);
            log.info("Sample patient seeded: john.doe@example.com / Patient@123");
        } else {
            savedPatient = patientRepository.findAll().stream().findFirst().orElse(null);
        }

        if (savedPatient != null && appointmentRepository.findByDoctorEmail(doctor.getEmail()).isEmpty()) {
            log.info("Seeding appointments for Dr. Sarah Jenkins...");
            Appointment appointment1 = Appointment.builder()
                    .patient(savedPatient)
                    .doctor(doctor)
                    .appointmentDate(LocalDate.now().plusDays(2))
                    .appointmentTime("10:00 AM")
                    .reason("Routine cardiovascular follow-up")
                    .status(AppointmentStatus.CONFIRMED)
                    .notes("Initial consultation confirmed by Dr. Sarah.")
                    .build();
            appointmentRepository.save(appointment1);

            // Sample pending appointment
            Appointment appointmentPending = Appointment.builder()
                    .patient(savedPatient)
                    .doctor(doctor)
                    .appointmentDate(LocalDate.now().plusDays(1))
                    .appointmentTime("11:30 AM")
                    .reason("Experiencing mild chest pain after exercise")
                    .status(AppointmentStatus.PENDING)
                    .notes("")
                    .build();
            appointmentRepository.save(appointmentPending);

            // Sample completed appointment with prescription
            Appointment appointment2 = Appointment.builder()
                    .patient(savedPatient)
                    .doctor(doctor)
                    .appointmentDate(LocalDate.now().minusDays(3))
                    .appointmentTime("02:00 PM")
                    .reason("Hypertension and mild dizziness evaluation")
                    .status(AppointmentStatus.COMPLETED)
                    .notes("Patient examination completed. Vital signs stable.")
                    .build();
            Appointment savedApt2 = appointmentRepository.save(appointment2);

            String sampleMedicinesJson = "[{\"medicineName\":\"Amlodipine\",\"dosage\":\"5mg\",\"frequency\":\"1-0-0 (Morning)\",\"duration\":\"30 Days\",\"instructions\":\"Take after breakfast\"},{\"medicineName\":\"Atorvastatin\",\"dosage\":\"10mg\",\"frequency\":\"0-0-1 (Night)\",\"duration\":\"30 Days\",\"instructions\":\"Take before bedtime\"}]";

            Prescription prescription = Prescription.builder()
                    .appointment(savedApt2)
                    .patient(savedPatient)
                    .doctor(doctor)
                    .diagnosis("Essential Hypertension - Grade 1")
                    .medicines(sampleMedicinesJson)
                    .advice("Reduce daily sodium intake (< 2g/day), engage in 30 mins moderate aerobic exercise, maintain BP log.")
                    .prescribedDate(LocalDate.now().minusDays(3))
                    .build();
            prescriptionRepository.save(prescription);
        }
    }
}
