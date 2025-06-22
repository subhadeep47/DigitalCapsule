package com.backend.service;

import java.io.IOException;
import java.io.InputStream;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.backend.model.Capsules;
import com.mongodb.client.gridfs.model.GridFSFile;

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
	
	public GridFSFile getFile(String fileId) {
        return gridFsTemplate.findOne(Query.query(Criteria.where("_id").is(new ObjectId(fileId))));
    }

    public InputStream getFileStream(GridFSFile file) throws IOException {
        return gridFsTemplate.getResource(file).getInputStream();
    }
    
    public void deleteFile(Capsules.FileInfo file) {
    	gridFsTemplate.delete(Query.query(Criteria.where("_id").is(new ObjectId(file.getFileId()))));
    }
}
