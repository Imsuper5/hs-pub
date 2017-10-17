package com.hundsun.bkos.official.dto;

import com.hundsun.bkos.base.BaseDTO;

public class OfficialAccountMsgDTO extends BaseDTO{
	private static final long serialVersionUID = 1L;
	private Integer officialAccountMsgId;
	private Integer officialAccountId;
	private String officialMsgTitle;
	private byte[] officialMsgBody;
	private String officialMsgBodyStr;
	private String officialMsgAbstract;
	private String officialMsgUrl;
	private String officialMsgSrc;
	private String officialSrcUrl;
	private byte[] imageData;
	private String imageSuffix;
	private String msgStatus;
	private Long createDatetime;
	private Long lastUpdateDatetime;
	private Long pushDatetime;
	private byte[] imageDataDecode;
	private String officialMsgAuthor;
	
	
	public String getOfficialMsgBodyStr() {
		return officialMsgBodyStr;
	}
	public void setOfficialMsgBodyStr(String officialMsgBodyStr) {
		this.officialMsgBodyStr = officialMsgBodyStr;
	}
	public Integer getOfficialAccountMsgId() {
		return officialAccountMsgId;
	}
	public void setOfficialAccountMsgId(Integer officialAccountMsgId) {
		this.officialAccountMsgId = officialAccountMsgId;
	}
	public Integer getOfficialAccountId() {
		return officialAccountId;
	}
	public void setOfficialAccountId(Integer officialAccountId) {
		this.officialAccountId = officialAccountId;
	}
	public String getOfficialMsgTitle() {
		return officialMsgTitle;
	}
	public void setOfficialMsgTitle(String officialMsgTitle) {
		this.officialMsgTitle = officialMsgTitle;
	}
	public byte[] getOfficialMsgBody() {
		return officialMsgBody;
	}
	public void setOfficialMsgBody(byte[] officialMsgBody) {
		this.officialMsgBody = officialMsgBody;
	}
	public String getOfficialMsgAbstract() {
		return officialMsgAbstract;
	}
	public void setOfficialMsgAbstract(String officialMsgAbstract) {
		this.officialMsgAbstract = officialMsgAbstract;
	}
	public String getOfficialMsgUrl() {
		return officialMsgUrl;
	}
	public void setOfficialMsgUrl(String officialMsgUrl) {
		this.officialMsgUrl = officialMsgUrl;
	}
	public String getOfficialMsgSrc() {
		return officialMsgSrc;
	}
	public void setOfficialMsgSrc(String officialMsgSrc) {
		this.officialMsgSrc = officialMsgSrc;
	}
	public String getOfficialSrcUrl() {
		return officialSrcUrl;
	}
	public void setOfficialSrcUrl(String officialSrcUrl) {
		this.officialSrcUrl = officialSrcUrl;
	}
	public byte[] getImageData() {
		return imageData;
	}
	public void setImageData(byte[] imageData) {
		this.imageData = imageData;
	}
	public String getImageSuffix() {
		return imageSuffix;
	}
	public void setImageSuffix(String imageSuffix) {
		this.imageSuffix = imageSuffix;
	}
	public String getMsgStatus() {
		return msgStatus;
	}
	public void setMsgStatus(String msgStatus) {
		this.msgStatus = msgStatus;
	}
	public Long getCreateDatetime() {
		return createDatetime;
	}
	public void setCreateDatetime(Long createDatetime) {
		this.createDatetime = createDatetime;
	}
	public Long getLastUpdateDatetime() {
		return lastUpdateDatetime;
	}
	public void setLastUpdateDatetime(Long lastUpdateDatetime) {
		this.lastUpdateDatetime = lastUpdateDatetime;
	}
	public Long getPushDatetime() {
		return pushDatetime;
	}
	public void setPushDatetime(Long pushDatetime) {
		this.pushDatetime = pushDatetime;
	}
	public byte[] getImageDataDecode() {
		return imageDataDecode;
	}
	public void setImageDataDecode(byte[] imageDataDecode) {
		this.imageDataDecode = imageDataDecode;
	}
	public String getOfficialMsgAuthor() {
		return officialMsgAuthor;
	}
	public void setOfficialMsgAuthor(String officialMsgAuthor) {
		this.officialMsgAuthor = officialMsgAuthor;
	}

	
}
