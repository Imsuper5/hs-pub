package com.hundsun.bkos.official.dto;

import com.hundsun.bkos.base.ReturnDTO;

public class OfficialUserDTO extends ReturnDTO {
	private String userNo;
	private String officialAccountPwd;
	public String getUserNo() {
		return userNo;
	}
	public void setUserNo(String userNo) {
		this.userNo = userNo;
	}
	public String getOfficialAccountPwd() {
		return officialAccountPwd;
	}
	public void setOfficialAccountPwd(String officialAccountPwd) {
		this.officialAccountPwd = officialAccountPwd;
	}
}
