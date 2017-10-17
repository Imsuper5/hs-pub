package com.hundsun.bkos.official.dto;


import java.awt.image.BufferedImage;

import org.springframework.web.multipart.MultipartFile;

public class OfficialImgDTO {
	private MultipartFile myRelatedFile;
	private MultipartFile upfile;
	private MultipartFile file;
	private byte[] imgByte;
	private String uploadContentType;
	private String uploadFileName;
	private String savePath;
	private BufferedImage img;
	private String  prefixStr;
	
	
	

	public MultipartFile getFile() {
		return file;
	}

	public void setFile(MultipartFile file) {
		this.file = file;
	}

	public MultipartFile getUpfile() {
		return upfile;
	}

	public void setUpfile(MultipartFile upfile) {
		this.upfile = upfile;
	}

	public String getPrefixStr() {
		return prefixStr;
	}

	public void setPrefixStr(String prefixStr) {
		this.prefixStr = prefixStr;
	}


	public byte[] getImgByte() {
		return imgByte;
	}


	public void setImgByte(byte[] bs) {
		this.imgByte = bs;
	}


	public BufferedImage getImg() {
		return img;
	}


	public String getSavePath() {
		return savePath;
	}

	public void setSavePath(String savePath) {
		this.savePath = savePath;
	}



	public MultipartFile getMyRelatedFile() {
		return myRelatedFile;
	}

	public void setMyRelatedFile(MultipartFile myRelatedFile) {
		this.myRelatedFile = myRelatedFile;
	}

	public String getUploadContentType() {
		return uploadContentType;
	}

	public void setUploadContentType(String uploadContentType) {
		this.uploadContentType = uploadContentType;
	}

	public String getUploadFileName() {
		return uploadFileName;
	}

	public void setUploadFileName(String uploadFileName) {
		this.uploadFileName = uploadFileName;
	}

	public void setImg(BufferedImage image) {
		this.img = image;
	}
}
