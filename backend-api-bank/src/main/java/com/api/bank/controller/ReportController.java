package com.api.bank.controller;

import com.api.bank.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping
    public String getReport(@RequestParam Long clientId,
                            @RequestParam String startDate,
                            @RequestParam String endDate,
                            @RequestParam(required = false, defaultValue = "json") String format) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);

        return reportService.generateReport(clientId, start, end, format);
    }
}
