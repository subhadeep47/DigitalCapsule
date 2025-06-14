package com.backend.service;

import java.io.IOException;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.backend.model.Capsules;

@Service
public class FileService {
	@Autowired
    private GridFsTemplate gridFsTemplate;
	
	public Capsules.FileInfo storeFile(MultipartFile file) throws IOException{
		ObjectId fileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());

        Capsules.FileInfo fileInfo = new Capsules.FileInfo();
        fileInfo.setFileId(fileId.toString());
        fileInfo.setFileName(file.getOriginalFilename());
        fileInfo.setFileSize(file.getSize() / (1024.0 * 1024.0));
        
        return fileInfo;
	}
}
