package com.hundsun.bkos.official.dto;

import com.hundsun.bkos.base.MessageDTO;

public class SendMessageDTO extends MessageDTO {
	private Integer tradeQuoteId;// id
	private String jids;
	private String content;
	private Integer quoteType;// 资产类型
	private Integer lowPeriod;
	private Integer upPeriod;
	private String priceType;
	private Double priceValue;
	private String mark;// 标签
	private String quoteDir;// 报价方向
	private Double quoteAmount;
	private String origText;
	
	public Integer getQuoteType() {
		return quoteType;
	}

	public void setQuoteType(Integer quoteType) {
		this.quoteType = quoteType;
	}

	public Integer getLowPeriod() {
		return lowPeriod;
	}

	public void setLowPeriod(Integer lowPeriod) {
		this.lowPeriod = lowPeriod;
	}

	public Integer getUpPeriod() {
		return upPeriod;
	}

	public void setUpPeriod(Integer upPeriod) {
		this.upPeriod = upPeriod;
	}

	public String getPriceType() {
		return priceType;
	}

	public void setPriceType(String priceType) {
		this.priceType = priceType;
	}

	public Double getPriceValue() {
		return priceValue;
	}

	public void setPriceValue(Double priceValue) {
		this.priceValue = priceValue;
	}

	public String getMark() {
		return mark;
	}

	public void setMark(String mark) {
		this.mark = mark;
	}

	public String getQuoteDir() {
		return quoteDir;
	}

	public void setQuoteDir(String quoteDir) {
		this.quoteDir = quoteDir;
	}

	public Double getQuoteAmount() {
		return quoteAmount;
	}

	public void setQuoteAmount(Double quoteAmount) {
		this.quoteAmount = quoteAmount;
	}

	//公众好消息
	private Integer officialAccountMsgId;
	

	public Integer getOfficialAccountMsgId() {
		return officialAccountMsgId;
	}

	public void setOfficialAccountMsgId(Integer officialAccountMsgId) {
		this.officialAccountMsgId = officialAccountMsgId;
	}

	

	public String getJids() {
		return jids;
	}

	public void setJids(String jids) {
		this.jids = jids;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Integer getTradeQuoteId() {
		return tradeQuoteId;
	}

	public void setTradeQuoteId(Integer tradeQuoteId) {
		this.tradeQuoteId = tradeQuoteId;
	}

	public String getOrigText() {
		return origText;
	}

	public void setOrigText(String origText) {
		this.origText = origText;
	}

	
}
