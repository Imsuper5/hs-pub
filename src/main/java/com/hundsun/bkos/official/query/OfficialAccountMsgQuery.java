package com.hundsun.bkos.official.query;

import org.springframework.web.multipart.MultipartFile;

import com.hundsun.bkos.base.BaseQuery;

public class OfficialAccountMsgQuery extends BaseQuery {
	private Integer msgId;
	private Integer officialAccountMsgId;
	private Integer officialAccountId;
	private String officialMsgTitle;
	private String officialMsgTitleBase64Str;
	private byte[] officialMsgBody;
	private String officialMsgBodyStr;
	private String officialMsgBodyBase64Str;
	private String officialMsgAbstract;
	private String officialMsgAbstractBase64Str;
	private String officialMsgUrl;
	private String officialMsgSrc;
	private String officialSrcUrl;
	private byte[] imageData;
	private String imageSuffix;
	private String msgStatus;
	private String msgStatusList;
	private Long beginDatetime;
	private Long endDatetime;
	private String officialMsgAuthor;
	private String officialMsgAuthorBase64Str;
	private Integer lastRecMsgId;//上次查询最后一条消息序号
	private Integer returnRecords;//返回记录数
	private Integer ifRetRowCount;//是否返回总记录条数
	private Integer includeImage = 0;//是否包含图片
	private MultipartFile myRelatedFile;
	
	

	public String getOfficialMsgBodyBase64Str() {
		return officialMsgBodyBase64Str;
	}

	public void setOfficialMsgBodyBase64Str(String officialMsgBodyBase64Str) {
		this.officialMsgBodyBase64Str = officialMsgBodyBase64Str;
	}

	public MultipartFile getMyRelatedFile() {
		return myRelatedFile;
	}

	public void setMyRelatedFile(MultipartFile myRelatedFile) {
		this.myRelatedFile = myRelatedFile;
	}

	public Integer getLastRecMsgId() {
		return lastRecMsgId;
	}

	public void setLastRecMsgId(Integer lastRecMsgId) {
		this.lastRecMsgId = lastRecMsgId;
	}

	public Integer getReturnRecords() {
		return returnRecords;
	}

	public void setReturnRecords(Integer returnRecords) {
		this.returnRecords = returnRecords;
	}

	public Integer getIfRetRowCount() {
		return ifRetRowCount;
	}

	public void setIfRetRowCount(Integer ifRetRowCount) {
		this.ifRetRowCount = ifRetRowCount;
	}

	public Integer getIncludeImage() {
		return includeImage;
	}

	public void setIncludeImage(Integer includeImage) {
		this.includeImage = includeImage;
	}

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

	public String getMsgStatusList() {
		return msgStatusList;
	}

	public void setMsgStatusList(String msgStatusList) {
		this.msgStatusList = msgStatusList;
	}

	public Long getBeginDatetime() {
		return beginDatetime;
	}

	public void setBeginDatetime(Long beginDatetime) {
		this.beginDatetime = beginDatetime;
	}

	public Long getEndDatetime() {
		return endDatetime;
	}

	public void setEndDatetime(Long endDatetime) {
		this.endDatetime = endDatetime;
	}


	public Integer getMsgId() {
		return msgId;
	}

	public void setMsgId(Integer msgId) {
		this.msgId = msgId;
	}

	public String getOfficialMsgAuthor() {
		return officialMsgAuthor;
	}

	public void setOfficialMsgAuthor(String officialMsgAuthor) {
		this.officialMsgAuthor = officialMsgAuthor;
	}

	public String getOfficialMsgAuthorBase64Str() {
		return officialMsgAuthorBase64Str;
	}

	public void setOfficialMsgAuthorBase64Str(String officialMsgAuthorBase64Str) {
		this.officialMsgAuthorBase64Str = officialMsgAuthorBase64Str;
	}

	public String getOfficialMsgTitleBase64Str() {
		return officialMsgTitleBase64Str;
	}

	public void setOfficialMsgTitleBase64Str(String officialMsgTitleBase64Str) {
		this.officialMsgTitleBase64Str = officialMsgTitleBase64Str;
	}

	public String getOfficialMsgAbstractBase64Str() {
		return officialMsgAbstractBase64Str;
	}

	public void setOfficialMsgAbstractBase64Str(String officialMsgAbstractBase64Str) {
		this.officialMsgAbstractBase64Str = officialMsgAbstractBase64Str;
	}

	

}
