package com.hundsun.bkos.official.utils;

/**
 *  图片类型
 *
 */
public enum ImgType {
	JPEG( 1,"jpeg"),
	PNG( 2,"png"),
	JPG(3,"jpg");
	
	private final int name;
	public int getName() {
		return name;
	}
	public String getValue() {
		return value;
	}
	private final String value;
	ImgType(int name, String value) {
		this.name = name;
        this.value = value;
    }
}
