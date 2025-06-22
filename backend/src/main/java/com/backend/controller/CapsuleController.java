package com.backend.controller;

import java.io.InputStream;
import java.util.List;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.backend.model.Capsules;
import com.backend.service.CapsuleService;
import com.backend.utils.JwtUtils;
import com.mongodb.client.gridfs.model.GridFSFile;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/capsules")
public class CapsuleController {
	 	@Autowired
	    private CapsuleService capsuleService;

	    @Autowired
	    private JwtUtils jwtUtil;

	    // Helper method to extract email from JWT token
	    private String extractEmailFromToken(HttpServletRequest request) throws Exception {
	    	String token = jwtUtil.extractJwtFromCookies(request);
	        if (token == null) {
	            throw new Exception("Missing or invalid Authorization header");
	        }
	        return jwtUtil.extractEmail(token);
	    }

	    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	    public ResponseEntity<?> createCapsule(@RequestPart Capsules capsule, @RequestPart(value = "files", required = false) List<MultipartFile> files, HttpServletRequest request) {
	        try {
	            String email = extractEmailFromToken(request);
	            Capsules createdCapsule = capsuleService.createCapsule(capsule, files, email);
	            return ResponseEntity.ok(createdCapsule);
	        } catch (Exception e) {
	            return ResponseEntity.badRequest().body("Error creating capsule: " + e.getMessage());
	        }
	    }

	    @GetMapping("/created")
	    public ResponseEntity<?> getCreatedCapsules(HttpServletRequest request) {
	        try {
	            String email = extractEmailFromToken(request);
	            List<Capsules> capsules = capsuleService.getCapsulesCreatedBy(email);
	            return ResponseEntity.ok(capsules);
	        } catch (Exception e) {
	            return ResponseEntity.badRequest().body("Error fetching created capsules: " + e.getMessage());
	        }
	    }

	    @GetMapping("/received")
	    public ResponseEntity<?> getReceivedCapsules(HttpServletRequest request) {
	        try {
	            String email = extractEmailFromToken(request);
	            List<Capsules> capsules = capsuleService.getCapsulesReceivedBy(email);
	            return ResponseEntity.ok(capsules);
	        } catch (Exception e) {
	            return ResponseEntity.badRequest().body("Error fetching received capsules: " + e.getMessage());
	        }
	    }
	    
	    @GetMapping("/download/{fileId}")
	    public void downloadFile(@PathVariable String fileId, HttpServletResponse response) {
	        try {
	            GridFSFile file = capsuleService.getFileService().getFile(fileId);
	            InputStream stream = capsuleService.getFileService().getFileStream(file);
	            if (file.getMetadata().get("_contentType") == null) {
	                throw new NullPointerException("File metadata 'type' is missing");
	            }
	            response.setContentType(file.getMetadata().get("_contentType").toString());
	            response.setHeader("Content-Disposition", "attachment; filename=" + file.getFilename());
	            IOUtils.copy(stream, response.getOutputStream());
	            response.flushBuffer();
	        } catch (Exception e) {
	            throw new RuntimeException("File not found");
	        }
	    }

	    @DeleteMapping("/{id}")
	    public ResponseEntity<?> deleteCapsule(@PathVariable String id, HttpServletRequest request) {
	        try {
	            String email = extractEmailFromToken(request);
	            capsuleService.deleteCapsule(id, email);
	            return ResponseEntity.ok("Capsules deleted successfully");
	        } catch (Exception e) {
	            return ResponseEntity.badRequest().body("Error deleting capsule: " + e.getMessage());
	        }
	    }
}
