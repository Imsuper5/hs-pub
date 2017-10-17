package com.hundsun.bkos.official.dto;

import com.hundsun.bkos.base.BaseDTO;

public class OfficialUserInfoDTO extends BaseDTO {
	private static final long serialVersionUID = 1L;
	private String avatar;
	private String name;
	private String company;
	private String body;
	private String pubDate;

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public String getPubDate() {
		return pubDate;
	}

	public void setPubDate(String pubDate) {
		this.pubDate = pubDate;
	}

}
