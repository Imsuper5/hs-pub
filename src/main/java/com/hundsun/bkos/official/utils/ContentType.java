package com.hundsun.bkos.official.utils;

/**
 *  HTPP ContentType类型
 *
 */
public enum ContentType {
	TEXT( 1,"text/html"),
	IMG( 2,"image/JPEG"),
	PLAIN(3,"text/plain");
	
	private final int name;
	public int getName() {
		return name;
	}
	public String getValue() {
		return value;
	}
	private final String value;
	ContentType(int name, String value) {
		this.name = name;
        this.value = value;
    }
}
