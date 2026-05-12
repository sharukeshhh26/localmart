package com.localmart.controller;

import com.localmart.model.Vendor;
import com.localmart.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VendorController {

    private final VendorService vendorService;

    @GetMapping
    public List<Vendor> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Double radius) {
        if (q != null && !q.isEmpty()) return vendorService.searchVendors(q);
        if (status != null)            return vendorService.getVendorsByStatus(status);
        if (radius != null)            return vendorService.getVendorsByRadius(radius);
        return vendorService.getAllVendors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(vendorService.getVendorById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Vendor create(@RequestBody Vendor vendor) {
        return vendorService.createVendor(vendor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vendor> update(@PathVariable Long id, @RequestBody Vendor vendor) {
        try {
            return ResponseEntity.ok(vendorService.updateVendor(id, vendor));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Vendor> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            return ResponseEntity.ok(vendorService.updateStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ← This is the endpoint that was causing the 404
    @PatchMapping("/{id}/view")
    public ResponseEntity<Void> incrementView(@PathVariable Long id) {
        try {
            vendorService.incrementViews(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            // Don't throw 404 for a view increment - silently ignore
            return ResponseEntity.ok().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }
}
